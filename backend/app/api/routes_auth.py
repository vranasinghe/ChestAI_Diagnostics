from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import get_db
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorLogin, DoctorOut, Token, DoctorUpdate
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.security import get_current_doctor
from app.models.auth import RefreshToken
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=DoctorOut, status_code=status.HTTP_201_CREATED)
def register(payload: DoctorCreate, db: Session = Depends(get_db)):
    # 1. Check if email already taken
    existing = db.query(Doctor).filter(Doctor.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # 2. Hash the password
    hashed = hash_password(payload.password)

    # 3. Create the doctor record
    doctor = Doctor(
        first_name=payload.first_name,
        last_name=payload.last_name,
        username="",  # Will be set after ID is generated
        email=payload.email,
        phone_no=payload.phone_no,
        qualification=payload.qualification,
        hashed_password=hashed,
    )
    db.add(doctor)
    db.flush()   # sends INSERT without committing so we get the auto-generated ID

    # 4. Generate username = FirstnameLastnameID   (e.g. "JohnDoe42")
    doctor.username = f"{payload.first_name}{payload.last_name}{doctor.id}"
    db.commit()
    db.refresh(doctor)

    return doctor


@router.post("/login", response_model=Token)
def login(payload: DoctorLogin, response: Response, db: Session = Depends(get_db)):
    # 1. Look up doctor by email
    doctor = db.query(Doctor).filter(Doctor.email == payload.email).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # 2. Verify password
    if not verify_password(payload.password, doctor.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # 3. Issue Access & Refresh Tokens
    token = create_access_token(
        data={"sub": str(doctor.id), "username": doctor.username}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(doctor.id)}
    )

    # 4. Save Refresh Token in DB
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    db_refresh = RefreshToken(
        doctor_id=doctor.id,
        token=refresh_token,
        expires_at=expires_at
    )
    db.add(db_refresh)
    db.commit()

    # 5. Set httpOnly secure cookies
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60 if hasattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES") else 1440 * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60, # 7 days
    )

    return Token(
        access_token=token,
        refresh_token=refresh_token,
        token_type="bearer",
        doctor=DoctorOut.from_orm(doctor),
    )


@router.post("/logout")
def logout(response: Response, db: Session = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    # Revoke all active refresh tokens for the doctor
    db.query(RefreshToken).filter(
        RefreshToken.doctor_id == current_doctor.id,
        RefreshToken.is_revoked == False
    ).update({"is_revoked": True})
    db.commit()

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="lax"
    )
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return {"detail": "Logged out successfully"}


@router.post("/refresh", response_model=Token)
def refresh_tokens(request: Request, response: Response, db: Session = Depends(get_db)):
    # Get refresh token from cookie or header
    from fastapi import Request
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            refresh_token = auth_header.split(" ")[1]

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        doctor_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Look up in DB
    db_token = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()

    # Token Recycling Security Check: If token is already revoked, revoke all tokens for this doctor!
    if db_token and db_token.is_revoked:
        db.query(RefreshToken).filter(RefreshToken.doctor_id == doctor_id).update({"is_revoked": True})
        db.commit()
        raise HTTPException(status_code=401, detail="Token compromised and revoked")

    if not db_token or db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Refresh token expired or invalid")

    # Valid token! Recycle: revoke old, generate new
    db_token.is_revoked = True
    
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=401, detail="Doctor not found")

    new_access = create_access_token(data={"sub": str(doctor_id), "username": doctor.username})
    new_refresh = create_refresh_token(data={"sub": str(doctor_id)})

    new_expires = datetime.now(timezone.utc) + timedelta(days=7)
    new_db_token = RefreshToken(
        doctor_id=doctor_id,
        token=new_refresh,
        expires_at=new_expires
    )
    db.add(new_db_token)
    db.commit()

    # Set new cookies
    response.set_cookie(
        key="access_token",
        value=new_access,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )

    return Token(
        access_token=new_access,
        refresh_token=new_refresh,
        token_type="bearer",
        doctor=DoctorOut.from_orm(doctor),
    )



@router.delete("/delete_account", status_code=status.HTTP_200_OK)
def delete_account(db: Session = Depends(get_db), current_doctor: Doctor = Depends(get_current_doctor)):
    # Find and delete the current doctor's account
    doctor = db.query(Doctor).filter(Doctor.id == current_doctor.id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )
    
    # Delete the doctor record
    db.delete(doctor)
    db.commit()
    
    return {"detail": "Account deleted successfully"}


@router.patch("/update-profile", response_model=DoctorOut)
def update_profile(
    payload: DoctorUpdate,
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    # Update fields if provided in partial payload
    if payload.first_name is not None:
        current_doctor.first_name = payload.first_name
    if payload.last_name is not None:
        current_doctor.last_name = payload.last_name
    if payload.phone_no is not None:
        current_doctor.phone_no = payload.phone_no
    if payload.qualification is not None:
        current_doctor.qualification = payload.qualification
    
    # Handle password change separately
    if payload.password is not None and payload.password != "":
        current_doctor.hashed_password = hash_password(payload.password)
        
    db.commit()
    db.refresh(current_doctor)
    return current_doctor

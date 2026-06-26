from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date

from app.db.session import get_db
from app.core.security import get_current_doctor
from app.models.doctor import Doctor
from app.models.patient import PatientPortfolio
from app.models.image import Image
from app.inference.inference_service import inference_service

router = APIRouter(prefix="/xray", tags=["xray"])


def _calculate_age(dob: date) -> int:
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


@router.post("/predict")
async def predict_xray(
    patient_id: UUID = Form(...),
    x_ray_view: str = Form("PA"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor),
):
    """
    Upload an X-ray image and return AI predictions + Grad-CAM heatmap.
    Requires a valid patient belonging to the authenticated doctor.
    """
    # 1. Fetch patient (must belong to this doctor)
    patient = db.query(PatientPortfolio).filter(
        PatientPortfolio.id == patient_id,
        PatientPortfolio.doctor_id == current_doctor.id,
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found or unauthorized",
        )

    # 2. Read image bytes
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    # 3. Run inference (binary + multiclass + Grad-CAM)
    result = inference_service.predict(image_bytes)

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result["error"],
        )

    # 4. Persist scan metadata
    patient_age = _calculate_age(patient.dob) if patient.dob else 0
    full_name = f"{patient.first_name} {patient.last_name}"

    db_image = Image(
        doctor_id=current_doctor.id,
        patient_name=full_name,
        patient_age=patient_age,
        gender=patient.gender.name if patient.gender else None,
        x_ray_view=x_ray_view,
    )
    db.add(db_image)
    db.commit()

    return {"status": "success", "data": result}

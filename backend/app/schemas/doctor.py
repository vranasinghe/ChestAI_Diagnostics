from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr


class DoctorCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_no: str
    qualification: str
    password: str


class DoctorUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_no: Optional[str] = None
    qualification: Optional[str] = None
    password: Optional[str] = None


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str


class DoctorOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    phone_no: str
    qualification: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    doctor: DoctorOut

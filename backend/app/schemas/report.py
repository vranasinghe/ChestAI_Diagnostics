from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.models.enums import ReportStatusEnum


class ReportCreate(BaseModel):
    patient_name: str
    status: ReportStatusEnum = ReportStatusEnum.DRAFT
    diagnosis: Optional[str] = None
    clinical_observations: Optional[str] = None
    treatment_plan: Optional[str] = None
    additional_comments: Optional[str] = None


class ReportUpdate(BaseModel):
    patient_name: Optional[str] = None
    status: Optional[ReportStatusEnum] = None
    diagnosis: Optional[str] = None
    clinical_observations: Optional[str] = None
    treatment_plan: Optional[str] = None
    additional_comments: Optional[str] = None


class ReportOut(BaseModel):
    report_id: int
    doctor_id: int
    patient_name: str
    status: ReportStatusEnum
    diagnosis: Optional[str] = None
    clinical_observations: Optional[str] = None
    treatment_plan: Optional[str] = None
    additional_comments: Optional[str] = None
    created_date: date

    class Config:
        from_attributes = True

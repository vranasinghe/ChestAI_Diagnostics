from enum import Enum

class GenderEnum(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class ReportStatusEnum(str, Enum):
    DRAFT = "Draft"
    PENDING_REVIEW = "Pending Review"
    FINALIZED = "Finalized"
    AMENDED = "Amended"

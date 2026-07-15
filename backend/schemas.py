from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel

StatusType = Literal["applied", "oa", "interview", "offer", "rejected", "ghosted"]


class ApplicationBase(BaseModel):
    company: str
    role: str
    status: StatusType = "applied"
    date_applied: Optional[date] = None
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    # All optional — this is a PATCH-style partial update
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[StatusType] = None
    date_applied: Optional[date] = None
    notes: Optional[str] = None


class ApplicationOut(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # lets Pydantic read SQLAlchemy objects directly

from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator


Severity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
AlertStatus = Literal["OPEN", "INVESTIGATING", "RESOLVED", "FALSE_POSITIVE"]


class LogEvent(BaseModel):
    timestamp: datetime
    source: str = Field(min_length=1, max_length=40)
    ip: str = Field(min_length=1, max_length=45)
    username: str | None = Field(default=None, max_length=100)
    event_type: str = Field(min_length=1, max_length=60)
    status: str = Field(min_length=1, max_length=40)
    destination_port: int | None = Field(default=None, ge=1, le=65535)
    request_path: str | None = Field(default=None, max_length=300)

    @field_validator("timestamp")
    @classmethod
    def normalize_timestamp(cls, value: datetime) -> datetime:
        if value.tzinfo is not None:
            return value.astimezone(timezone.utc).replace(tzinfo=None)
        return value


class DemoLoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=200)
    source_ip: str = Field(default="192.168.1.50", min_length=1, max_length=45)


class Alert(BaseModel):
    alert_id: str = Field(default_factory=lambda: f"AL-{uuid4().hex[:8].upper()}")
    timestamp: datetime
    ip: str
    threat_type: str
    severity: Severity
    risk_score: int = Field(ge=0, le=100)
    status: AlertStatus = "OPEN"
    evidence: list[str]


class IngestResponse(BaseModel):
    log: LogEvent
    alerts: list[Alert]

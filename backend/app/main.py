from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import Alert, DemoLoginRequest, IngestResponse, LogEvent
from app.services.detection import DetectionEngine

app = FastAPI(title="AI SOC Assistant API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

engine = DetectionEngine()
logs: list[LogEvent] = []
alerts: list[Alert] = []


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "online", "service": "soc-api"}


@app.post("/api/logs", response_model=IngestResponse, status_code=201)
def ingest_log(event: LogEvent) -> IngestResponse:
    logs.append(event)
    detected = engine.detect(event)
    alerts.extend(detected)
    return IngestResponse(log=event, alerts=detected)


@app.post("/api/demo/login")
def demo_login(request: DemoLoginRequest) -> dict[str, object]:
    """Simulate a protected login without persisting the submitted password."""
    event = LogEvent(
        timestamp=datetime.now(timezone.utc),
        source="demo-login",
        ip=request.source_ip,
        username=request.username,
        event_type="login",
        status="failed",
    )
    logs.append(event)
    detected = engine.detect(event)
    alerts.extend(detected)
    return {
        "authenticated": False,
        "message": "Login failed. This demo account rejected the credentials.",
        "alerts": detected,
    }


@app.get("/api/logs", response_model=list[LogEvent])
def list_logs() -> list[LogEvent]:
    return list(reversed(logs))


@app.get("/api/alerts", response_model=list[Alert])
def list_alerts() -> list[Alert]:
    return list(reversed(alerts))


@app.get("/api/summary")
def summary() -> dict[str, int]:
    return {
        "total_logs": len(logs),
        "total_alerts": len(alerts),
        "critical_alerts": sum(alert.severity == "CRITICAL" for alert in alerts),
        "open_incidents": 0,
    }

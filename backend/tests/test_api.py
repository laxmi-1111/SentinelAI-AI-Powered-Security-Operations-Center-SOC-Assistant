from fastapi.testclient import TestClient

from app.main import app, alerts, logs

client = TestClient(app)


def setup_function() -> None:
    logs.clear()
    alerts.clear()


def test_ingestion_creates_brute_force_alert_after_five_failures() -> None:
    for index in range(5):
        response = client.post("/api/logs", json={
            "timestamp": f"2026-08-19T18:30:{10 + index:02d}",
            "source": "linux",
            "ip": "192.168.1.50",
            "username": "admin",
            "event_type": "login",
            "status": "failed",
        })
        assert response.status_code == 201

    result = client.get("/api/alerts")
    assert result.status_code == 200
    assert result.json()[0]["threat_type"] == "Brute Force Attack"
    assert result.json()[0]["severity"] == "HIGH"
    assert result.json()[0]["risk_score"] == 60


def test_suspicious_ip_alert_is_generated() -> None:
    response = client.post("/api/logs", json={
        "timestamp": "2026-08-19T18:30:10",
        "source": "linux",
        "ip": "10.10.10.10",
        "username": "admin",
        "event_type": "login",
        "status": "success",
    })
    assert response.status_code == 201
    assert response.json()["alerts"][0]["threat_type"] == "Suspicious Source IP"


def test_demo_login_feeds_failed_attempt_into_detection_pipeline() -> None:
    for _ in range(5):
        response = client.post("/api/demo/login", json={
            "username": "admin",
            "password": "invalid",
            "source_ip": "192.168.1.50",
        })
        assert response.status_code == 200
        assert response.json()["authenticated"] is False

    assert client.get("/api/logs").json()[0]["event_type"] == "login"
    assert client.get("/api/alerts").json()[0]["threat_type"] == "Brute Force Attack"

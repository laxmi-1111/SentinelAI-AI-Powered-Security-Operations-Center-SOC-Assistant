# Argus AI SOC Assistant

A layered mini-SOC that turns raw security events into explainable alerts. Phase 1 uses deterministic rules and risk scoring; MongoDB, Isolation Forest, incidents, authentication, and WebSockets are intentionally staged for later phases.

## Run the API

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

## Run the dashboard

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The dashboard polls the API every five seconds. It also includes a small demo fallback while the API is offline.

## Try the detector

Post the events in `sample-logs/brute_force.json` to `POST /api/logs`. The fifth failed login from the same IP creates a `Brute Force Attack` alert with evidence and a risk score. The current API uses an in-memory repository so the demo has no database prerequisite; MongoDB is the next persistence layer.

## Current flow

`POST /api/logs` -> Pydantic normalization -> 60-second failed-login rule and watchlist rule -> risk score/severity -> stored alert -> dashboard polling.

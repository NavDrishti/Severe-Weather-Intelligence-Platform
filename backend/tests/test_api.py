"""
Pytest unit tests for NavDrishti AI FastAPI endpoints.
Validates section 19 API contracts, status codes, and data schemas.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["service"] == "NavDrishti-AI-Core"

def test_system_status():
    response = client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert "system_health" in data
    assert data["active_storms_count"] >= 1
    assert "data_sources" in data

def test_forecast_pune():
    response = client.get("/api/v1/forecast?lat=18.52&lon=73.86&horizon=30")
    assert response.status_code == 200
    data = response.json()
    assert data["location"]["name"] == "Pune"
    assert "lightning" in data["hazards"]
    assert "hail" in data["hazards"]
    assert "cloudburst" in data["hazards"]
    assert "downburst" in data["hazards"]
    assert data["hazards"]["lightning"]["probability"] == 0.85
    assert data["confidence"] == 0.75

def test_active_storms():
    response = client.get("/api/v1/storms/active")
    assert response.status_code == 200
    data = response.json()
    assert data["total_active"] >= 4
    assert len(data["storms"]) >= 1

def test_storm_detail():
    response = client.get("/api/v1/storms/CELL-MH-01")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "CELL-MH-01"
    assert "Pune-Ahmednagar" in data["name"]
    assert len(data["track"]) > 0

def test_alerts_and_review():
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    alerts = response.json()["alerts"]
    assert len(alerts) >= 1
    
    # Test review action
    alert_id = alerts[0]["id"]
    rev_resp = client.post(
        f"/api/v1/alerts/{alert_id}/review",
        json={"reviewer_name": "Test Officer", "action": "approved", "notes": "Verified against radar echo"}
    )
    assert rev_resp.status_code == 200
    assert rev_resp.json()["alert"]["status"] == "approved"

def test_data_health():
    response = client.get("/api/v1/data-health")
    assert response.status_code == 200
    data = response.json()
    assert len(data["sources"]) >= 4

def test_replay_cases():
    response = client.get("/api/v1/replay/cases")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 3

def test_analytics_metrics():
    response = client.get("/api/v1/analytics/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["overall"]["pod"] > 0.8
    assert "baseline_comparison" in data

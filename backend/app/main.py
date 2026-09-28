"""
NavDrishti AI - Core FastAPI Backend Service
SIH PS 26084: Convective-Scale Nowcasting for Thunderstorms, Hail & Cloudbursts (0-6 hr)
"""

from fastapi import FastAPI, Query, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import asyncio
import json

from backend.app.data.seed_data import (
    STORMS,
    LOCATION_FORECAST_PUNE,
    DATA_SOURCES_HEALTH,
    ALERTS,
    REPLAY_CASES,
    ANALYTICS_METRICS,
    SEARCHABLE_LOCATIONS,
    BASE_TIME_IST
)
from backend.app.schemas.weather import (
    ForecastResponse,
    LocationInfo,
    HazardDetail,
    StormEta,
    AlertReviewRequest
)

app = FastAPI(
    title="NavDrishti AI - Severe Weather Intelligence API",
    description="Hyperlocal Convective Weather Intelligence for Safer Decisions (SIH PS 26084)",
    version="1.4.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory mutable copies for interactive reviews during presentation
alerts_db = [dict(a) for a in ALERTS]

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "operational",
        "service": "NavDrishti-AI-Core",
        "version": "1.4.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mode": "Research & Decision Support Prototype"
    }

@app.get("/api/v1/system/status")
async def system_status():
    return {
        "system_health": "All Systems Operational",
        "health_code": "operational",
        "ist_time": BASE_TIME_IST,
        "active_storms_count": len(STORMS),
        "active_alerts_count": len([a for a in alerts_db if a["status"] in ["pending_review", "approved"]]),
        "data_sources": {s["key"]: s["status"] for s in DATA_SOURCES_HEALTH},
        "model_version": "NavDrishti-Fusion-v1.4",
        "disclaimer": "Demonstration data — Not an official warning unless issued by IMD/authorized agency."
    }

@app.get("/api/v1/forecast")
async def get_forecast(
    lat: float = Query(18.52, description="Latitude"),
    lon: float = Query(73.86, description="Longitude"),
    horizon: int = Query(30, description="Forecast horizon in minutes (0-360)")
):
    # Match Pune baseline or generate nearby estimate
    resp = dict(LOCATION_FORECAST_PUNE)
    resp["run_id"] = f"run-{datetime.now().strftime('%Y%m%d-%H%M00')}"
    resp["issue_time"] = BASE_TIME_IST
    resp["valid_time"] = "2025-05-20T18:05:00+05:30"
    resp["horizon_minutes"] = horizon
    resp["location"]["lat"] = lat
    resp["location"]["lon"] = lon
    resp["provenance"] = {
        "sources": ["radar_dwr", "insat_3ds", "lightning_liden", "aws_surface", "ncum_nwp"],
        "model_version": "NavDrishti-Fusion-v1.4",
        "forecast_type": "observation_dominant" if horizon <= 90 else ("multi_source_fusion" if horizon <= 180 else "nwp_assisted_extension")
    }
    return resp

@app.get("/api/v1/forecast/grid")
async def get_forecast_grid(
    bbox: Optional[str] = Query("72.0,17.0,76.0,21.0"),
    hazard: Optional[str] = Query("all"),
    valid_time: Optional[str] = None
):
    # Simulated 1-3km grid synthetic contours for radar & hazard overlays
    return {
        "bbox": bbox,
        "hazard": hazard,
        "grid_resolution_km": "2.5 km common fused grid",
        "contour_points": [
            {"lat": 18.72, "lon": 73.68, "dbz": 58.5, "lightning_density": 42, "cloudburst_prob": 0.35},
            {"lat": 18.82, "lon": 73.88, "dbz": 52.0, "lightning_density": 34, "cloudburst_prob": 0.28},
            {"lat": 18.95, "lon": 74.12, "dbz": 48.0, "lightning_density": 22, "cloudburst_prob": 0.18},
            {"lat": 17.68, "lon": 73.85, "dbz": 54.0, "lightning_density": 28, "cloudburst_prob": 0.45},
            {"lat": 28.45, "lon": 77.02, "dbz": 56.0, "lightning_density": 38, "cloudburst_prob": 0.22},
            {"lat": 25.28, "lon": 91.72, "dbz": 62.0, "lightning_density": 70, "cloudburst_prob": 0.88}
        ]
    }

@app.get("/api/v1/storms/active")
async def get_active_storms(
    region: Optional[str] = None,
    hazard: Optional[str] = None,
    severity: Optional[str] = None
):
    results = STORMS
    if region and region.lower() != "all" and region.lower() != "entire country":
        results = [s for s in results if region.lower() in s["region"].lower() or region.lower() in s["nearest_city"].lower()]
    if hazard and hazard.lower() != "all" and hazard.lower() != "all hazards":
        results = [s for s in results if hazard.lower() in s["hazard"].lower()]
    if severity and severity.lower() != "all" and severity.lower() != "all levels":
        results = [s for s in results if severity.lower() in s["severity"].lower()]
    return {
        "count": len(results),
        "total_active": len(STORMS),
        "storms": results
    }

@app.get("/api/v1/storms/{storm_id}")
async def get_storm_detail(storm_id: str):
    for storm in STORMS:
        if storm["id"].lower() == storm_id.lower():
            return storm
    raise HTTPException(status_code=404, detail="Storm cell not found")

@app.get("/api/v1/storms/{storm_id}/track")
async def get_storm_track(storm_id: str):
    for storm in STORMS:
        if storm["id"].lower() == storm_id.lower():
            return {
                "storm_id": storm["id"],
                "name": storm["name"],
                "track": storm["track"],
                "forecast_corridor_width_km": 8.0,
                "current_vector": f"{storm['speed_kmph']} km/h at {storm['direction_deg']}°"
            }
    raise HTTPException(status_code=404, detail="Storm track not found")

@app.get("/api/v1/hazards")
async def get_hazards(hazard: Optional[str] = "all"):
    return {
        "timestamp": BASE_TIME_IST,
        "hazards": LOCATION_FORECAST_PUNE["hazards"]
    }

@app.get("/api/v1/arrival")
async def get_arrival_time(lat: float = 18.52, lon: float = 73.86):
    return {
        "location": {"lat": lat, "lon": lon, "name": "Pune"},
        "arrival_window": "17:30 – 18:30 IST",
        "relative": "≈ 15 min – 1h 45 min from now",
        "eta_min": 25,
        "eta_max": 40,
        "tracked_storm": "CELL-MH-01 (Pune-Ahmednagar Squall Line)",
        "approach_vector": "From 245° (WSW) at 38 km/h",
        "confidence": 0.78,
        "status": "estimated"
    }

@app.get("/api/v1/locations/search")
async def search_locations(q: str = Query("", description="Location name query")):
    if not q:
        return SEARCHABLE_LOCATIONS[:6]
    query_lower = q.lower()
    matches = [loc for loc in SEARCHABLE_LOCATIONS if query_lower in loc["name"].lower() or query_lower in loc["state"].lower() or query_lower in loc["district"].lower()]
    return matches

@app.get("/api/v1/warnings")
async def get_warnings():
    return {
        "official_disclaimer": "Official district warnings sourced from IMD/NDMA bulletins. AI nowcast provides decision-support only.",
        "active_warnings": alerts_db
    }

@app.get("/api/v1/rainfall")
async def get_rainfall():
    return {
        "current_rate_mm_hr": 8.5,
        "accumulated_last_1h_mm": 14.2,
        "forecast_next_1h_mm": 38.0,
        "cloudburst_threshold_exceeded": False,
        "extreme_rain_probability": 0.30
    }

@app.get("/api/v1/lightning")
async def get_lightning():
    return {
        "total_strikes_last_15m": 85,
        "cg_strikes_ratio": 0.65,
        "max_peak_current_ka": -42.8,
        "trend": "increasing",
        "safety_status": "HIGH ALERT: Active ground strikes within 10 km"
    }

@app.get("/api/v1/radar")
async def get_radar_summary():
    return {
        "station": "Mumbai / Goa / Pune Composite",
        "max_reflectivity": 58.5,
        "vil": 48.0,
        "echo_top_km": 14.2,
        "updated": "2 min ago"
    }

@app.get("/api/v1/satellite")
async def get_satellite_summary():
    return {
        "satellite": "INSAT-3DS",
        "channel": "TIR-1 (10.8 µm)",
        "min_brightness_temp_c": -64.2,
        "cloud_growth_rate": "Rapid convective intensification (-8°C in 15m)"
    }

@app.get("/api/v1/data-health")
async def get_data_health():
    return {
        "overall_status": "Healthy (Degraded AWS Fallback)",
        "pipeline_latency_sec": 38.5,
        "inference_latency_ms": 420,
        "sources": DATA_SOURCES_HEALTH
    }

@app.get("/api/v1/replay/cases")
async def get_replay_cases():
    return {
        "count": len(REPLAY_CASES),
        "cases": REPLAY_CASES
    }

@app.get("/api/v1/replay/{case_id}")
async def get_replay_case(case_id: str):
    for c in REPLAY_CASES:
        if c["id"].lower() == case_id.lower():
            return c
    raise HTTPException(status_code=404, detail="Replay case not found")

@app.get("/api/v1/analytics/metrics")
async def get_analytics_metrics():
    return ANALYTICS_METRICS

@app.get("/api/v1/alerts")
async def get_alerts():
    return {
        "total": len(alerts_db),
        "alerts": alerts_db
    }

@app.post("/api/v1/alerts/{alert_id}/review")
async def review_alert(alert_id: str, req: AlertReviewRequest):
    for a in alerts_db:
        if a["id"].lower() == alert_id.lower():
            a["status"] = req.action
            a["reviewer"] = f"{req.reviewer_name} (Reviewed: {datetime.now().strftime('%H:%M IST')})"
            if req.notes:
                a["notes"] = req.notes
            return {"status": "success", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.post("/api/v1/alerts/{alert_id}/approve")
async def approve_alert(alert_id: str):
    for a in alerts_db:
        if a["id"].lower() == alert_id.lower():
            a["status"] = "approved"
            a["reviewer"] = f"Duty Officer (Approved: {datetime.now().strftime('%H:%M IST')})"
            return {"status": "success", "message": f"Alert {alert_id} approved for broadcast", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.post("/api/v1/alerts/{alert_id}/suppress")
async def suppress_alert(alert_id: str):
    for a in alerts_db:
        if a["id"].lower() == alert_id.lower():
            a["status"] = "suppressed"
            a["reviewer"] = f"Duty Officer (Suppressed: {datetime.now().strftime('%H:%M IST')})"
            return {"status": "success", "message": f"Alert {alert_id} suppressed", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")

# WebSocket for live telemetry streaming
@app.websocket("/api/v1/live")
async def websocket_live_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        strike_counter = 85
        while True:
            strike_counter += 1
            payload = {
                "type": "TELEMETRY_TICK",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "ist_clock": datetime.now().strftime("%H:%M:%S IST"),
                "latest_lightning_strike": {
                    "lat": 18.72 + (0.01 * (strike_counter % 5)),
                    "lon": 73.68 + (0.01 * (strike_counter % 4)),
                    "peak_current_ka": -35.2,
                    "type": "CG"
                },
                "active_cell_intensity_dbz": 58.5,
                "total_strikes_15m": strike_counter
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(4)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

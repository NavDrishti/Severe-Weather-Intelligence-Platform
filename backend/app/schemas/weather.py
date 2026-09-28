from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LocationInfo(BaseModel):
    name: str
    lat: float
    lon: float
    state: Optional[str] = None
    district: Optional[str] = None
    elevation_m: Optional[float] = None

class HazardDetail(BaseModel):
    probability: float
    severity: Optional[str] = "Low"
    density: Optional[str] = None
    trend: Optional[str] = None
    rain_rate_mm_per_hour: Optional[float] = None
    gust_range_kmph: Optional[List[int]] = None
    expected_diameter_mm: Optional[int] = None
    advice: Optional[str] = None

class StormEta(BaseModel):
    status: str = "estimated"
    from_minutes: Optional[int] = None
    to_minutes: Optional[int] = None
    window: Optional[str] = None
    relative: Optional[str] = None

class DataFreshness(BaseModel):
    status: str = "Just now"
    latency_sec: int = 38
    feed_type: str = "Live feed"

class ForecastResponse(BaseModel):
    run_id: str
    issue_time: str
    valid_time: str
    horizon_minutes: int
    location: LocationInfo
    hazards: Dict[str, HazardDetail]
    storm_eta: StormEta
    confidence: float
    data_completeness: float
    evidence: List[str]
    provenance: Dict[str, Any]

class StormCellSummary(BaseModel):
    id: str
    name: str
    region: str
    hazard: str
    severity: str
    current_intensity: str
    movement: str
    speed_kmph: float
    direction_deg: float
    centroid_lat: float
    centroid_lon: float
    nearest_district: str
    nearest_city: str
    eta: str
    confidence: float
    data_completeness: float
    last_updated: str
    coordinates: List[List[float]]
    track: List[Dict[str, Any]]
    evidence: List[str]

class AlertReviewRequest(BaseModel):
    reviewer_name: str
    action: str # approve, suppress, escalate, false_alarm
    notes: Optional[str] = None

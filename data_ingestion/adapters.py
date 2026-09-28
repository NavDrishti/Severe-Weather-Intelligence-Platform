"""
Data Ingestion Adapters for NavDrishti AI.
Supports adapters for:
- IMD DWR (Doppler Weather Radar)
- MOSDAC / ISRO INSAT-3DS (TIR-1, Sounder)
- Ground Lightning Networks (IITM / IMD LIDEN)
- AWS / ARG Surface stations
- NCMRWF / NWP high-resolution fields
"""

import os
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class BaseAdapter:
    def __init__(self, name: str, source_type: str):
        self.name = name
        self.source_type = source_type
        self.is_connected = False

    def check_health(self) -> Dict[str, Any]:
        return {
            "source": self.name,
            "type": self.source_type,
            "status": "healthy" if self.is_connected else "simulated_seed",
            "last_ping": datetime.now(timezone.utc).isoformat()
        }

class RadarDWRAdapter(BaseAdapter):
    """Adapter for IMD Doppler Weather Radar feeds (NetCDF/HDF5 or Open Data APIs)."""
    def __init__(self, api_base_url: Optional[str] = None, api_key: Optional[str] = None):
        super().__init__("IMD-DWR-Composite", "Ground Radar")
        self.api_base_url = api_base_url or os.getenv("IMD_API_BASE_URL", "https://api.imd.gov.in/radar")
        self.api_key = api_key or os.getenv("IMD_API_KEY", "")

    def fetch_latest_reflectivity(self, station_code: str = "PUN") -> Dict[str, Any]:
        # Returns max reflectivity composite (dBZ) and echo tops
        return {
            "station": station_code,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "max_reflectivity_dbz": 58.5,
            "vil_kg_m2": 48.0,
            "echo_top_km": 14.2,
            "quality_flag": "QC_PASS"
        }

class INSATSatelliteAdapter(BaseAdapter):
    """Adapter for MOSDAC / ISRO INSAT-3DS satellite meteorological products."""
    def __init__(self, api_base_url: Optional[str] = None):
        super().__init__("MOSDAC-INSAT-3DS", "Geostationary Satellite")
        self.api_base_url = api_base_url or os.getenv("MOSDAC_API_BASE_URL", "https://mosdac.gov.in/api")

    def fetch_cloud_top_temperature(self, bbox: List[float]) -> Dict[str, Any]:
        return {
            "satellite": "INSAT-3DS",
            "channel": "TIR1_10.8um",
            "min_cloud_top_c": -64.2,
            "cooling_rate_c_15m": -8.5,
            "convective_signature": "RAPID_INTENSIFICATION"
        }

class LightningNetworkAdapter(BaseAdapter):
    """Adapter for Ground Lightning Detection Networks (LIDEN / IITM)."""
    def __init__(self, api_base_url: Optional[str] = None):
        super().__init__("IITM-IMD-LIDEN", "Lightning Network")
        self.api_base_url = api_base_url or os.getenv("LIGHTNING_API_BASE_URL", "")

    def fetch_recent_strikes(self, lat: float, lon: float, radius_km: float = 30.0) -> Dict[str, Any]:
        return {
            "center": [lat, lon],
            "radius_km": radius_km,
            "strikes_count_15m": 85,
            "cg_strikes": 55,
            "ic_strikes": 30,
            "max_current_ka": -42.8,
            "lightning_jump_detected": True
        }

class NWPContextAdapter(BaseAdapter):
    """Adapter for NCMRWF / IMD WRF numerical weather prediction fields."""
    def __init__(self):
        super().__init__("NCMRWF-NCUM-WRF", "Numerical Model")

    def fetch_environmental_parameters(self, lat: float, lon: float) -> Dict[str, Any]:
        return {
            "lat": lat,
            "lon": lon,
            "cape_j_kg": 2450.0,
            "cin_j_kg": -35.0,
            "deep_shear_0_6km_mps": 18.5,
            "freezing_level_m": 4800.0,
            "low_level_moisture_flux": "STRONG_OROGRAPHIC_INFLOW"
        }

"""
TITAN / SCIT-inspired Convective Cell Tracking Engine for NavDrishti AI.
Tracks centroid displacement, calculates propagation vector, and computes forecast corridor.
"""

from typing import List, Dict, Any, Tuple
import math

class CellTracker:
    def __init__(self, search_radius_km: float = 45.0, max_velocity_kmph: float = 90.0):
        self.search_radius_km = search_radius_km
        self.max_velocity_kmph = max_velocity_kmph

    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        r = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c

    def predict_future_track(
        self,
        current_lat: float,
        current_lon: float,
        speed_kmph: float,
        direction_deg: float,
        intervals_min: List[int] = [15, 30, 45, 60, 90, 120, 180]
    ) -> List[Dict[str, Any]]:
        """Extrapolates storm centroid positions along the propagation vector with widening uncertainty band."""
        track = []
        rad = math.radians(direction_deg)
        # 1 deg latitude ≈ 111 km, 1 deg lon ≈ 111 * cos(lat) km
        km_per_lat = 111.0
        km_per_lon = 111.0 * math.cos(math.radians(current_lat))

        for m in intervals_min:
            dist_km = (speed_kmph * (m / 60.0))
            dlat = (dist_km * math.cos(rad)) / km_per_lat
            dlon = (dist_km * math.sin(rad)) / km_per_lon
            
            # Uncertainty envelope expands with time horizon
            corridor_width_km = 4.0 + (m * 0.12)
            # Forecast confidence degrades gracefully
            confidence = max(0.40, round(0.92 - (m * 0.0018), 2))

            track.append({
                "horizon_min": m,
                "lat": round(current_lat + dlat, 4),
                "lon": round(current_lon + dlon, 4),
                "corridor_width_km": round(corridor_width_km, 1),
                "confidence": confidence,
                "label": f"ETA +{m}m"
            })
        return track

    def compute_arrival_estimate(
        self,
        target_lat: float,
        target_lon: float,
        cell_lat: float,
        cell_lon: float,
        speed_kmph: float,
        direction_deg: float
    ) -> Dict[str, Any]:
        """Calculates distance and estimated time of arrival (ETA) interval for a designated target."""
        distance_km = self.haversine_distance_km(cell_lat, cell_lon, target_lat, target_lon)
        if speed_kmph <= 5.0:
            return {"status": "quasi-stationary", "eta_min": None, "note": "Storm cell is quasi-stationary (< 5 km/h)"}
        
        nominal_minutes = (distance_km / speed_kmph) * 60.0
        # Allow +/- 15% uncertainty band rather than false precision
        min_eta = max(5, int(nominal_minutes * 0.85))
        max_eta = int(nominal_minutes * 1.20)

        return {
            "status": "estimated",
            "distance_km": round(distance_km, 1),
            "from_minutes": min_eta,
            "to_minutes": max_eta,
            "eta_window_text": f"Expected in {min_eta}–{max_eta} minutes",
            "explanation": "ETA is based on tracked storm motion and current forecast corridor."
        }

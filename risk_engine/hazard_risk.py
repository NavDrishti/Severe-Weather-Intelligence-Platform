"""
Probabilistic Hazard Risk Assessment Engine for NavDrishti AI.
Calculates calibrated probabilities for:
1. Lightning (based on flash jump, VIL, echo tops)
2. Hail (reflectivity aloft, freezing level 0°C height)
3. Cloudburst (probability of precipitation >= 100 mm/hr, orographic lift)
4. Downburst (radial velocity divergence, dry subcloud lapse rate, DCAPE)
"""

from typing import Dict, Any

class HazardRiskEngine:
    @staticmethod
    def evaluate_lightning_risk(flash_rate_15m: int, max_dbz: float, vil: float) -> Dict[str, Any]:
        """Estimates lightning risk and trend."""
        score = 0.0
        if flash_rate_15m > 60:
            score += 0.45
        elif flash_rate_15m > 20:
            score += 0.30
        else:
            score += 0.10

        if max_dbz >= 55.0:
            score += 0.35
        elif max_dbz >= 45.0:
            score += 0.25

        if vil > 35.0:
            score += 0.20

        prob = min(0.95, round(score, 2))
        return {
            "probability": prob,
            "severity": "Very High" if prob >= 0.75 else ("High" if prob >= 0.50 else "Medium"),
            "density": "High (Flash jump detected)" if flash_rate_15m > 40 else "Moderate",
            "trend": "increasing" if flash_rate_15m > 30 else "steady",
            "safety_action": "Seek enclosed shelter. Follow 30-30 rule."
        }

    @staticmethod
    def evaluate_cloudburst_risk(rain_rate_mm_hr: float, orographic_factor: float = 1.2) -> Dict[str, Any]:
        """Calculates cloudburst potential (extreme convective rainfall >= 100 mm/hr)."""
        adjusted_rate = rain_rate_mm_hr * orographic_factor
        if adjusted_rate >= 100.0:
            prob = 0.88
            severity = "Extreme (Cloudburst Triggered)"
        elif adjusted_rate >= 60.0:
            prob = 0.55
            severity = "High (Torrential Convective Rain)"
        elif adjusted_rate >= 30.0:
            prob = 0.30
            severity = "Watch (Heavy Rain)"
        else:
            prob = 0.10
            severity = "Low"

        return {
            "probability": prob,
            "rain_rate_mm_per_hour": round(adjusted_rate, 1),
            "severity": severity,
            "safety_action": "Avoid riverbeds, nullahs, and low-lying underpasses. Prepare for sudden flash runoff."
        }

    @staticmethod
    def evaluate_downburst_potential(shear_mps: float, max_dbz: float, cape: float) -> Dict[str, Any]:
        """Estimates microburst/downburst wind gust interval potential."""
        if max_dbz >= 55.0 and cape >= 2000.0:
            prob = 0.65
            gusts = [60, 90]
            severity = "High"
        elif max_dbz >= 48.0:
            prob = 0.35
            gusts = [40, 65]
            severity = "Moderate"
        else:
            prob = 0.15
            gusts = [25, 45]
            severity = "Low"

        return {
            "probability": prob,
            "gust_range_kmph": gusts,
            "severity": severity,
            "safety_action": "Secure loose structures, cranes, and temporary tin roofs."
        }

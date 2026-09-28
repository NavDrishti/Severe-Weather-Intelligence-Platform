export type HazardType = 'all' | 'lightning' | 'cloudburst' | 'hail' | 'downburst' | 'thunderstorm';

export type RiskLevel = 'all' | 'very_high' | 'high' | 'medium' | 'low';

export type RegionKey = 'pune' | 'maharashtra' | 'west_central' | 'entire_country';

export type DataSourceKey = 'radar' | 'satellite' | 'ground' | 'lightning' | 'nwp';

export interface LocationCoordinates {
  lat: number;
  lon: number;
  name: string;
  state?: string;
  district?: string;
  elevation_m?: number;
}

export interface HazardDetail {
  probability: number;
  severity?: string;
  density?: string;
  trend?: string;
  rain_rate_mm_per_hour?: number;
  gust_range_kmph?: [number, number];
  expected_diameter_mm?: number;
  advice?: string;
}

export interface StormEta {
  status: 'estimated' | 'active' | 'quasi-stationary' | 'no_reliable_eta';
  window: string;
  relative: string;
  from_minutes?: number;
  to_minutes?: number;
}

export interface EvidenceSignal {
  icon: 'radar' | 'lightning' | 'satellite' | 'wind' | 'terrain';
  title: string;
  detail: string;
}

export interface HourlyForecastStep {
  horizon: string;
  time: string;
  horizon_pct: number;
  lightning_prob: number;
  hail_prob: number;
  cloudburst_prob: number;
  downburst_prob: number;
  rain_rate: number;
  mode: 'Observation-dominant' | 'Multi-source Fusion' | 'NWP-Assisted';
  weather: string;
}

export interface StormTrackPoint {
  time: string;
  lat: number;
  lon: number;
  label: string;
  status: 'observed' | 'forecast_corridor';
}

export interface AffectedAsset {
  name: string;
  type: string;
  eta_min: number;
}

export interface StormCell {
  id: string;
  name: string;
  region: string;
  hazard: string;
  severity: 'Very High' | 'High' | 'Medium' | 'Low';
  current_intensity: string;
  movement: string;
  speed_kmph: number;
  direction_deg: number;
  centroid_lat: number;
  centroid_lon: number;
  area_km2: number;
  max_reflectivity_dbz: number;
  echo_top_km: number;
  vil_kg_m2: number;
  growth_status: 'growing' | 'mature' | 'decaying';
  nearest_district: string;
  nearest_city: string;
  eta: string;
  eta_window: string;
  confidence: number;
  data_completeness: number;
  last_updated: string;
  coordinates: [number, number][];
  track: StormTrackPoint[];
  evidence: string[];
  affected_assets: AffectedAsset[];
}

export interface DataSourceHealth {
  key: string;
  name: string;
  type: string;
  status: 'healthy' | 'delayed' | 'unavailable';
  status_label: string;
  last_updated_minutes: number;
  cadence_minutes: number;
  quality_score: number;
  coverage: string;
  observations_count: number;
  fallback: string;
  history: string[];
}

export interface AlertItem {
  id: string;
  title: string;
  hazard: string;
  severity: string;
  severity_code: 'yellow' | 'orange' | 'red';
  affected_area: string;
  issue_time: string;
  valid_until: string;
  probability: number;
  confidence: number;
  lead_time_min: number;
  status: 'pending_review' | 'approved' | 'suppressed' | 'expired';
  reviewer: string;
  evidence: string[];
  recommended_action: string;
  polygon: [number, number][];
  notes?: string;
}

export interface ReplayCase {
  id: string;
  title: string;
  hazard_category: string;
  region: string;
  date_str: string;
  duration_hours: number;
  peak_intensity: string;
  lead_time_achieved: string;
  description: string;
  metrics: {
    pod: number;
    far: number;
    csi: number;
    brier_score: number;
    mae_rain: string;
    position_error_km: number;
  };
  frames_count: number;
}

export interface ActiveFiltersState {
  hazard: HazardType;
  risk: RiskLevel;
  region: RegionKey;
  sources: Record<DataSourceKey, boolean>;
}

export interface MapLayerVisibility {
  radarReflectivity: boolean;
  radarVelocity: boolean;
  satelliteIR: boolean;
  lightningStrikes: boolean;
  lightningDensity: boolean;
  cloudburstZones: boolean;
  hailRisk: boolean;
  downburstPotential: boolean;
  stormTracks: boolean;
  districtBoundaries: boolean;
  awsStations: boolean;
  assets: boolean;
}

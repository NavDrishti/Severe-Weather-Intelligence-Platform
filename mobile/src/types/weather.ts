export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface LocationData {
  name: string;
  state: string;
  district?: string;
  lat: number;
  lon: number;
  isGps: boolean;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  pressure: number;
  precipitation: number;
  weatherCode: number;
  weatherDesc: string;
  cape: number;
  updatedAt: string;
}

export interface HazardItem {
  type: 'lightning' | 'hail' | 'cloudburst' | 'downburst' | 'thunderstorm';
  name: string;
  probability: number;
  severity: string;
  advice: string;
}

export interface ForecastHour {
  hourLabel: string; // e.g. "Now", "+1h", "+2h"
  time: string;      // e.g. "17:35"
  weatherDesc: string;
  riskLevel: RiskLevel;
  rainRate: number;
  lightningProb: number;
  hailProb: number;
  cloudburstProb: number;
  icon: string;
  warning?: string;
}

export interface StormCellSummary {
  id: string;
  name: string;
  hazard: string;
  severity: string;
  intensity: string;
  speedKmph: number;
  directionDeg: number;
  etaText: string;
  centroidLat: number;
  centroidLon: number;
  coordinates: [number, number][];
  track: { time: string; lat: number; lon: number; label: string }[];
}

export interface AlertSummary {
  id: string;
  title: string;
  hazard: string;
  severity: 'yellow' | 'orange' | 'red';
  severityText: string;
  affectedArea: string;
  isOfficial: boolean;
  issueTime: string;
  validUntil: string;
  leadTimeMin: number;
  recommendedAction: string;
}

export interface RiskStatus {
  level: RiskLevel;
  headline: string;
  eta: string;
  recommendation: string;
  confidence: number;
  trackedStormName?: string;
  hazards: HazardItem[];
}

export interface AppWeatherState {
  location: LocationData | null;
  currentWeather: CurrentWeather | null;
  risk: RiskStatus | null;
  timeline: ForecastHour[];
  activeStorms: StormCellSummary[];
  alerts: AlertSummary[];
  lastUpdatedTimestamp: number | null;
  isDelayed: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  hasLocationPermission: boolean | null;
}

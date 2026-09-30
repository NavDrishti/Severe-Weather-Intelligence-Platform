import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData, CurrentWeather, RiskStatus, ForecastHour, StormCellSummary, AlertSummary } from '../types/weather';

const CACHE_KEY_WEATHER = 'navdrishti_cached_weather';
const CACHE_KEY_LOCATION = 'navdrishti_cached_location';
const CACHE_KEY_TIMESTAMP = 'navdrishti_cached_timestamp';

export interface CachedDataBundle {
  location: LocationData;
  currentWeather: CurrentWeather;
  risk: RiskStatus;
  timeline: ForecastHour[];
  activeStorms: StormCellSummary[];
  alerts: AlertSummary[];
  timestamp: number;
}

export async function saveWeatherCache(data: Omit<CachedDataBundle, 'timestamp'>): Promise<void> {
  try {
    const timestamp = Date.now();
    const bundle: CachedDataBundle = { ...data, timestamp };
    await AsyncStorage.setItem(CACHE_KEY_WEATHER, JSON.stringify(bundle));
    await AsyncStorage.setItem(CACHE_KEY_TIMESTAMP, timestamp.toString());
  } catch (err) {
    console.warn('[StorageService] Failed to cache weather bundle:', err);
  }
}

export async function loadWeatherCache(): Promise<CachedDataBundle | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY_WEATHER);
    if (!raw) return null;
    return JSON.parse(raw) as CachedDataBundle;
  } catch (err) {
    console.warn('[StorageService] Failed to load cached weather:', err);
    return null;
  }
}

export async function saveLastLocation(location: LocationData): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY_LOCATION, JSON.stringify(location));
  } catch (err) {
    console.warn('[StorageService] Failed to cache location:', err);
  }
}

export async function loadLastLocation(): Promise<LocationData | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY_LOCATION);
    if (!raw) return null;
    return JSON.parse(raw) as LocationData;
  } catch {
    return null;
  }
}

export function formatTimeAgo(timestamp: number, lang: 'en' | 'hi' = 'en'): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) {
    return lang === 'hi' ? 'अभी-अभी' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === 'hi' ? `${diffMin} मिनट पहले` : `${diffMin} min ago`;
  }
  const diffHr = Math.floor(diffMin / 60);
  return lang === 'hi' ? `${diffHr} घंटे पहले` : `${diffHr}h ago`;
}

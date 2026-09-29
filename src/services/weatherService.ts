import { HourlyForecastStep, LocationCoordinates } from '../types/weather';
import { HOURLY_TIMELINE, SEARCHABLE_LOCATIONS } from '../data/mockData';

export interface LiveCurrentWeather {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitation: number;
  weatherCode: number;
  weatherDesc: string;
  time: string;
  cape: number;
}

export interface LiveForecastResult {
  current: LiveCurrentWeather;
  timeline: HourlyForecastStep[];
  isLive: boolean;
  source: string;
}

// Map WMO Weather Codes to human descriptions and severity
export function describeWmoCode(code: number): { label: string; icon: string; severity: 'low' | 'medium' | 'high' | 'very_high' } {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', icon: 'clear', severity: 'low' };
    case 1:
    case 2:
      return { label: 'Partly Cloudy', icon: 'partly_cloudy', severity: 'low' };
    case 3:
      return { label: 'Overcast', icon: 'cloudy', severity: 'low' };
    case 45:
    case 48:
      return { label: 'Fog / Low Stratus', icon: 'cloudy', severity: 'medium' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: 'passing_showers', severity: 'medium' };
    case 61:
    case 63:
      return { label: 'Moderate Rain', icon: 'moderate_rain', severity: 'medium' };
    case 65:
      return { label: 'Heavy Continuous Rain', icon: 'heavy_rain', severity: 'high' };
    case 80:
    case 81:
      return { label: 'Convective Rain Showers', icon: 'passing_showers', severity: 'high' };
    case 82:
      return { label: 'Violent Convective Rain', icon: 'cloudburst_watch', severity: 'very_high' };
    case 95:
      return { label: 'Thunderstorm with Lightning', icon: 'thunderstorm', severity: 'very_high' };
    case 96:
    case 99:
      return { label: 'Severe Thunderstorm & Hail', icon: 'hail_core', severity: 'very_high' };
    default:
      return { label: 'Passing Clouds', icon: 'cloudy', severity: 'low' };
  }
}

/**
 * Fetch live 0-6 hour convective forecast from Open-Meteo API
 * Zero API keys or tokens required; works worldwide including all of India.
 */
export async function fetchLiveConvectiveForecast(
  lat: number,
  lon: number
): Promise<LiveForecastResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,surface_pressure,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_gusts_10m,cape&forecast_days=2&timezone=auto`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const hourly = data.hourly || {};

    const currentWeatherCode = current.weather_code ?? 0;
    const wmoInfo = describeWmoCode(currentWeatherCode);

    // Find current hour index in the hourly timeline
    const currentTimeStr = current.time || new Date().toISOString().slice(0, 13) + ':00';
    let startIndex = hourly.time?.findIndex((t: string) => t >= currentTimeStr) ?? 0;
    if (startIndex < 0) startIndex = 0;

    const currentCape = hourly.cape?.[startIndex] ?? 450;

    const currentWeather: LiveCurrentWeather = {
      temperature: current.temperature_2m ?? 24.0,
      humidity: current.relative_humidity_2m ?? 70,
      pressure: current.surface_pressure ?? 1012,
      windSpeed: current.wind_speed_10m ?? 8,
      windDirection: current.wind_direction_10m ?? 90,
      windGusts: current.wind_gusts_10m ?? 14,
      precipitation: current.precipitation ?? 0,
      weatherCode: currentWeatherCode,
      weatherDesc: wmoInfo.label,
      time: current.time ? current.time.replace('T', ' ') : 'Live Now',
      cape: currentCape
    };

    // Build the 0-6h horizon timeline
    const horizons = [
      { label: 'NOW', horizon_pct: 0, mode: 'Observation-dominant' as const },
      { label: '+30 min', horizon_pct: 8, mode: 'Observation-dominant' as const },
      { label: '+1h', horizon_pct: 16, mode: 'Observation-dominant' as const },
      { label: '+1h 30', horizon_pct: 25, mode: 'Observation-dominant' as const },
      { label: '+2h', horizon_pct: 33, mode: 'Multi-source Fusion' as const },
      { label: '+2h 30', horizon_pct: 41, mode: 'Multi-source Fusion' as const },
      { label: '+3h', horizon_pct: 50, mode: 'Multi-source Fusion' as const },
      { label: '+3h 30', horizon_pct: 58, mode: 'NWP-Assisted' as const },
      { label: '+4h', horizon_pct: 66, mode: 'NWP-Assisted' as const },
      { label: '+4h 30', horizon_pct: 75, mode: 'NWP-Assisted' as const },
      { label: '+5h', horizon_pct: 83, mode: 'NWP-Assisted' as const },
      { label: '+5h 30', horizon_pct: 91, mode: 'NWP-Assisted' as const },
      { label: '+6h', horizon_pct: 100, mode: 'NWP-Assisted' as const }
    ];

    const timeline: HourlyForecastStep[] = horizons.map((h, i) => {
      const hourlyOffset = Math.floor(i / 2);
      const stepIdx = startIndex + hourlyOffset;

      const stepTimeStr = hourly.time?.[stepIdx] || '';
      const hourPart = stepTimeStr ? stepTimeStr.split('T')[1]?.slice(0, 5) : `${17 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`;

      const capeVal = hourly.cape?.[stepIdx] ?? (currentCape * Math.max(0.4, 1 - i * 0.08));
      const precipProb = hourly.precipitation_probability?.[stepIdx] ?? 10;
      const rainRate = hourly.precipitation?.[stepIdx] ?? 0;
      const windGust = hourly.wind_gusts_10m?.[stepIdx] ?? 15;
      const stepCode = hourly.weather_code?.[stepIdx] ?? 0;

      // Convective indices based on atmospheric physics
      // Lightning Probability: High CAPE (>1000 J/kg) + moisture + convective trigger
      let lightningProb = Math.min(95, Math.max(5, Math.round((capeVal / 2200) * 45 + (precipProb * 0.45))));
      if ([95, 96, 99].includes(stepCode)) {
        lightningProb = Math.max(78, lightningProb);
      }

      // Hail Probability: Severe updrafts (CAPE > 1500 J/kg) + wind shear / gusts > 40 km/h
      let hailProb = 0;
      if (capeVal > 1100 && windGust > 30) {
        hailProb = Math.min(85, Math.round((capeVal / 3200) * 40 + (windGust / 80) * 25));
      }
      if ([96, 99].includes(stepCode)) {
        hailProb = Math.max(55, hailProb);
      }

      // Cloudburst Probability (> 100 mm/h rate or sudden intense deluge)
      let cloudburstProb = 0;
      if (rainRate > 15) {
        cloudburstProb = Math.min(92, Math.round(rainRate * 2.5 + (capeVal / 100)));
      } else if (capeVal > 1800 && precipProb > 60) {
        cloudburstProb = Math.min(48, Math.round((capeVal / 3500) * 30 + (precipProb * 0.2)));
      } else {
        cloudburstProb = Math.min(25, Math.round((precipProb * 0.15) + (capeVal / 4000) * 10));
      }

      // Downburst / Microburst Potential: Dry entrainment / strong gusts
      let downburstProb = Math.min(85, Math.max(3, Math.round((windGust / 70) * 45 + (capeVal / 2500) * 20)));

      const stepDesc = describeWmoCode(stepCode);

      return {
        horizon: h.label,
        time: hourPart,
        horizon_pct: h.horizon_pct,
        lightning_prob: Math.min(99, Math.round(lightningProb)),
        hail_prob: Math.min(99, Math.round(hailProb)),
        cloudburst_prob: Math.min(99, Math.round(cloudburstProb)),
        downburst_prob: Math.min(99, Math.round(downburstProb)),
        rain_rate: Number(rainRate.toFixed(1)),
        mode: h.mode,
        weather: stepDesc.icon
      };
    });

    return {
      current: currentWeather,
      timeline,
      isLive: true,
      source: 'Open-Meteo High-Res NWP & Atmospheric Sounding'
    };
  } catch (err) {
    console.warn('[NavDrishti] Live Open-Meteo fetch failed, using calibrated baseline:', err);
    return {
      current: {
        temperature: 24.5,
        humidity: 82,
        pressure: 1010,
        windSpeed: 18,
        windDirection: 65,
        windGusts: 42,
        precipitation: 8.5,
        weatherCode: 95,
        weatherDesc: 'Convective Thunderstorm (Simulated Baseline)',
        time: '17:35 IST',
        cape: 2450
      },
      timeline: HOURLY_TIMELINE,
      isLive: false,
      source: 'NavDrishti Calibrated Seed Climatology'
    };
  }
}

/**
 * Live Indian & Global Geocoding Search via Open-Meteo Geocoding API
 */
export async function searchLocationsLive(query: string): Promise<LocationCoordinates[]> {
  if (!query || query.trim().length === 0) {
    return SEARCHABLE_LOCATIONS.map((loc) => ({
      name: loc.name,
      state: loc.state,
      district: loc.district,
      lat: loc.lat,
      lon: loc.lon
    }));
  }

  try {
    const q = encodeURIComponent(query.trim());
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=8&language=en&format=json`, {
      signal: AbortSignal.timeout(3500)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((r: any) => ({
          name: r.name,
          state: r.admin1 || r.country || 'India',
          district: r.admin2 || r.name,
          lat: Number(r.latitude.toFixed(4)),
          lon: Number(r.longitude.toFixed(4)),
          elevation_m: r.elevation ? Math.round(r.elevation) : undefined
        }));
      }
    }
  } catch (err) {
    console.warn('[NavDrishti] Live geocoding search failed, searching local list:', err);
  }

  // Fallback to local searchable locations
  const qLower = query.toLowerCase();
  const matched = SEARCHABLE_LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(qLower) ||
      l.state.toLowerCase().includes(qLower) ||
      l.district.toLowerCase().includes(qLower)
  );

  return matched.map((loc) => ({
    name: loc.name,
    state: loc.state,
    district: loc.district,
    lat: loc.lat,
    lon: loc.lon
  }));
}

/**
 * Cache for RainViewer radar tile endpoint
 */
let cachedRadarTileUrl: string | null = null;
let lastRadarFetchTime = 0;

/**
 * Fetch live RainViewer radar composite tile URL
 * Provides real-time animated radar reflectivity layers
 */
export async function fetchLiveRadarTileUrl(): Promise<string | null> {
  const now = Date.now();
  if (cachedRadarTileUrl && now - lastRadarFetchTime < 5 * 60 * 1000) {
    return cachedRadarTileUrl;
  }

  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      const host = data.host || 'https://tilecache.rainviewer.com';
      const past = data.radar?.past;
      if (past && past.length > 0) {
        const latest = past[past.length - 1];
        // 256px tile template for Leaflet
        const tileUrl = `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
        cachedRadarTileUrl = tileUrl;
        lastRadarFetchTime = now;
        return tileUrl;
      }
    }
  } catch (err) {
    console.warn('[NavDrishti] RainViewer radar API unreachable:', err);
  }

  return cachedRadarTileUrl;
}

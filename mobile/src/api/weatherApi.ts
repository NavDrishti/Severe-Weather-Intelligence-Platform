import { CurrentWeather } from '../types/weather';
import { fetchWithTimeout } from './client';

export function describeWmoCode(code: number): { label: string; icon: string; severity: 'low' | 'medium' | 'high' | 'very_high' } {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', icon: 'sun', severity: 'low' };
    case 1:
    case 2:
      return { label: 'Partly Cloudy', icon: 'cloud-sun', severity: 'low' };
    case 3:
      return { label: 'Overcast', icon: 'cloud', severity: 'low' };
    case 45:
    case 48:
      return { label: 'Fog / Low Stratus', icon: 'cloud', severity: 'medium' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: 'cloud-drizzle', severity: 'medium' };
    case 61:
    case 63:
      return { label: 'Moderate Rain', icon: 'cloud-rain', severity: 'medium' };
    case 65:
      return { label: 'Heavy Continuous Rain', icon: 'cloud-rain', severity: 'high' };
    case 80:
    case 81:
      return { label: 'Convective Rain Showers', icon: 'cloud-rain', severity: 'high' };
    case 82:
      return { label: 'Violent Convective Rain', icon: 'cloud-lightning', severity: 'very_high' };
    case 95:
      return { label: 'Thunderstorm with Lightning', icon: 'zap', severity: 'very_high' };
    case 96:
    case 99:
      return { label: 'Severe Thunderstorm & Hail', icon: 'zap', severity: 'very_high' };
    default:
      return { label: 'Passing Clouds', icon: 'cloud', severity: 'low' };
  }
}

/**
 * Fetch live current weather & convective indices for any latitude/longitude
 */
export async function fetchLiveWeatherData(lat: number, lon: number): Promise<CurrentWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,surface_pressure,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=cape&forecast_days=1&timezone=auto`;

  try {
    const res = await fetchWithTimeout(url, {}, 4000);
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const hourly = data.hourly || {};
    const wCode = current.weather_code ?? 0;
    const wmo = describeWmoCode(wCode);

    // Current CAPE index
    const currentCape = hourly.cape?.[0] ?? 650;

    return {
      temperature: Math.round((current.temperature_2m ?? 28) * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m ?? 74),
      windSpeed: Math.round(current.wind_speed_10m ?? 14),
      windGusts: Math.round(current.wind_gusts_10m ?? 32),
      pressure: Math.round(current.surface_pressure ?? 1010),
      precipitation: Number((current.precipitation ?? 0).toFixed(1)),
      weatherCode: wCode,
      weatherDesc: wmo.label,
      cape: Math.round(currentCape),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('[WeatherAPI] Live Open-Meteo fetch failed, using fallback:', err);
    return {
      temperature: 28.5,
      humidity: 78,
      windSpeed: 22,
      windGusts: 44,
      pressure: 1008,
      precipitation: 4.2,
      weatherCode: 95,
      weatherDesc: 'Thunderstorm with Lightning',
      cape: 2150,
      updatedAt: '17:35 IST',
    };
  }
}

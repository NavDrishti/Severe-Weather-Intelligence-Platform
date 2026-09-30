import { MOCK_STORMS, MOCK_ALERTS, MOCK_DATA_HEALTH, MOCK_REPLAY_CASES, SEARCHABLE_LOCATIONS } from '../data/mockData';
import { StormCell, AlertItem, DataSourceHealth, ReplayCase } from '../types/weather';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// In-memory state for client-side persistence if backend is offline
let localAlerts = [...MOCK_ALERTS];

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/system/status`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // Graceful fallback
  }
  return {
    system_health: 'All Systems Operational',
    health_code: 'operational',
    ist_time: '17:35:42 IST',
    active_storms_count: MOCK_STORMS.length,
    active_alerts_count: localAlerts.filter(a => a.status === 'pending_review' || a.status === 'approved').length,
    data_sources: {
      radar: 'healthy',
      satellite: 'healthy',
      lightning: 'healthy',
      ground: 'delayed',
      nwp: 'healthy'
    }
  };
}

export async function fetchActiveStorms(): Promise<StormCell[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/storms/active`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.storms || MOCK_STORMS;
    }
  } catch {
    // Fallback
  }
  return MOCK_STORMS;
}

export async function fetchStormById(id: string): Promise<StormCell | undefined> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/storms/${id}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return MOCK_STORMS.find(s => s.id.toLowerCase() === id.toLowerCase());
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/alerts`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.alerts || localAlerts;
    }
  } catch {
    // Fallback
  }
  return localAlerts;
}

export async function reviewAlert(alertId: string, action: string, reviewerName: string = 'Duty Officer', notes: string = '') {
  try {
    const res = await fetch(`${API_BASE}/api/v1/alerts/${alertId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name: reviewerName, action, notes }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.alert;
    }
  } catch {
    // Fallback update
  }
  localAlerts = localAlerts.map(a => {
    if (a.id === alertId) {
      return { ...a, status: action as any, reviewer: `${reviewerName} (Local action)`, notes };
    }
    return a;
  });
  return localAlerts.find(a => a.id === alertId);
}

export async function fetchDataHealth(): Promise<DataSourceHealth[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/data-health`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.sources || MOCK_DATA_HEALTH;
    }
  } catch {
    // Fallback
  }
  return MOCK_DATA_HEALTH;
}

export async function fetchReplayCases(): Promise<ReplayCase[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/replay/cases`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.cases || MOCK_REPLAY_CASES;
    }
  } catch {
    // Fallback
  }
  return MOCK_REPLAY_CASES;
}

export async function searchLocationsApi(query: string) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/locations/search?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to client-side live search
  }
  if (!query) return SEARCHABLE_LOCATIONS.slice(0, 6);
  const q = query.toLowerCase();
  return SEARCHABLE_LOCATIONS.filter(l => l.name.toLowerCase().includes(q) || l.state.toLowerCase().includes(q));
}

export { fetchLiveConvectiveForecast, searchLocationsLive, fetchLiveRadarTileUrl } from '../services/weatherService';



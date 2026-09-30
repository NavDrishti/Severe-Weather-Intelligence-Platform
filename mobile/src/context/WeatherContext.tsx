import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppWeatherState, LocationData } from '../types/weather';
import { getCurrentUserLocation, requestLocationPermission, DEFAULT_FALLBACK_LOCATION } from '../services/locationService';
import { fetchLiveWeatherData } from '../api/weatherApi';
import { fetchRiskForecast, fetchActiveStorms } from '../api/riskApi';
import { fetchAlerts } from '../api/alertsApi';
import { saveWeatherCache, loadWeatherCache, saveLastLocation, loadLastLocation } from '../services/storageService';

interface WeatherContextType extends AppWeatherState {
  loadingStage: 'idle' | 'detecting_location' | 'checking_risk' | 'done';
  refresh: () => Promise<void>;
  requestPermissionAndLoad: () => Promise<void>;
  setLocationManually: (loc: LocationData) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppWeatherState>({
    location: null,
    currentWeather: null,
    risk: null,
    timeline: [],
    activeStorms: [],
    alerts: [],
    lastUpdatedTimestamp: null,
    isDelayed: false,
    isLoading: true,
    errorMessage: null,
    hasLocationPermission: null,
  });

  const [loadingStage, setLoadingStage] = useState<'idle' | 'detecting_location' | 'checking_risk' | 'done'>('detecting_location');

  const loadDataForLocation = useCallback(async (loc: LocationData) => {
    setLoadingStage('checking_risk');
    setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));

    try {
      // Parallel fetch: Live weather + Risk forecast + Storms + Alerts
      const [weatherRes, riskRes, stormsRes, alertsRes] = await Promise.allSettled([
        fetchLiveWeatherData(loc.lat, loc.lon),
        fetchRiskForecast(loc.lat, loc.lon),
        fetchActiveStorms(),
        fetchAlerts(),
      ]);

      const currentWeather = weatherRes.status === 'fulfilled' ? weatherRes.value : null;
      const riskData = riskRes.status === 'fulfilled' ? riskRes.value : null;
      const activeStorms = stormsRes.status === 'fulfilled' ? stormsRes.value : [];
      const alerts = alertsRes.status === 'fulfilled' ? alertsRes.value : [];

      if (!currentWeather && !riskData) {
        throw new Error('NETWORK_FAILED');
      }

      const bundle = {
        location: loc,
        currentWeather: currentWeather!,
        risk: riskData!.risk,
        timeline: riskData!.timeline,
        activeStorms,
        alerts,
      };

      // Save to offline storage
      saveWeatherCache(bundle);
      saveLastLocation(loc);

      setState({
        location: loc,
        currentWeather,
        risk: riskData?.risk || null,
        timeline: riskData?.timeline || [],
        activeStorms,
        alerts,
        lastUpdatedTimestamp: Date.now(),
        isDelayed: false,
        isLoading: false,
        errorMessage: null,
        hasLocationPermission: true,
      });
      setLoadingStage('done');
    } catch (err) {
      console.warn('[WeatherContext] Live fetch failed, attempting cached fallback:', err);
      // Attempt to load from offline cache
      const cached = await loadWeatherCache();
      if (cached) {
        setState({
          location: cached.location,
          currentWeather: cached.currentWeather,
          risk: cached.risk,
          timeline: cached.timeline,
          activeStorms: cached.activeStorms,
          alerts: cached.alerts,
          lastUpdatedTimestamp: cached.timestamp,
          isDelayed: true,
          isLoading: false,
          errorMessage: null,
          hasLocationPermission: true,
        });
        setLoadingStage('done');
      } else {
        // No cache available at all
        setState(prev => ({
          ...prev,
          isLoading: false,
          errorMessage: 'Weather information is temporarily unavailable.',
          isDelayed: false,
        }));
        setLoadingStage('done');
      }
    }
  }, []);

  const detectLocationAndLoad = useCallback(async () => {
    setLoadingStage('detecting_location');
    setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));

    try {
      const loc = await getCurrentUserLocation();
      await loadDataForLocation(loc);
    } catch (err: any) {
      if (err?.message === 'PERMISSION_DENIED') {
        setState(prev => ({
          ...prev,
          hasLocationPermission: false,
          isLoading: false,
          errorMessage: 'Location access is needed to show weather risk for your area.',
        }));
        setLoadingStage('done');
      } else {
        // GPS detection failed, try cached location or fallback to benchmark Pune location
        const lastLoc = await loadLastLocation();
        const fallback = lastLoc || DEFAULT_FALLBACK_LOCATION;
        await loadDataForLocation(fallback);
      }
    }
  }, [loadDataForLocation]);

  const requestPermissionAndLoad = async () => {
    const perm = await requestLocationPermission();
    if (perm.granted) {
      setState(prev => ({ ...prev, hasLocationPermission: true }));
      await detectLocationAndLoad();
    } else {
      setState(prev => ({ ...prev, hasLocationPermission: false }));
    }
  };

  const refresh = async () => {
    if (state.location) {
      await loadDataForLocation(state.location);
    } else {
      await detectLocationAndLoad();
    }
  };

  const setLocationManually = async (loc: LocationData) => {
    await loadDataForLocation(loc);
  };

  // Initial load on app mount
  useEffect(() => {
    detectLocationAndLoad();
  }, [detectLocationAndLoad]);

  return (
    <WeatherContext.Provider
      value={{
        ...state,
        loadingStage,
        refresh,
        requestPermissionAndLoad,
        setLocationManually,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

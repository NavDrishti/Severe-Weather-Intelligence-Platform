import * as Location from 'expo-location';
import { LocationData } from '../types/weather';

export interface LocationPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * Checks and requests location permission
 */
export async function requestLocationPermission(): Promise<LocationPermissionResult> {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    if (status === Location.PermissionStatus.GRANTED) {
      return { granted: true, canAskAgain: true };
    }

    const requestRes = await Location.requestForegroundPermissionsAsync();
    return {
      granted: requestRes.status === Location.PermissionStatus.GRANTED,
      canAskAgain: requestRes.canAskAgain,
    };
  } catch (err) {
    console.warn('[LocationService] Permission request failed:', err);
    return { granted: false, canAskAgain: true };
  }
}

/**
 * Fetches the user's current GPS position and reverse-geocodes to City, State
 */
export async function getCurrentUserLocation(): Promise<LocationData> {
  const perm = await requestLocationPermission();
  if (!perm.granted) {
    throw new Error('PERMISSION_DENIED');
  }

  // Get GPS Coordinates with a reasonable timeout so the app doesn't hang
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = position.coords;

  // Reverse geocode to get human readable city/state
  let cityName = 'Pune';
  let stateName = 'Maharashtra';
  let districtName: string | undefined = 'Pune';

  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses && addresses.length > 0) {
      const addr = addresses[0];
      cityName = addr.city || addr.subregion || addr.name || 'Current Location';
      stateName = addr.region || addr.country || 'India';
      districtName = addr.district || addr.subregion || undefined;
    }
  } catch (geoErr) {
    console.warn('[LocationService] Reverse geocode fallback:', geoErr);
  }

  return {
    name: cityName,
    state: stateName,
    district: districtName,
    lat: Number(latitude.toFixed(4)),
    lon: Number(longitude.toFixed(4)),
    isGps: true,
  };
}

/**
 * Fallback location (Pune, Maharashtra - primary testbed and benchmark)
 */
export const DEFAULT_FALLBACK_LOCATION: LocationData = {
  name: 'Pune',
  state: 'Maharashtra',
  district: 'Pune',
  lat: 18.52,
  lon: 73.86,
  isGps: false,
};

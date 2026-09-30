import { Platform } from 'react-native';

// Priority order of backend URLs:
// 1. Explicit environment variable EXPO_PUBLIC_API_URL
// 2. Host LAN IP (for physical Android phone on same Wi-Fi)
// 3. Android Emulator host loopback (10.0.2.2)
// 4. Localhost for web/desktop
const LAN_IP = '10.172.82.49';
const DEFAULT_PORT = '8000';

function getInitialBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    // Both 10.172.82.49 and 10.0.2.2 are viable for Android
    return `http://${LAN_IP}:${DEFAULT_PORT}`;
  }
  return `http://localhost:${DEFAULT_PORT}`;
}

export let API_BASE_URL = getInitialBaseUrl();

export function setApiBaseUrl(newUrl: string) {
  API_BASE_URL = newUrl.replace(/\/+$/, '');
}

/**
 * Standard fetch with configurable timeout (default 3.5s)
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

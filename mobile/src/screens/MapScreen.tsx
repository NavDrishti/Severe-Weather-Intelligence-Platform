import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../theme/colors';
import { Ionicons, Feather } from '@expo/vector-icons';

let NativeWebView: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeWebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('Native WebView could not be loaded', e);
  }
}

export const MapScreen: React.FC = () => {
  const { location, activeStorms, risk, refresh, isLoading } = useWeather();
  const { t } = useLanguage();

  const userLat = location?.lat || 18.52;
  const userLon = location?.lon || 73.86;

  // Generate crisp Leaflet HTML matching the White & Black design system
  const htmlContent = useMemo(() => {
    const stormsJson = JSON.stringify(activeStorms || []);
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #F8FAFC; }
    .user-marker {
      background: #0F172A;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      box-shadow: 0 0 12px rgba(15, 23, 42, 0.45);
    }
    .storm-popup {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      color: #0F172A;
      padding: 4px;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
      border: 1px solid #E2E8F0;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const userLat = ${userLat};
    const userLon = ${userLon};
    const storms = ${stormsJson};

    const map = L.map('map', { zoomControl: true, attributionControl: false }).setView([userLat, userLon], 10);

    // Clean, high-resolution OpenStreetMap basemap (100% Free, NO API Key Required, Zero Watermarks)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // RainViewer live radar layer
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
          const latest = data.radar.past[data.radar.past.length - 1];
          const host = data.host || 'https://tilecache.rainviewer.com';
          const radarUrl = host + latest.path + '/256/{z}/{x}/{y}/2/1_1.png';
          L.tileLayer(radarUrl, { opacity: 0.70, zIndex: 50 }).addTo(map);
        }
      }).catch(e => console.log('Radar tile load fallback'));

    // User Location Marker
    const userIcon = L.divIcon({ className: 'user-marker', iconSize: [18, 18], iconAnchor: [9, 9] });
    L.marker([userLat, userLon], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div class="storm-popup"><strong>Your Location</strong><br/>' + '${location?.name || "Current"}' + '</div>')
      .openPopup();

    // User Threat Radius (25 km circle)
    L.circle([userLat, userLon], {
      color: '#0F172A',
      fillColor: '#0F172A',
      fillOpacity: 0.05,
      radius: 25000,
      weight: 1.5,
      dashArray: '4, 4'
    }).addTo(map);

    // Storm Cells
    storms.forEach(storm => {
      const isSevere = (storm.severity || '').toLowerCase().includes('very high') || (storm.severity || '').toLowerCase().includes('high');
      const strokeColor = isSevere ? '#DC2626' : '#D97706';
      const fillColor = isSevere ? '#EF4444' : '#F59E0B';

      // Cell polygon if available
      if (storm.coordinates && storm.coordinates.length > 0) {
        L.polygon(storm.coordinates, {
          color: strokeColor,
          fillColor: fillColor,
          fillOpacity: 0.35,
          weight: 2
        }).addTo(map).bindPopup(
          '<div class="storm-popup">' +
          '<strong>' + storm.name + '</strong><br/>' +
          'Intensity: ' + storm.intensity + '<br/>' +
          'ETA: ' + storm.etaText + '<br/>' +
          'Speed: ' + storm.speedKmph + ' km/h' +
          '</div>'
        );
      } else if (storm.centroidLat && storm.centroidLon) {
        L.circle([storm.centroidLat, storm.centroidLon], {
          color: strokeColor,
          fillColor: fillColor,
          fillOpacity: 0.4,
          radius: 12000,
          weight: 2
        }).addTo(map).bindPopup('<strong>' + storm.name + '</strong><br/>' + storm.etaText);
      }

      // Track trajectory corridor
      if (storm.track && storm.track.length > 1) {
        const lineCoords = storm.track.map(t => [t.lat, t.lon]);
        L.polyline(lineCoords, {
          color: strokeColor,
          dashArray: '6, 6',
          weight: 3,
          opacity: 0.85
        }).addTo(map);
      }
    });
  </script>
</body>
</html>
    `;
  }, [userLat, userLon, activeStorms, location?.name]);

  const nearestStorm = activeStorms?.[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('tab.map')}</Text>
          <Text style={styles.subtitle}>{t('map.legend')}</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={refresh} disabled={isLoading}>
          <Feather name="refresh-cw" size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Map View - Cross-Platform (IFrame on Web/Laptop, WebView on Native) */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={htmlContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#F8FAFC',
            }}
            title="NavDrishti Live Weather Map"
          />
        ) : NativeWebView ? (
          <NativeWebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Map available on mobile and web browsers.</Text>
          </View>
        )}

        {/* Floating Legend Pill */}
        <View style={styles.floatingLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#0F172A' }]} />
            <Text style={styles.legendText}>{t('map.yourPosition')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.legendText}>Severe Cell</Text>
          </View>
        </View>
      </View>

      {/* Simplified Distance & Direction Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="navigate-circle" size={24} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>
              {nearestStorm ? nearestStorm.name : 'No active storms in your immediate vicinity'}
            </Text>
            <Text style={styles.infoDesc}>
              {nearestStorm
                ? `${nearestStorm.intensity} • ${nearestStorm.etaText} • Moving ${nearestStorm.speedKmph} km/h`
                : 'Current radar scans show clean conditions within a 25 km radius.'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  webView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  fallbackText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  floatingLegend: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontWeight: '500',
  },
});

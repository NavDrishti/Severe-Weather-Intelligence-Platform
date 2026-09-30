import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../theme/colors';
import { Ionicons, Feather } from '@expo/vector-icons';

export const MapScreen: React.FC = () => {
  const { location, activeStorms, risk, refresh, isLoading } = useWeather();
  const { t } = useLanguage();

  const userLat = location?.lat || 18.52;
  const userLon = location?.lon || 73.86;

  // Generate lightweight Leaflet HTML for the mobile webview
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
    body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #0B1120; }
    .user-marker {
      background: #06B6D4;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      box-shadow: 0 0 15px #06B6D4;
    }
    .storm-popup {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      color: #0F172A;
      padding: 2px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const userLat = ${userLat};
    const userLon = ${userLon};
    const storms = ${stormsJson};

    const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([userLat, userLon], 10);

    // Dark sleek basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(map);

    // RainViewer live radar layer
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
          const latest = data.radar.past[data.radar.past.length - 1];
          const host = data.host || 'https://tilecache.rainviewer.com';
          const radarUrl = host + latest.path + '/256/{z}/{x}/{y}/2/1_1.png';
          L.tileLayer(radarUrl, { opacity: 0.65, zIndex: 50 }).addTo(map);
        }
      }).catch(e => console.log('Radar tile load fallback'));

    // User Location Marker
    const userIcon = L.divIcon({ className: 'user-marker', iconSize: [18, 18], iconAnchor: [9, 9] });
    L.marker([userLat, userLon], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div class="storm-popup"><strong>Your Location</strong><br/>' + '${location?.name || "Current"}' + '</div>')
      .openPopup();

    // User Warning Range Circle (30 km threat radius)
    L.circle([userLat, userLon], {
      color: '#06B6D4',
      fillColor: '#06B6D4',
      fillOpacity: 0.08,
      radius: 25000,
      weight: 1.5,
      dashArray: '4, 4'
    }).addTo(map);

    // Storm Cells
    storms.forEach(storm => {
      const isSevere = (storm.severity || '').toLowerCase().includes('very high') || (storm.severity || '').toLowerCase().includes('high');
      const strokeColor = isSevere ? '#EF4444' : '#F59E0B';
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
          opacity: 0.8
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

      {/* Map View */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />

        {/* Floating Legend Pill */}
        <View style={styles.floatingLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#06B6D4' }]} />
            <Text style={styles.legendText}>{t('map.yourPosition')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Severe Cell</Text>
          </View>
        </View>
      </View>

      {/* Simplified Distance & Direction Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="navigate-circle-outline" size={24} color={Colors.primaryLight} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>
              {nearestStorm ? nearestStorm.name : 'No active storms in your immediate vicinity'}
            </Text>
            <Text style={styles.infoDesc}>
              {nearestStorm
                ? `${nearestStorm.intensity} • ${nearestStorm.etaText} • Moving ${nearestStorm.speedKmph} km/h`
                : 'Current radar scans show clean conditions within a 30 km radius.'}
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
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0B1120',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  floatingLegend: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontWeight: '600',
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
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});

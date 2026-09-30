import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../theme/colors';
import { LocationHeader } from '../components/LocationHeader';
import { RiskCard } from '../components/RiskCard';
import { WeatherMetrics } from '../components/WeatherMetrics';
import { DelayedDataBanner } from '../components/DelayedDataBanner';
import { PermissionPrompt } from '../components/PermissionPrompt';
import { LoadingState } from '../components/LoadingState';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
  const {
    location,
    currentWeather,
    risk,
    isLoading,
    isDelayed,
    lastUpdatedTimestamp,
    loadingStage,
    hasLocationPermission,
    refresh,
    requestPermissionAndLoad,
    errorMessage,
  } = useWeather();

  const { t } = useLanguage();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && loadingStage === 'done'}
            onRefresh={refresh}
            tintColor={Colors.primaryLight}
            colors={[Colors.primaryLight]}
          />
        }
      >
        {/* Top Location & App Bar */}
        <LocationHeader
          location={location}
          onRefresh={refresh}
          isLoading={isLoading}
        />

        {/* Permission Denied Banner */}
        {hasLocationPermission === false && (
          <PermissionPrompt onAllow={requestPermissionAndLoad} />
        )}

        {/* Offline / Delayed Data Notice */}
        <DelayedDataBanner
          isDelayed={isDelayed}
          timestamp={lastUpdatedTimestamp}
          onRetry={refresh}
          isLoading={isLoading}
        />

        {/* Initial Loading Experience */}
        {isLoading && loadingStage !== 'done' ? (
          <LoadingState stage={loadingStage} />
        ) : errorMessage && !risk ? (
          /* Error Fallback with Retry */
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.errorText}>{t('network.error')}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>{t('loc.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Main Result-Focused Content */
          <View>
            {/* 1. Main Risk Card (The focal element) */}
            <RiskCard risk={risk} />

            {/* 2. Most Useful Weather Information */}
            <WeatherMetrics weather={currentWeather} />

            {/* 3. Live Weather/Risk Map Button */}
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.8}
            >
              <Ionicons name="map-sharp" size={18} color="#0B1120" style={{ marginRight: 8 }} />
              <Text style={styles.mapButtonText}>{t('map.viewLive')}</Text>
            </TouchableOpacity>

            {/* Subtle Evidence/Context footer for credibility */}
            {risk?.hazards && risk.hazards.length > 0 && (
              <View style={styles.hazardsSummaryCard}>
                <Text style={styles.hazardsSummaryTitle}>
                  {risk.level === 'LOW' ? 'Atmospheric Stability' : 'Active Hazard Indicators'}
                </Text>
                {risk.hazards.map((h, i) => (
                  <View key={i} style={styles.hazardRow}>
                    <Text style={styles.hazardName}>{h.name}</Text>
                    <View style={styles.hazardBarTrack}>
                      <View
                        style={[
                          styles.hazardBarFill,
                          {
                            width: `${Math.round(h.probability * 100)}%`,
                            backgroundColor: h.probability >= 0.7 ? Colors.riskHigh : Colors.primaryLight,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.hazardPercent}>{Math.round(h.probability * 100)}%</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 16,
    marginVertical: 12,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B1120',
    letterSpacing: 0.3,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#0B1120',
    fontWeight: '700',
    fontSize: 14,
  },
  hazardsSummaryCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  hazardsSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  hazardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  hazardName: {
    width: 90,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  hazardBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  hazardBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  hazardPercent: {
    width: 38,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

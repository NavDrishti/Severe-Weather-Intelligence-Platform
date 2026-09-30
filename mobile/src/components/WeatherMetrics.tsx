import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CurrentWeather } from '../types/weather';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { Feather, Ionicons } from '@expo/vector-icons';

interface WeatherMetricsProps {
  weather: CurrentWeather | null;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather }) => {
  const { t } = useLanguage();

  if (!weather) return null;

  return (
    <View style={styles.container}>
      {/* Temperature */}
      <View style={styles.metricCard}>
        <Ionicons name="thermometer-outline" size={20} color="#DC2626" />
        <Text style={styles.metricValue}>{weather.temperature}°C</Text>
        <Text style={styles.metricLabel}>{t('weather.temperature')}</Text>
      </View>

      {/* Humidity */}
      <View style={styles.metricCard}>
        <Ionicons name="water-outline" size={20} color="#0284C7" />
        <Text style={styles.metricValue}>{weather.humidity}%</Text>
        <Text style={styles.metricLabel}>{t('weather.humidity')}</Text>
      </View>

      {/* Wind Gusts */}
      <View style={styles.metricCard}>
        <Feather name="wind" size={20} color="#059669" />
        <Text style={styles.metricValue}>{weather.windGusts} <Text style={styles.unit}>km/h</Text></Text>
        <Text style={styles.metricLabel}>{t('weather.wind')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 6,
    marginBottom: 2,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

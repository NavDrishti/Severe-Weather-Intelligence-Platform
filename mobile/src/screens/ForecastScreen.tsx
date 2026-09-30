import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../theme/colors';
import { ForecastHour, RiskLevel } from '../types/weather';
import { Feather, Ionicons } from '@expo/vector-icons';

export const ForecastScreen: React.FC = () => {
  const { timeline, location } = useWeather();
  const { t } = useLanguage();

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'SEVERE':
        return Colors.riskSevere;
      case 'HIGH':
        return Colors.riskHigh;
      case 'MODERATE':
        return Colors.riskModerate;
      case 'LOW':
      default:
        return Colors.riskLow;
    }
  };

  const getRiskBg = (level: RiskLevel) => {
    switch (level) {
      case 'SEVERE':
        return Colors.riskSevereBg;
      case 'HIGH':
        return Colors.riskHighBg;
      case 'MODERATE':
        return Colors.riskModerateBg;
      case 'LOW':
      default:
        return Colors.riskLowBg;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('forecast.title')}</Text>
        <Text style={styles.subtitle}>
          📍 {location ? `${location.name}, ${location.state}` : 'Current Area'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Timeline Items */}
        {timeline.map((item, index) => {
          const color = getRiskColor(item.riskLevel);
          const bg = getRiskBg(item.riskLevel);

          return (
            <View key={index} style={styles.stepContainer}>
              {/* Left Timeline Indicator */}
              <View style={styles.leftCol}>
                <View style={[styles.nodeCircle, { borderColor: color, backgroundColor: bg }]}>
                  <View style={[styles.innerDot, { backgroundColor: color }]} />
                </View>
                {index < timeline.length - 1 && <View style={styles.verticalLine} />}
              </View>

              {/* Step Card */}
              <View style={[styles.stepCard, { borderColor: color, backgroundColor: Colors.surface }]}>
                <View style={styles.topRow}>
                  <View style={styles.timeGroup}>
                    <Text style={styles.hourLabel}>{item.hourLabel}</Text>
                    <Text style={styles.timeLabel}>({item.time})</Text>
                  </View>

                  <View style={[styles.riskBadge, { backgroundColor: bg, borderColor: color }]}>
                    <Text style={[styles.riskText, { color }]}>
                      {t(`risk.${item.riskLevel}`)}
                    </Text>
                  </View>
                </View>

                {/* Weather Condition */}
                <Text style={styles.conditionText}>{item.weatherDesc}</Text>

                {/* Warning if applicable */}
                {item.warning && (
                  <View style={styles.warningBox}>
                    <Ionicons name="warning-outline" size={14} color={Colors.riskHigh} />
                    <Text style={styles.warningText}>{item.warning}</Text>
                  </View>
                )}

                {/* Simple metric pills */}
                <View style={styles.metricsPillRow}>
                  {item.lightningProb > 20 && (
                    <View style={styles.metricPill}>
                      <Ionicons name="flash" size={11} color="#F87171" />
                      <Text style={styles.pillText}>Lightning {item.lightningProb}%</Text>
                    </View>
                  )}
                  {item.rainRate > 0 && (
                    <View style={styles.metricPill}>
                      <Ionicons name="rainy" size={11} color="#60A5FA" />
                      <Text style={styles.pillText}>{item.rainRate} mm/h</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  leftCol: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  nodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  stepCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  hourLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  timeLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  riskBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '800',
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.riskHigh,
  },
  metricsPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

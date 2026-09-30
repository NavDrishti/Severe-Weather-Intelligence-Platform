import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors } from '../theme/colors';
import { Ionicons, Feather } from '@expo/vector-icons';

export const AlertsScreen: React.FC = () => {
  const { alerts } = useWeather();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('alerts.title')}</Text>
        <Text style={styles.disclaimerText}>{t('alerts.disclaimer')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color={Colors.riskLow} />
            <Text style={styles.emptyText}>{t('alerts.noAlerts')}</Text>
          </View>
        ) : (
          alerts.map((alert) => {
            const isRed = alert.severity === 'red';
            const badgeColor = isRed ? Colors.riskSevere : Colors.riskHigh;
            const badgeBg = isRed ? Colors.riskSevereBg : Colors.riskHighBg;

            return (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  { borderColor: isRed ? Colors.riskSevereBorder : Colors.riskHighBorder },
                ]}
              >
                {/* Category & Badge */}
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: badgeBg, borderColor: badgeColor }]}>
                    <Ionicons
                      name={alert.isOfficial ? 'shield-checkmark' : 'analytics'}
                      size={13}
                      color={badgeColor}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.badgeText, { color: badgeColor }]}>
                      {alert.isOfficial ? t('alerts.official') : t('alerts.aiNowcast')}
                    </Text>
                  </View>

                  <Text style={styles.timeTag}>
                    Valid until {alert.validUntil} IST
                  </Text>
                </View>

                {/* Title */}
                <Text style={styles.alertTitle}>{alert.title}</Text>

                {/* Affected Area */}
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{alert.affectedArea}</Text>
                </View>

                {/* Recommended Action */}
                <View style={styles.actionBox}>
                  <Feather name="alert-circle" size={15} color={badgeColor} style={{ marginTop: 2 }} />
                  <Text style={styles.actionText}>{alert.recommendedAction}</Text>
                </View>
              </View>
            );
          })
        )}
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
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  timeTag: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});

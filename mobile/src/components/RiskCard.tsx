import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskStatus, RiskLevel } from '../types/weather';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface RiskCardProps {
  risk: RiskStatus | null;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
  const { t, language } = useLanguage();

  if (!risk) return null;

  const getRiskTheme = (level: RiskLevel) => {
    switch (level) {
      case 'SEVERE':
        return {
          textColor: Colors.riskSevere,
          bgColor: Colors.riskSevereBg,
          borderColor: Colors.riskSevereBorder,
          iconName: 'alert-octagon' as const,
        };
      case 'HIGH':
        return {
          textColor: Colors.riskHigh,
          bgColor: Colors.riskHighBg,
          borderColor: Colors.riskHighBorder,
          iconName: 'alert-triangle' as const,
        };
      case 'MODERATE':
        return {
          textColor: Colors.riskModerate,
          bgColor: Colors.riskModerateBg,
          borderColor: Colors.riskModerateBorder,
          iconName: 'alert-circle' as const,
        };
      case 'LOW':
      default:
        return {
          textColor: Colors.riskLow,
          bgColor: Colors.riskLowBg,
          borderColor: Colors.riskLowBorder,
          iconName: 'check-circle' as const,
        };
    }
  };

  const theme = getRiskTheme(risk.level);

  // Translate headline and recommendation if in Hindi
  let headlineText = risk.headline;
  if (language === 'hi') {
    if (risk.level === 'LOW') {
      headlineText = t('headline.safe');
    } else if (risk.headline.toLowerCase().includes('thunderstorm')) {
      headlineText = t('headline.thunderstorm');
    } else if (risk.headline.toLowerCase().includes('hail')) {
      headlineText = t('headline.hail');
    } else if (risk.headline.toLowerCase().includes('cloudburst')) {
      headlineText = t('headline.cloudburst');
    }
  }

  let recommendationText = risk.recommendation;
  if (language === 'hi') {
    if (risk.level === 'LOW') {
      recommendationText = t('advice.safe');
    } else if (risk.recommendation.toLowerCase().includes('indoors')) {
      recommendationText = t('advice.indoor');
    } else if (risk.recommendation.toLowerCase().includes('shelter')) {
      recommendationText = t('advice.shelter');
    }
  }

  return (
    <View style={[styles.card, { borderColor: theme.borderColor, backgroundColor: theme.bgColor }]}>
      {/* Top Badge */}
      <View style={styles.badgeRow}>
        <View style={[styles.levelBadge, { backgroundColor: theme.textColor }]}>
          <Feather name={theme.iconName} size={15} color="#0B1120" style={{ marginRight: 5 }} />
          <Text style={styles.levelText}>{t(`risk.${risk.level}`)}</Text>
        </View>

        {risk.eta && risk.level !== 'LOW' && (
          <View style={styles.etaContainer}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.etaText}>{risk.eta}</Text>
          </View>
        )}
      </View>

      {/* Main Headline */}
      <Text style={styles.headline}>{headlineText}</Text>

      {/* Safety Recommendation */}
      <View style={styles.recommendationBox}>
        <Feather name="shield" size={16} color={theme.textColor} style={styles.recIcon} />
        <Text style={styles.recommendationText}>{recommendationText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 20,
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  levelText: {
    color: '#0B1120',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  etaText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 30,
    marginBottom: 14,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(11, 17, 32, 0.5)',
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  recIcon: {
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

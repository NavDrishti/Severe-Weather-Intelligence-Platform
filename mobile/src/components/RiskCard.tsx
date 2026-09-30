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
          badgeText: '#FFFFFF',
          iconName: 'alert-octagon' as const,
        };
      case 'HIGH':
        return {
          textColor: Colors.riskHigh,
          bgColor: Colors.riskHighBg,
          borderColor: Colors.riskHighBorder,
          badgeText: '#FFFFFF',
          iconName: 'alert-triangle' as const,
        };
      case 'MODERATE':
        return {
          textColor: Colors.riskModerate,
          bgColor: Colors.riskModerateBg,
          borderColor: Colors.riskModerateBorder,
          badgeText: '#FFFFFF',
          iconName: 'alert-circle' as const,
        };
      case 'LOW':
      default:
        return {
          textColor: Colors.riskLow,
          bgColor: Colors.riskLowBg,
          borderColor: Colors.riskLowBorder,
          badgeText: '#FFFFFF',
          iconName: 'check-circle' as const,
        };
    }
  };

  const theme = getRiskTheme(risk.level);

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
          <Feather name={theme.iconName} size={15} color={theme.badgeText} style={{ marginRight: 6 }} />
          <Text style={[styles.levelText, { color: theme.badgeText }]}>{t(`risk.${risk.level}`)}</Text>
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
        <Feather name="shield" size={17} color={theme.textColor} style={styles.recIcon} />
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
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  etaText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  headline: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 30,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  recIcon: {
    marginTop: 1,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

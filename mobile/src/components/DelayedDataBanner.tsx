import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { formatTimeAgo } from '../services/storageService';
import { Feather } from '@expo/vector-icons';

interface DelayedDataBannerProps {
  isDelayed: boolean;
  timestamp: number | null;
  onRetry: () => void;
  isLoading?: boolean;
}

export const DelayedDataBanner: React.FC<DelayedDataBannerProps> = ({
  isDelayed,
  timestamp,
  onRetry,
  isLoading = false,
}) => {
  const { t, language } = useLanguage();

  if (!isDelayed && !timestamp) return null;

  const timeAgo = timestamp ? formatTimeAgo(timestamp, language) : '';

  return (
    <View style={styles.banner}>
      <View style={styles.left}>
        <Feather name="clock" size={14} color={Colors.riskModerate} />
        <View style={styles.textColumn}>
          {isDelayed && <Text style={styles.delayedTag}>{t('network.delayed')}</Text>}
          <Text style={styles.timeText}>
            {t('network.lastUpdated')} {timeAgo}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.retryBtn, isLoading && { opacity: 0.6 }]}
        onPress={onRetry}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Feather name="refresh-cw" size={13} color={Colors.textPrimary} style={{ marginRight: 4 }} />
        <Text style={styles.retryText}>{t('loc.refresh')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textColumn: {
    flexDirection: 'column',
  },
  delayedTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.riskModerate,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});

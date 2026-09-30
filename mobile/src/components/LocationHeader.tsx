import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LocationData } from '../types/weather';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { Ionicons, Feather } from '@expo/vector-icons';

interface LocationHeaderProps {
  location: LocationData | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({
  location,
  onRefresh,
  isLoading,
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  const locationTitle = location
    ? `${location.name}, ${location.state}`
    : t('loc.detecting');

  return (
    <View style={styles.header}>
      {/* Brand & Language Row */}
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <View style={styles.brandIconCircle}>
            <Ionicons name="shield-half" size={18} color="#06B6D4" />
          </View>
          <Text style={styles.brandTitle}>{t('app.name')}</Text>
        </View>

        <View style={styles.actionsGroup}>
          {/* Language Switcher */}
          <TouchableOpacity
            style={styles.langBtn}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.langText}>
              {language === 'en' ? 'हिन्दी' : 'English'}
            </Text>
          </TouchableOpacity>

          {/* Refresh Button */}
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={onRefresh}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primaryLight} />
            ) : (
              <Feather name="refresh-cw" size={16} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Pin Row */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={20} color={Colors.primaryLight} />
        <Text style={styles.locationText} numberOfLines={1}>
          {locationTitle}
        </Text>
        {location?.isGps && (
          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>GPS</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  gpsBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  gpsBadgeText: {
    color: Colors.liveBadge,
    fontSize: 10,
    fontWeight: '800',
  },
});

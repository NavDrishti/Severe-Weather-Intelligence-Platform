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
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
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
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Feather name="refresh-cw" size={15} color={Colors.textPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Pin Row */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={18} color="#0F172A" />
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
    paddingBottom: 8,
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
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  langText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  gpsBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  gpsBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
});

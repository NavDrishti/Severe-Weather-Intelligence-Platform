import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

interface PermissionPromptProps {
  onAllow: () => void;
}

export const PermissionPrompt: React.FC<PermissionPromptProps> = ({ onAllow }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="location-outline" size={32} color={Colors.primaryLight} />
      </View>
      <Text style={styles.title}>{t('loc.permissionNeeded')}</Text>
      <TouchableOpacity style={styles.btn} onPress={onAllow} activeOpacity={0.8}>
        <Text style={styles.btnText}>{t('loc.allowBtn')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  btnText: {
    color: '#0B1120',
    fontSize: 15,
    fontWeight: '800',
  },
});

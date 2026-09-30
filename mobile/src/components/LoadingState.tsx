import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

interface LoadingStateProps {
  stage: 'detecting_location' | 'checking_risk' | 'idle' | 'done';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ stage }) => {
  const { t } = useLanguage();

  const label = stage === 'checking_risk'
    ? t('loc.checkingRisk')
    : t('loc.detecting');

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primaryLight} style={{ marginBottom: 16 }} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
});

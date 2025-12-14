import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function StatCard({ icon, label, value }: any) {
  return (
    <View style={styles.card}>
      <MaterialIcons name={icon} size={26} color={theme.colors.accent} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  label: {
    color: theme.colors.textMuted,
    marginTop: 8,
  },
  value: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
});

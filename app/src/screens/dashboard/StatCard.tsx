import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

export default function StatCard({ icon, label, value, onPress }: { icon: string; label: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress && onPress();
      }}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={26} color={theme.colors.accent} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
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

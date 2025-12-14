import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

export default function DashboardHeader({ onMenu, onAddDevice }: { onMenu: () => void; onAddDevice: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onMenu();
      }}>
        <MaterialIcons name="menu" size={26} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>SERA DASHBOARD</Text>

      <TouchableOpacity onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAddDevice();
      }}>
        <MaterialIcons name="add" size={26} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 34, // Added top padding for safe area/status bar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

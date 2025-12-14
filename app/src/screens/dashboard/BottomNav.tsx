import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function BottomNav() {
  return (
    <View style={styles.nav}>
      <MaterialIcons name="dashboard" size={24} color={theme.colors.accent} />
      <MaterialIcons name="map" size={24} color={theme.colors.textMuted} />
      <MaterialIcons name="settings" size={24} color={theme.colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

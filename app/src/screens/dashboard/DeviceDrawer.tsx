import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SlideSheet from '../../../../components/SlideSheet';
import { theme } from '../../theme';

export default function DeviceDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <SlideSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Connected Devices</Text>

      <View style={styles.device}>
        <Text style={styles.name}>Sera Unit-01</Text>
        <Text style={styles.status}>Connected • 98%</Text>
      </View>

      <View style={styles.device}>
        <Text style={styles.name}>Sera Unit-02</Text>
        <Text style={styles.status}>Standby</Text>
      </View>
    </SlideSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 20,
  },
  device: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
  },
  name: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  status: {
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});

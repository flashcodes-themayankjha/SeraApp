import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function RecentActivity() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <View style={styles.activityItem}>
        <MaterialIcons name="wifi" size={20} color={theme.colors.textPrimary} />
        <Text style={styles.activityText}>Connected to Home_Wifi_5G</Text>
        <Text style={styles.activityTime}>10 min ago</Text>
      </View>
      <View style={styles.activityItem}>
        <MaterialIcons name="mood" size={20} color={theme.colors.textPrimary} />
        <Text style={styles.activityText}>Emotion set to Happy</Text>
        <Text style={styles.activityTime}>1 hour ago</Text>
      </View>
      <View style={styles.activityItem}>
        <MaterialIcons name="battery-charging-full" size={20} color={theme.colors.textPrimary} />
        <Text style={styles.activityText}>Battery charged to 100%</Text>
        <Text style={styles.activityTime}>Yesterday</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityText: {
    flex: 1,
    color: theme.colors.textPrimary,
    marginLeft: 10,
  },
  activityTime: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});

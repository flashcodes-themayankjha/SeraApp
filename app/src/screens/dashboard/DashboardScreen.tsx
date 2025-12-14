import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { theme } from '../../theme';
import { useLocalSearchParams } from 'expo-router';

import DashboardHeader from './DashboardHeader';
import DeviceDrawer from './DeviceDrawer';
import BottomNav from './BottomNav';
import StatCard from './StatCard';
import ActionCard from './ActionCard';
import WifiSetupSheet from '../WifiSetupSheet';
import DashboardHero from './DashboardHero'; // Import DashboardHero

// Define Device type (should ideally be in a shared types file)
type Device = {
  name: string;
  room: string;
  battery: number;
  connected: boolean;
};

export default function DashboardScreen() {
  const { deviceName } = useLocalSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wifiSetupSheetVisible, setWifiSetupSheetVisible] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null); // New state for connected device

  useEffect(() => {
    if (deviceName) {
      setConnectedDevice({
        name: deviceName as string,
        room: 'Living Room', // Placeholder, or fetch from a store/API
        battery: 100, // Placeholder
        connected: true,
      });
    }
  }, [deviceName]);

  const handleRobotConnect = (device: Device) => {
    setConnectedDevice(device);
    setWifiSetupSheetVisible(false); // Close the sheet after connecting
  };

  return (
    <View style={styles.container}>
      <DashboardHeader
        onMenu={() => setDrawerOpen(true)}
        onAddDevice={() => setWifiSetupSheetVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HERO */}
       <DashboardHero device={connectedDevice} />

        {/* STATS */}
        <View style={styles.statsRow}>
          <StatCard icon="battery-charging-full" label="Battery" value={connectedDevice ? `${connectedDevice.battery}%` : 'N/A'} />
          <StatCard icon="wifi" label="Signal" value="5G" />
          <StatCard icon="thermostat" label="Temp" value="34°C" />
        </View>

        {/* QUICK ACTIONS */}
        <Text style={[theme.typography.title, { color: theme.colors.textPrimary, textTransform: 'uppercase', marginBottom: 12 }]}>QUICK ACTIONS</Text>
       
<View style={{ flexDirection: 'row', gap: 16 }}>
  <ActionCard icon="mood" title="Emotions" subtitle="Set mood" />
  <ActionCard icon="volume-up" title="Play Sound" subtitle="Library" />
</View>

<View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
  <ActionCard icon="tune" title="Calibrate" subtitle="Sensors" />
  <ActionCard icon="system-update" title="OTA Update" subtitle="v2.4.1" />
</View>

        </ScrollView>

      <BottomNav />

      <DeviceDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Render WifiSetupSheet */}
      <WifiSetupSheet
        visible={wifiSetupSheetVisible}
        onClose={() => setWifiSetupSheetVisible(false)}
        onConnectRobot={handleRobotConnect} // Pass the handler
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    gap: 16,
  },
});

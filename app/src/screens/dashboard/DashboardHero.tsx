import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { theme } from '../../theme';

const seraImage = require('../../../src/assets/icons/sera.png'); // Corrected path

type Device = {
  name: string;
  room: string;
  battery: number;
  connected: boolean;
};

export default function DashboardHero({
  device,
}: {
  device: Device | null; // Updated prop type
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.hero}>
      {/* HALO */}
      <Animated.View
        style={[
          styles.haloOuter,
          { transform: [{ scale: pulse }] },
        ]}
      />
      <View style={styles.haloInner} />

      {/* ROBOT */}
      {device ? (
        <>
          <Image source={seraImage} style={styles.avatar} />

          {/* STATUS PILL */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              Connected • {device.battery}%
            </Text>
          </View>

          {/* DEVICE INFO */}
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceSub}>
            Standby Mode • {device.room}
          </Text>
        </>
      ) : (
        <>
          <Image source={seraImage} style={styles.avatar} />
          <Text style={styles.deviceName}>No Device Connected</Text>
          <Text style={styles.deviceSub}>
            Please connect a device via Wi-Fi Setup
          </Text>
        </>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  hero: {
    height: 300,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    overflow: 'hidden',
  },

  haloOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(214, 190, 138, 0.35)',
  },

  haloInner: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: 'rgba(214, 190, 138, 0.6)',
  },

  avatar: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(214, 190, 138, 0.35)',
    marginBottom: 12,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },

  statusText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },

  deviceName: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 6,
  },

  deviceSub: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

const seraImage = require('../../../src/assets/icons/sera.png');

type Device = {
  name: string;
  room: string;
  battery: number;
  connected: boolean;
};

export default function DashboardHero({ device }: { device: Device }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.hero}>
      {/* INNER GRADIENT */}
      <LinearGradient
        colors={['rgba(255,255,255,0.04)', 'rgba(0,0,0,0.35)']}
        style={StyleSheet.absoluteFill}
      />

      {/* HALO RINGS */}
      <Animated.View
        style={[
          styles.haloOuter,
          { transform: [{ scale: pulse }] },
        ]}
      />
      <View style={styles.haloInner} />

      {/* ROBOT */}
      <Image source={seraImage} style={styles.avatar} />

      {/* STATUS PILL */}
      <View style={styles.statusPill}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          Connected • {device.battery}%
        </Text>
      </View>

      {/* TEXT */}
      <Text style={styles.deviceName}>{device.name}</Text>
      <Text style={styles.deviceSub}>
        Standby Mode • {device.room}
      </Text>
    </View>
  );
}

const GOLD = '#D6BE8A';

const styles = StyleSheet.create({
  hero: {
    height: 360,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    paddingTop: 36,
    marginBottom: 28,
    overflow: 'hidden',
  },

  haloOuter: {
    position: 'absolute',
    top: 54,
    width: 208,
    height: 208,
    borderRadius: 104,
    borderWidth: 2,
    borderColor: 'rgba(214,190,138,0.35)',
  },

  haloInner: {
    position: 'absolute',
    top: 70,
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 1,
    borderColor: 'rgba(214,190,138,0.6)',
  },

  avatar: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 4,
    transform: [{ translateX: 4 }, { translateY: 38 }],
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 0,
    borderRadius: 999,
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(214,190,138,0.45)',
    marginBottom: 14,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GOLD,
  },

  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  deviceName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },

  deviceSub: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
});

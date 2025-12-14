import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import SlideSheet from '../../../../components/SlideSheet';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PAGE_WIDTH = SCREEN_WIDTH; // Each page takes full screen width

const seraImage = require('../../../src/assets/icons/sera.png');

/* =================================================
   TYPES
================================================= */

type DeviceStatus = 'connected' | 'online' | 'offline';

type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  battery?: number;
};

/* =================================================
   MOCK DATA
================================================= */

const DEVICES: Device[] = [
  { id: '1', name: 'Sera Unit-01', status: 'connected', battery: 98 },
  { id: '2', name: 'Sera Unit-02', status: 'online', battery: 72 },
  { id: '3', name: 'Sera Unit-03', status: 'offline' },
];

/* =================================================
   COMPONENT
================================================= */

export default function DeviceDrawer({
  visible,
  onClose,
  onConnectDevice,
}: {
  visible: boolean;
  onClose: () => void;
  onConnectDevice: (device: Device) => void;
}) {
  const listRef = useRef<FlatList<Device>>(null);
  const [index, setIndex] = useState(0);

  const onScrollEnd = (e: any) => {
    const newIndex = Math.round(
      e.nativeEvent.contentOffset.x / PAGE_WIDTH
    );
    setIndex(newIndex);
  };

  return (
    <SlideSheet visible={visible} onClose={onClose} initialSnapPoint={Dimensions.get('window').height * 0.35}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Devices</Text>
      </View>

      {/* DEVICE PAGER */}
      <FlatList
        ref={listRef}
        data={DEVICES}
        keyExtractor={item => item.id}
        horizontal
        snapToInterval={PAGE_WIDTH}
        decelerationRate="fast"
        pagingEnabled={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: PAGE_WIDTH }]}>
            {/* DEVICE IMAGE */}
            <Image source={seraImage} style={styles.avatar} />

            {/* STATUS PILL */}
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.dot,
                  item.status === 'connected' && styles.dotConnected,
                  item.status === 'online' && styles.dotOnline,
                  item.status === 'offline' && styles.dotOffline,
                ]}
              />
              <Text style={styles.statusText}>
                {item.status === 'connected' &&
                  `Connected • ${item.battery}%`}
                {item.status === 'online' &&
                  `Online • ${item.battery}%`}
                {item.status === 'offline' && 'Offline'}
              </Text>
            </View>

            {/* DEVICE NAME */}
            <Text style={styles.deviceName}>{item.name}</Text>

            {/* ACTION */}
            {item.status === 'connected' ? (
              <View style={styles.currentBtn}>
                <Text style={styles.currentText}>Current Device</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onConnectDevice(item);
                }}
              >
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* PAGE INDICATOR */}
      <View style={styles.indicator}>
        {DEVICES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicatorDot,
              i === index && styles.indicatorDotActive,
            ]}
          />
        ))}
      </View>
    </SlideSheet>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  close: {
    fontSize: 22,
    color: theme.colors.textMuted,
  },

  /* PAGE */
  page: {
    alignItems: 'center',
    paddingTop: 24,
  },

  avatar: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 18,
  },

  /* STATUS */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(214,190,138,0.35)',
    marginBottom: 14,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotConnected: {
    backgroundColor: theme.colors.accent, // gold
  },
  dotOnline: {
    backgroundColor: '#4CD964', // green
  },
  dotOffline: {
    backgroundColor: '#6E6E6E',
  },

  statusText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },

  /* NAME */
  deviceName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 28,
  },

  /* BUTTONS */
  currentBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(214,190,138,0.35)',
  },
  currentText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },

  connectBtn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  connectText: {
    color: '#000',
    fontWeight: '700',
  },

  /* INDICATOR */
  indicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  indicatorDot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceAlt,
  },
  indicatorDotActive: {
    backgroundColor: theme.colors.accent,
  },
});
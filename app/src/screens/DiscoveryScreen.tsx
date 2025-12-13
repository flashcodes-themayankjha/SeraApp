import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

export default function DiscoveryScreen() {
  const navigation = useNavigation<any>();

  // Radar rings
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  // Eye blink
  const blink = useRef(new Animated.Value(1)).current;

  const [scanning] = useState(true);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const ringAnim = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    Animated.parallel([
      ringAnim(ring1, 0),
      ringAnim(ring2, 850),
      ringAnim(ring3, 1700),
    ]).start();

    // Subtle robot blink
    Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        Animated.timing(blink, {
          toValue: 0.15,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowCancel(true)}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          {/* Radar Rings */}
          {[ring1, ring2, ring3].map((ring, i) => (
            <Animated.View
              key={i}
              style={[
                styles.ring,
                {
                  opacity: ring.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 0],
                  }),
                  transform: [
                    {
                      scale: ring.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.8],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}

          {/* Face */}
          <View style={styles.faceOuter}>
            <View style={styles.faceInner}>
              <Animated.View
                style={[
                  styles.eye,
                  { transform: [{ scaleY: blink }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.eye,
                  { transform: [{ scaleY: blink }] },
                ]}
              />
            </View>
          </View>

          <Text style={styles.title}>Hello! Let's find your Sera.</Text>
          <Text style={styles.subtitle}>
            Make sure your robot is turned on and nearby.
          </Text>

          <View style={styles.scanPill}>
            <View style={styles.dot} />
            <Text style={styles.scanText}>
              {scanning ? 'SCANNING FOR DEVICES…' : 'SCAN COMPLETE'}
            </Text>
          </View>
        </View>

        {/* Available Robots */}
        <Text style={styles.section}>Available Robots</Text>

        <RobotCard
          name="Sera Unit X-1"
          signal="Strong Signal"
          active
          onConnect={() => navigation.navigate('Dashboard')}
        />

        <RobotCard
          name="Sera Unit A-4"
          signal="Weak Signal"
          onConnect={() => navigation.navigate('Dashboard')}
        />

        {/* Extend Vision */}
        <View style={styles.extendVision}>
          <View>
            <Text style={styles.extendTitle}>Extend Vision</Text>
            <Text style={styles.extendSubtitle}>
              Use phone camera as robot camera
            </Text>
          </View>
          <Switch
            trackColor={{
              false: theme.colors.toggleOff,
              true: theme.colors.toggleOn,
            }}
            thumbColor="#fff"
          />
        </View>

        {/* Setup New */}
        <TouchableOpacity style={styles.setupBtn}>
          <Text style={styles.setupText}>＋ Setup New Robot</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Cancel Setup Modal */}
      {showCancel && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Cancel Setup?</Text>
            <Text style={styles.modalText}>
              Your robot is not yet connected. Are you sure you want to stop the
              setup process?
            </Text>

            <TouchableOpacity
              style={styles.modalPrimary}
              onPress={() => setShowCancel(false)}
            >
              <Text style={styles.modalPrimaryText}>Continue Setup</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowCancel(false)}>
              <Text style={styles.modalDanger}>Exit Setup</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/* ---------------- Robot Card ---------------- */

function RobotCard({
  name,
  signal,
  active,
  onConnect,
}: {
  name: string;
  signal: string;
  active?: boolean;
  onConnect: () => void;
}) {
  return (
    <View
      style={[
        styles.robotCard,
        active && { borderColor: theme.colors.accent },
      ]}
    >
      <View style={styles.robotAvatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.robotName}>{name}</Text>
        <Text style={styles.robotSignal}>{signal}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.connectBtn,
          active && { backgroundColor: theme.colors.accent },
        ]}
        onPress={onConnect}
      >
        <Text
          style={[
            styles.connectText,
            active && { color: '#000' },
          ]}
        >
          Connect
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },

  header: {
    marginBottom: theme.spacing.md,
  },

  back: {
    color: theme.colors.textPrimary,
    fontSize: 22,
  },

  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  ring: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(214,190,138,0.35)',
  },

  faceOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },

  faceInner: {
    width: 90,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  eye: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
    ...theme.shadows.glow,
  },

  title: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },

  scanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },

  scanText: {
    color: theme.colors.accent,
    fontSize: 12,
    letterSpacing: 1,
  },

  section: {
    ...theme.typography.section,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },

  robotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  robotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceAlt,
    marginRight: theme.spacing.md,
  },

  robotName: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },

  robotSignal: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },

  connectBtn: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
  },

  connectText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },

  extendVision: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.card,
  },

  extendTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },

  extendSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },

  setupBtn: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  setupText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },

  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.card,
  },

  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },

  modalText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },

  modalPrimary: {
    width: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  modalPrimaryText: {
    color: '#000',
    fontWeight: '700',
  },

  modalDanger: {
    color: theme.colors.error,
    fontWeight: '600',
  },
});

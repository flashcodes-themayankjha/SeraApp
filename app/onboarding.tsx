import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/app/src/theme';

const Ring = ({ delay }: { delay: number }) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: ring.value * 2,
        },
      ],
    };
  });

  React.useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.out(Easing.ease),
        }),
        -1, // infinite repeat
        false
      )
    );
  }, [delay, ring]);

  return <Animated.View style={[styles.ring, ringStyle]} />;
};

export default function DiscoveryScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.faceContainer}>
          <Ring delay={0} />
          <Ring delay={750} />
          <Ring delay={1500} />
          <Ring delay={2250} />
          <View style={styles.staticFace}>
            <View style={styles.faceInner}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Hello! Let's find your Sera.</Text>
        <Text style={styles.subtitle}>
          Make sure your robot is turned on and nearby.
        </Text>

        <View style={styles.scanPill}>
          <View style={styles.dot} />
          <Text style={styles.scanText}>SCANNING FOR DEVICES…</Text>
        </View>
      </View>

      {/* Available Robots */}
      <Text style={styles.section}>Available Robots</Text>

      <RobotCard name="Sera Unit X-1" signal="Strong Signal" active />

      <RobotCard name="Sera Unit A-4" signal="Weak Signal" />

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

      {/* Footer CTA */}
      <TouchableOpacity style={styles.setupBtn}>
        <Text style={styles.setupText}>＋ Setup New Robot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- Components ---------------- */

function RobotCard({
  name,
  signal,
  active,
}: {
  name: string;
  signal: string;
  active?: boolean;
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
      >
        <Text style={[styles.connectText, active && { color: '#000' }]}>
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

  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },

  faceContainer: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },

  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.accent,
    ...theme.shadows.glow,
    shadowColor: theme.colors.accent,
  },

  staticFace: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  faceInner: {
    width: 110,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eye: {
    width: 22,
    height: 5,
    borderRadius: 2.5,
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
});

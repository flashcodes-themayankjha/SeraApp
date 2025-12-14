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
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';
import WifiSetupSheet from '../screens/WifiSetupSheet';

const HaloRing = ({
  delay,
  scale = 1.5,
  duration = 3000,
}: {
  delay: number;
  scale?: number;
  duration?: number;
}) => {
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(ring, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, ring, duration]);

  const ringStyle = {
    opacity: ring.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 0],
    }),
    transform: [
      {
        scale: ring.interpolate({
          inputRange: [0, 1],
          outputRange: [1, scale],
        }),
      },
    ],
  };

  return <Animated.View style={[styles.haloRing, ringStyle]} />;
};

const RobotFace = ({ isConnecting }: { isConnecting: boolean }) => {
  const blink = useRef(new Animated.Value(1)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(3000),
        Animated.timing(blink, {
          toValue: 0.05,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(100),
        Animated.timing(blink, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(5000),
      ])
    );
    blinkAnimation.start();

    const faceAnimation = Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 1000,
      delay: 2000, // Start after 2 seconds
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // borderColor animation not supported by native driver
    });

    faceAnimation.start();

    return () => {
      blinkAnimation.stop();
      faceAnimation.stop();
    };
  }, [blink, borderColorAnim]);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.accent],
  });

  return (
    <View style={styles.faceContainer}>
      {isConnecting ? (
        <>
          <HaloRing delay={0} duration={2000} scale={1.8} />
          <HaloRing delay={500} duration={2000} scale={1.8} />
          <HaloRing delay={1000} duration={2000} scale={1.8} />
          <HaloRing delay={1500} duration={2000} scale={1.8} />
        </>
      ) : (
        <>
          <HaloRing delay={0} />
          <HaloRing delay={1500} />
        </>
      )}
      <Animated.View style={[styles.faceRing, { borderColor }]}>
        <View style={styles.eyes}>
          <Animated.View
            style={[styles.eye, { transform: [{ scaleY: blink }] }]}
          />
          <Animated.View
            style={[styles.eye, { transform: [{ scaleY: blink }] }]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const AnimatedEllipsis = () => {
  const [ellipsis, setEllipsis] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setEllipsis(e => (e.length < 3 ? e + '.' : ''));
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return <Text>{ellipsis}</Text>;
};

export default function DiscoveryScreen() {
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [activeRobot, setActiveRobot] = useState<string>('Sera Unit X-1');
  const [isSetupBtnPressed, setIsSetupBtnPressed] = useState(false);
  const [isExtendVisionEnabled, setIsExtendVisionEnabled] = useState(false);
  const [isWifiSheetOpen, setIsWifiSheetOpen] = useState(false);
  const [showRobotFace, setShowRobotFace] = useState(true);

  const handleSetupPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsWifiSheetOpen(true);
    setShowRobotFace(false);
  };

  const handleSelectRobot = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveRobot(name);
  };

  const handleConnectPress = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConnectingTo(name);
    // In a real app, you'd initiate connection logic here.
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {showRobotFace && <RobotFace isConnecting={connectingTo !== null} />}
          <Text style={styles.title}>Hello! Let&#39;s find your Sera.</Text>
          <Text style={styles.subtitle}>
            Make sure your robot is turned on and nearby.
          </Text>

          <View style={styles.scanPill}>
            <View style={styles.dot} />
            <View>
              <Text style={[styles.scanText, { opacity: 0 }]}>
                {connectingTo
                  ? `Connecting to ${connectingTo}...`
                  : 'SCANNING FOR DEVICES...'}
              </Text>
              <Text style={[styles.scanText, { position: 'absolute' }]}>
                {connectingTo
                  ? `Connecting to ${connectingTo}`
                  : 'SCANNING FOR DEVICES'}
                <AnimatedEllipsis />
              </Text>
            </View>
          </View>
        </View>

        {/* Available Robots */}
        <Text style={styles.section}>Available Robots</Text>

        <RobotCard
          name="Sera Unit X-1"
          signal="Strong Signal"
          active={activeRobot === 'Sera Unit X-1'}
          disabled={connectingTo !== null}
          onSelect={() => handleSelectRobot('Sera Unit X-1')}
          onConnect={() => handleConnectPress('Sera Unit X-1')}
        />

        <RobotCard
          name="Sera Unit A-4"
          signal="Weak Signal"
          active={activeRobot === 'Sera Unit A-4'}
          disabled={connectingTo !== null}
          onSelect={() => handleSelectRobot('Sera Unit A-4')}
          onConnect={() => handleConnectPress('Sera Unit A-4')}
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
            value={isExtendVisionEnabled}
            onValueChange={setIsExtendVisionEnabled}
          />
        </View>

        {/* Footer CTA */}
        <TouchableOpacity
          style={[
            styles.setupBtn,
            isSetupBtnPressed && { backgroundColor: theme.colors.accent },
          ]}
          onPress={handleSetupPress}
          onPressIn={() => setIsSetupBtnPressed(true)}
          onPressOut={() => setIsSetupBtnPressed(false)}
          activeOpacity={1}
        >
          <Text
            style={[
              styles.setupText,
              isSetupBtnPressed && { color: '#000' },
            ]}
          >
            ＋ Setup New Robot
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <WifiSetupSheet
        visible={isWifiSheetOpen}
        onClose={() => {
          setIsWifiSheetOpen(false);
          setShowRobotFace(true);
        }}
      />
    </View>
  );
}

/* ---------------- Components ---------------- */

function RobotCard({
  name,
  signal,
  active,
  onSelect,
  onConnect,
  disabled,
}: {
  name: string;
  signal: string;
  active?: boolean;
  onSelect: () => void;
  onConnect: () => void;
  disabled?: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const isHighlighted = active || isPressed;

  return (
    <View
      style={[
        styles.robotCard,
        isHighlighted && { borderColor: theme.colors.accent },
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        onPress={onSelect}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled}
        activeOpacity={1}
      >
        <View style={styles.robotAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.robotName}>{name}</Text>
          <Text style={styles.robotSignal}>{signal}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.connectBtn,
          isHighlighted && { backgroundColor: theme.colors.accent },
        ]}
        onPress={onConnect}
        disabled={!active || disabled}
      >
        <Text style={[styles.connectText, isHighlighted && { color: '#000' }]}>
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
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },

  haloRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },

  faceRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyes: {
    width: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  eye: {
    width: 36,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.accent,
    ...theme.shadows.glow,
  },


  title: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
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
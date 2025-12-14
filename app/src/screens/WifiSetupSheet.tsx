import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Easing,
  TextInput, // Added TextInput
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';

const touchIcon = require('../../../assets/touch.png');

const SCREEN_HEIGHT = Dimensions.get('window').height;

/* =================================================
   STEP DEFINITIONS
================================================= */

type WifiStep = 'scan' | 'connect-robot' | 'configure-wifi' | 'success';

const STEPS: WifiStep[] = ['scan', 'connect-robot', 'configure-wifi', 'success'];

/* =================================================
   MAIN SHEET
================================================= */

export default function WifiSetupSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [step, setStep] = useState<WifiStep>('scan');

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      damping: 20,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const stepIndex = STEPS.indexOf(step) + 1;

  const goNext = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };

  const goBack = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  return (
    <Animated.View
      style={[styles.sheet, { transform: [{ translateY }] }]}
    >
      <Header
        step={stepIndex}
        onBack={step !== 'scan' ? goBack : undefined}
        onClose={onClose}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {step === 'scan' && <StepScan onNext={goNext} />}
        {step === 'connect-robot' && <StepConnectRobot onNext={goNext} />}
        {step === 'configure-wifi' && <StepConfigureWifi onNext={goNext} />}
        {step === 'success' && <StepSuccess onFinish={onClose} />}
      </ScrollView>
    </Animated.View>
  );
}

/* =================================================
   HEADER
================================================= */

function Header({
  step,
  onBack,
  onClose,
}: {
  step: number;
  onBack?: () => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} disabled={!onBack}>
        <Text style={[styles.headerLeft, !onBack && { opacity: 0 }]}>←</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Wi-Fi Setup</Text>

      <TouchableOpacity onPress={onClose}>
        <Text style={styles.headerRight}>✕</Text>
      </TouchableOpacity>

      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map(i => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i <= step && styles.progressActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

/* =================================================
   STEP 1 — SCAN
================================================= */

function StepScan({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.step}>STEP 1 OF 4</Text>

      <Illustration animated />

      <Text style={styles.title}>Press Setup Button</Text>
      <Text style={styles.subtitle}>
        Hold the setup button for 3 seconds until the LED blinks{' '}
        <Text style={{ color: theme.colors.accent }}>blue</Text>.
      </Text>

     <ScanningStatusCard />
      <PrimaryButton label="Continue" onPress={onNext} />
    </View>
  );
}

/* =================================================
   STEP 2 — CONNECT ROBOT
================================================= */

function StepConnectRobot({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.step}>STEP 2 OF 4</Text>

      <Illustration
        animated
        iconName="wifi"
        haloConfig={{
          ringColor: theme.colors.accent,
          ringSize: 80,
          ringScaleFactor: 1.8,
          ringDuration: 1500,
        }}
      />

      <Text style={styles.title}>Connect to Robot</Text>
      <Text style={styles.subtitle}>
        Connect to Wi-Fi network{' '}
        <Text style={{ color: theme.colors.accent }}>“Sera-Robot-XX”</Text>
      </Text>

      <PrimaryButton label="Open Wi-Fi Settings" />
      <GhostButton label="Already Connected" onPress={onNext} />
    </View>
  );
}

/* =================================================
   STEP 3 — CONFIGURE WIFI
================================================= */

function StepConfigureWifi({ onNext }: { onNext: () => void }) {
  const [ssid, setSsid] = useState('');
  const [hasError, setHasError] = useState(false);

  const availableNetworks = ['Home_Wifi_5G', 'Sera_Guest', 'Office_Net']; // Defined available networks

  const handleContinue = () => {
    if (!ssid) {
      setHasError(true);
      return;
    }
    if (availableNetworks.includes(ssid)) { // Check if SSID is already in the list
      setHasError(true); // Set error if it's in the list
      return;
    }
    setHasError(false);
    onNext();
  };

  return (
    <View>
      <Text style={styles.step}>STEP 3 OF 4</Text>

      <Text style={styles.title}>Wi-Fi Setup</Text>
      <Text style={styles.subtitle}>
        Choose a network for your Sera robot to connect to.
      </Text>

      {/* SSID INPUT */}
      <View
        style={[
          styles.inputField,
          hasError && styles.inputError,
        ]}
      >
        <MaterialIcons
          name="wifi"
          size={20}
          color={hasError ? '#ff6b6b' : theme.colors.textMuted}
        />
        <TextInput
          style={styles.inputPlaceholder}
          placeholder="Enter SSID"
          placeholderTextColor={theme.colors.textMuted}
          value={ssid}
          onChangeText={setSsid}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {hasError && (
          <MaterialIcons
            name="error-outline"
            size={20}
            color="#ff6b6b"
          />
        )}
      </View>

      {/* ERROR CARD */}
      {hasError && (
        <View style={styles.errorCard}>
          <MaterialIcons
            name="info"
            size={18}
            color="#ff6b6b"
            style={{ marginTop: 2 }} // Added top padding
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.errorTitle}>
              Selection Required
            </Text>
            <Text style={styles.errorText}>
              Please select a network from the list below or enter
              a valid network name manually.
            </Text>
          </View>
        </View>
      )}

      {/* AVAILABLE NETWORKS */}
      <View style={styles.networkHeader}>
        <Text style={styles.networkHeaderText}>
          AVAILABLE NETWORKS
        </Text>
        <TouchableOpacity>
          <Text style={styles.scanAgain}>⟳ Scan Again</Text>
        </TouchableOpacity>
      </View>

      <NetworkItem
        name="Home_Wifi_5G"
        signal="Strong Signal"
        onPress={() => {
          setSsid('Home_Wifi_5G');
          setHasError(false);
        }}
      />
      <NetworkItem
        name="Sera_Guest"
        signal="Moderate Signal"
        onPress={() => {
          setSsid('Sera_Guest');
          setHasError(false);
        }}
      />
      <NetworkItem
        name="Office_Net"
        signal="Weak Signal"
        onPress={() => {
          setSsid('Office_Net');
          setHasError(false);
        }}
      />

      <PrimaryButton label="Continue" onPress={handleContinue} />
    </View>
  );
}

/* =================================================
   STEP 4 — SUCCESS
================================================= */

function StepSuccess({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.step}>STEP 4 OF 4</Text>

      <Illustration />

      <Text style={styles.title}>Connection Successful</Text>
      <Text style={styles.subtitle}>
        Your Sera is now connected and ready.
      </Text>

      <PrimaryButton label="Finish Setup" onPress={onFinish} />
      <GhostButton label="View Connection Logs" />
    </View>
  );
}

/* =================================================
   SHARED COMPONENTS
================================================= */

type HaloConfig = {
  ringColor?: string;
  ringSize?: number;
  ringScaleFactor?: number;
  ringDuration?: number;
};

function Illustration({ animated, iconName, haloConfig }: { animated?: boolean; iconName?: string; haloConfig?: HaloConfig }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -6,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animated]);

  return (
    <View style={styles.illustration}>
      <View style={styles.iconWrapper}>
        {animated && (
          <>
            <PulsingHalo delay={0} {...haloConfig} />
            <PulsingHalo delay={700} {...haloConfig} />
            <PulsingHalo delay={1400} {...haloConfig} />
          </>
        )}

        {iconName ? (
          <Animated.View
            style={animated && { transform: [{ translateY: bounce }, { scale: iconPulse }] }}
          >
            <MaterialIcons
              name={iconName}
              size={48}
              color={theme.colors.accent}
            />
          </Animated.View>
        ) : (
          <Animated.Image
            source={touchIcon}
            style={[
              styles.touchIcon,
              animated && { transform: [{ translateY: bounce }, { scale: iconPulse }] },
            ]}
          />
        )}
      </View>
    </View>
  );
}

function PulsingHalo({
  delay,
  ringColor = theme.colors.accent,
  ringSize = 56,
  ringScaleFactor = 1.6,
  ringDuration = 2000,
}: {
  delay: number;
  ringColor?: string;
  ringSize?: number;
  ringScaleFactor?: number;
  ringDuration?: number;
}) {
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(ring, {
          toValue: 1,
          duration: ringDuration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [delay, ring, ringDuration]);

  return (
    <Animated.View
      style={[
        styles.haloRing,
        {
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderColor: ringColor,
          opacity: ring.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
          }),
          transform: [
            {
              scale: ring.interpolate({
                inputRange: [0, 1],
                outputRange: [1, ringScaleFactor],
              }),
            },
          ],
        },
      ]}
    />
  );
}

function ScanningStatusCard() {
  const rotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const dotBlink = useRef(new Animated.Value(1)).current;
  const [dots, setDots] = useState('.');

  /* Icon rotation + pulse */
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.08,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* Golden dot blink */
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotBlink, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotBlink, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* Scanning dots */
    const interval = setInterval(() => {
      setDots(prev =>
        prev === '.' ? '..' : prev === '..' ? '...' : '.'
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.scanCard}>
      <View style={styles.scanLeft}>
        <Animated.View
          style={[
            styles.scanIcon,
            {
              transform: [{ scale: pulse }, { rotate: rotation }],
            },
          ]}
        >
          <MaterialIcons
            name="radar"
            size={24}
            color={theme.colors.accent}
          />
        </Animated.View>

        <View>
          <Text style={styles.scanTitle}>
            Scanning{dots}
          </Text>
          <Text style={styles.scanSubtitle}>
            Waiting for setup button signal
          </Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.scanDot,
          { opacity: dotBlink },
        ]}
      />
    </View>
  );
}



function NetworkItem({
  name,
  signal,
  onPress,
}: {
  name: string;
  signal: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.networkItem}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <MaterialIcons
        name="wifi"
        size={22}
        color={theme.colors.textMuted}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.networkName}>{name}</Text>
        <Text style={styles.networkSignal}>{signal}</Text>
      </View>

      <MaterialIcons
        name="lock"
        size={18}
        color={theme.colors.textMuted}
      />
    </TouchableOpacity>
  );
}

function PrimaryButton({ label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.primaryBtn} onPress={onPress}>
      <Text style={styles.primaryText}>{label}</Text>
    </TouchableOpacity>
  );
}

function GhostButton({ label, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.ghost}>{label}</Text>
    </TouchableOpacity>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    height: '92%',
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.xl,
  },

  header: {
    marginBottom: theme.spacing.lg,
  },

  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },

  headerLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: 22,
    color: theme.colors.textPrimary,
  },

  headerRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 22,
    color: theme.colors.textPrimary,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },

  progressDot: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },

  progressActive: {
    backgroundColor: theme.colors.accent,
  },

  center: {
    alignItems: 'center',
    paddingTop: 24,
  },

  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 0,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  iconWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  touchIcon: {
    width: 48,
    height: 48,
    tintColor: theme.colors.accent,
  },

  haloRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },

  step: {
    color: theme.colors.textMuted,
    marginBottom: 12,
    letterSpacing: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },

scanCard: {
  width: '100%',
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  padding: theme.spacing.lg,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 32,
  ...theme.shadows.card,
},

scanLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 14,
},

scanIcon: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: theme.colors.surfaceAlt,
  alignItems: 'center',
  justifyContent: 'center',
},





scanTitle: {
  color: theme.colors.textPrimary,
  fontWeight: '600',
  fontSize: 15,
},

scanSubtitle: {
  color: theme.colors.textMuted,
  fontSize: 12,
  marginTop: 2,
},

scanDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.colors.accent,
},

  statusCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: 32,
  },

  statusTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },

  statusSub: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },

  primaryBtn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    width: '100%',
    alignItems: 'center',
  },

  primaryText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },

  ghost: {
    marginTop: 20,
    color: theme.colors.accent,
    fontWeight: '600',
    textAlign: 'center',
  },

  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },

  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },

  inputError: {
    borderColor: '#ff6b6b',
  },

  inputPlaceholder: {
    flex: 1,
    color: theme.colors.textPrimary,
  },

  errorCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },

  errorTitle: {
    color: '#ff6b6b',
    fontWeight: '600',
    marginBottom: 4,
  },

  errorText: {
    color: '#ffb3b3',
    fontSize: 12,
  },

  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  networkHeaderText: {
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    fontSize: 12,
  },

  scanAgain: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

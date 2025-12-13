import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/* =================================================
   STEP DEFINITIONS
================================================= */

type WifiStep =
  | 'scan'
  | 'connect-robot'
  | 'configure-wifi'
  | 'success';

const STEP_ORDER: WifiStep[] = [
  'scan',
  'connect-robot',
  'configure-wifi',
  'success',
];

const STEP_INDEX = (step: WifiStep) =>
  STEP_ORDER.indexOf(step) + 1;

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

  const goNext = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[idx + 1]);
    }
  };

  const goBack = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) {
      setStep(STEP_ORDER[idx - 1]);
    }
  };

  return (
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY }] },
      ]}
    >
      {/* HEADER */}
      <Header
        step={STEP_INDEX(step)}
        onBack={step !== 'scan' ? goBack : undefined}
        onClose={onClose}
      />

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {step === 'scan' && <StepScan onNext={goNext} />}
        {step === 'connect-robot' && (
          <StepConnectRobot onNext={goNext} />
        )}
        {step === 'configure-wifi' && (
          <StepConfigureWifi onNext={goNext} />
        )}
        {step === 'success' && (
          <StepSuccess onFinish={onClose} />
        )}
      </ScrollView>
    </Animated.View>
  );
}

/* =================================================
   HEADER + STEP BAR
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
        <Text style={[styles.headerIcon, !onBack && { opacity: 0 }]}>
          ←
        </Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Wi-Fi Setup</Text>

      <TouchableOpacity onPress={onClose}>
        <Text style={styles.headerIcon}>✕</Text>
      </TouchableOpacity>

      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map((i) => (
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
   STEP 1 — SCAN / SETUP MODE
================================================= */

function StepScan({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.step}>STEP 1 OF 4</Text>

      <Illustration label="Press Button" />

      <Text style={styles.title}>Press Setup Button</Text>
      <Text style={styles.subtitle}>
        Hold the setup button on your robot for 3 seconds until
        the LED blinks{' '}
        <Text style={{ color: theme.colors.accent }}>blue</Text>.
      </Text>

      <StatusCard
        title="Scanning…"
        subtitle="Waiting for setup button signal"
      />

      <PrimaryButton label="Continue" onPress={onNext} />
    </View>
  );
}

/* =================================================
   STEP 2 — CONNECT TO ROBOT
================================================= */

function StepConnectRobot({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.step}>STEP 2 OF 4</Text>

      <Illustration label="Wi-Fi" />

      <Text style={styles.title}>Connect to Robot</Text>
      <Text style={styles.subtitle}>
        Open Wi-Fi settings and connect to{' '}
        <Text style={{ color: theme.colors.accent }}>
          “Sera-Robot-XX”
        </Text>
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
  return (
    <View>
      <Text style={styles.step}>STEP 3 OF 4</Text>

      <Text style={styles.title}>Select Network</Text>
      <Text style={styles.subtitle}>
        Choose your home Wi-Fi network to connect Sera.
      </Text>

      <NetworkItem name="Home_Wifi_5G" signal="Strong Signal" />
      <NetworkItem name="Sera_Guest" signal="Moderate Signal" />
      <NetworkItem name="Office_Net" signal="Weak Signal" />

      <PrimaryButton label="Connect" onPress={onNext} />
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

      <Illustration label="✓" />

      <Text style={styles.title}>Connection Successful</Text>
      <Text style={styles.subtitle}>
        Your Sera is now connected and ready for calibration.
      </Text>

      <PrimaryButton label="Finish Setup" onPress={onFinish} />
      <GhostButton label="View Connection Logs" />
    </View>
  );
}

/* =================================================
   SHARED UI COMPONENTS
================================================= */

function Illustration({ label }: { label: string }) {
  return (
    <View style={styles.illustration}>
      <Text style={{ color: theme.colors.accent }}>{label}</Text>
    </View>
  );
}

function StatusCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={styles.statusSub}>{subtitle}</Text>
    </View>
  );
}

function NetworkItem({
  name,
  signal,
}: {
  name: string;
  signal: string;
}) {
  return (
    <View style={styles.networkItem}>
      <Text style={styles.networkName}>{name}</Text>
      <Text style={styles.networkSignal}>{signal}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.primaryBtn} onPress={onPress}>
      <Text style={styles.primaryText}>{label}</Text>
    </TouchableOpacity>
  );
}

function GhostButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.ghost}>{label}</Text>
    </TouchableOpacity>
  );
}

/* =================================================
   STYLES (MATCH SERA UI)
================================================= */

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    height: '95%',
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.xl,
    flexDirection: 'column',
  },

  header: {
    marginBottom: theme.spacing.lg,
  },

  headerTitle: {
    textAlign: 'center',
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },

  headerIcon: {
    position: 'absolute',
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
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },

  progressActive: {
    backgroundColor: theme.colors.accent,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
  },

  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  step: {
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },

  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
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
    marginTop: 12,
  },

  primaryText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },

  ghost: {
    color: theme.colors.accent,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  networkItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  networkName: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },

  networkSignal: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});

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

/* -------------------------------------------------
   TYPES
------------------------------------------------- */

type WifiStep =
  | 'setup-mode'
  | 'connect-ap'
  | 'select-network'
  | 'connecting'
  | 'success';

/* -------------------------------------------------
   MAIN SHEET
------------------------------------------------- */

export default function WifiSetupSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [step, setStep] = useState<WifiStep>('setup-mode');

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      damping: 18,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY }] },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {step === 'setup-mode' && (
          <StepSetupMode onNext={() => setStep('connect-ap')} />
        )}

        {step === 'connect-ap' && (
          <StepConnectAP onNext={() => setStep('select-network')} />
        )}

        {step === 'select-network' && (
          <StepSelectNetwork onNext={() => setStep('connecting')} />
        )}

        {step === 'connecting' && (
          <StepConnecting onSuccess={() => setStep('success')} />
        )}

        {step === 'success' && (
          <StepSuccess onFinish={onClose} />
        )}
      </ScrollView>
    </Animated.View>
  );
}

/* -------------------------------------------------
   STEP 1 – SETUP MODE
------------------------------------------------- */

function StepSetupMode({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.center}>
      <StepHeader step="STEP 1 OF 4" />

      <Text style={styles.title}>Press Setup Button</Text>
      <Text style={styles.subtitle}>
        Hold the setup button on your robot for 3 seconds until the LED blinks{' '}
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

/* -------------------------------------------------
   STEP 2 – CONNECT TO ROBOT AP
------------------------------------------------- */

function StepConnectAP({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.center}>
      <StepHeader step="STEP 2 OF 4" />

      <Text style={styles.title}>Connect to Robot</Text>
      <Text style={styles.subtitle}>
        Go to your device Wi-Fi settings and connect to the network starting
        with{' '}
        <Text style={{ color: theme.colors.accent }}>
          “Sera-Robot-”
        </Text>
      </Text>

      <PrimaryButton label="Open Wi-Fi Settings" />
      <GhostButton label="Already Connected" onPress={onNext} />
    </View>
  );
}

/* -------------------------------------------------
   STEP 3 – SELECT NETWORK
------------------------------------------------- */

function StepSelectNetwork({ onNext }: { onNext: () => void }) {
  return (
    <View>
      <StepHeader step="STEP 3 OF 4" />

      <Text style={styles.title}>Select Your Network</Text>
      <Text style={styles.subtitle}>
        Please select your home Wi-Fi network and enter the password.
      </Text>

      {/* NETWORK LIST (STATIC MOCK FOR NOW) */}
      <NetworkItem name="Home_Wifi_5G" signal="Strong Signal" />
      <NetworkItem name="Sera_Guest" signal="Moderate Signal" />
      <NetworkItem name="Office_Net" signal="Weak Signal" />

      <PrimaryButton label="Connect" onPress={onNext} />
    </View>
  );
}

/* -------------------------------------------------
   STEP 4 – CONNECTING
------------------------------------------------- */

function StepConnecting({ onSuccess }: { onSuccess: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onSuccess, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.center}>
      <StepHeader step="STEP 4 OF 4" />

      <Text style={styles.title}>Connecting…</Text>
      <Text style={styles.subtitle}>
        Sending credentials to Sera. This may take a few seconds.
      </Text>

      <StatusCard
        title="Processing"
        subtitle="Establishing secure connection"
      />
    </View>
  );
}

/* -------------------------------------------------
   STEP 5 – SUCCESS
------------------------------------------------- */

function StepSuccess({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={styles.center}>
      <StepHeader step="STEP 4 OF 4" />

      <Text style={styles.title}>Connection Successful</Text>
      <Text style={styles.subtitle}>
        Your Sera Unit is now connected and ready for calibration.
      </Text>

      <PrimaryButton label="Finish Setup" onPress={onFinish} />
      <GhostButton label="View Connection Logs" />
    </View>
  );
}

/* -------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------- */

function StepHeader({ step }: { step: string }) {
  return <Text style={styles.step}>{step}</Text>;
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
      <View>
        <Text style={styles.networkName}>{name}</Text>
        <Text style={styles.networkSignal}>{signal}</Text>
      </View>
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

/* -------------------------------------------------
   STYLES
------------------------------------------------- */

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

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
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
    paddingHorizontal: 12,
  },

  statusCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: 40,
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

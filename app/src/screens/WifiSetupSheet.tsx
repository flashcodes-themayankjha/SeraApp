import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Easing,
  TextInput, // Added TextInput
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import SlideSheet from '../../../components/SlideSheet';


const successAnimation = require('../assets/lottie/success.json');
const pressAnimation = require('../assets/lottie/press.json');
const wifiAnimation = require('../assets/lottie/wifi.json');



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
  
  const [step, setStep] = useState<WifiStep>('scan');

  

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
    <SlideSheet visible={visible} onClose={onClose}>
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
    </SlideSheet>
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

      <LottieView source={pressAnimation} autoPlay loop style={styles.lottieAnimation} />

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

      <LottieView source={wifiAnimation} autoPlay loop={false}
       colorFilters={[
       {
         keypath: '**',
         color: '#D6BE8A', // Accent color
       },]} style={styles.lottieAnimation} />

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
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const [isConnecting, setIsConnecting] = useState(false);

  const availableNetworks = ['Home_Wifi_5G', 'Sera_Guest', 'Office_Net'];

  const isValid = ssid.trim().length > 0;

  const handleContinue = () => {
    if (isConnecting) {
      return;
    }

    if (!ssid) {
      setHasError(true);
      setErrorMessage('Please select a network or enter an SSID.');
      return;
    }
    if (!availableNetworks.includes(ssid)) {
      setHasError(true);
      setErrorMessage('Invalid SSID. Please select from available networks or enter a valid one.');
      return;
    }

    setHasError(false);
    setErrorMessage(''); // Clear error message on success
    setIsConnecting(true);

    // Simulated connection delay
    setTimeout(() => {
      setIsConnecting(false);
      onNext();
    }, 2200);
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
          onChangeText={text => {
            setSsid(text);
            setHasError(false);
          }}
          editable={!isConnecting}
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
      {hasError && !isConnecting && (
        <View style={styles.errorCard}>
          <MaterialIcons
            name="info"
            size={18}
            color="#ff6b6b"
            style={{ marginTop: 3 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.errorTitle}>
              Error
            </Text>
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        </View>
      )}

      {/* AVAILABLE NETWORKS */}
      <View style={styles.networkHeader}>
        <Text style={styles.networkHeaderText}>
          AVAILABLE NETWORKS
        </Text>
        <TouchableOpacity disabled={isConnecting}>
          <Text style={styles.scanAgain}>⟳ Scan Again</Text>
        </TouchableOpacity>
      </View>

      <NetworkItem
        name="Home_Wifi_5G"
        signal="Strong Signal"
        onPress={() => {
          if (!isConnecting) {
            setSsid('Home_Wifi_5G');
            setHasError(false);
          }
        }}
      />
      <NetworkItem
        name="Sera_Guest"
        signal="Moderate Signal"
        onPress={() => {
          if (!isConnecting) {
            setSsid('Sera_Guest');
            setHasError(false);
          }
        }}
      />
      <NetworkItem
        name="Office_Net"
        signal="Weak Signal"
        onPress={() => {
          if (!isConnecting) {
            setSsid('Office_Net');
            setHasError(false);
          }
        }}
      />

      <PrimaryButton
        label={isConnecting ? 'Connecting…' : 'Continue'}
        loading={isConnecting}
        disabled={!isValid || isConnecting}
        onPress={handleContinue}
      />
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

      <LottieView source={successAnimation} autoPlay loop={false} 
       colorFilters={[
       {
         keypath: '**',
         color: '#D6BE8A',
       },]} style={styles.lottieAnimation} />

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


function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [dots, setDots] = useState(''); // New state for animating dots
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      let dotCount = 0;
      const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        setDots('.'.repeat(dotCount));
      }, 300);
      return () => clearInterval(interval);
    } else {
      setDots('');
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) return;

    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [loading]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.primaryBtn,
        disabled && !loading && styles.primaryBtnDisabled,
        loading && styles.primaryBtnLoading,
      ]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {loading ? (
        <View style={styles.primaryBtnContent}>
          {/* Phantom text for width calculation */}
          <Text style={[styles.primaryText, styles.primaryTextPhantom]}>
            Connecting...
          </Text>
          {/* Visible text: "Connecting" (static) and dots (animating) */}
          <View style={styles.loadingTextContainer}>
            <Text style={styles.primaryText}>Connecting</Text>
            <Text style={styles.primaryText}>{dots}</Text>
          </View>
        </View>
      ) : (
        <Text
          style={[
            styles.primaryText,
            disabled && styles.primaryTextDisabled,
          ]}
        >
          {label}
        </Text>
      )}
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

  
  lottieAnimation: {
    width: 150, // Adjust size as needed
    height: 150, // Adjust size as needed
    marginBottom: 24,
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

primaryBtnDisabled: {
  backgroundColor: theme.colors.surfaceAlt,
  opacity: 0.55,
},

primaryTextDisabled: {
  color: theme.colors.textMuted,
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

networkName: {
  color: theme.colors.textPrimary, // WHITE
  fontWeight: '600',
  fontSize: 13,
},

networkSignal: {
  color: theme.colors.textMuted, // GREY
  fontSize: 12,
  marginTop: 2,
},

networkItemActive: {
  borderColor: theme.colors.accent,
  borderWidth: 1,
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

  passwordLabel: {
    color: theme.colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '600',
  },

  securityNote: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: 16,
    marginBottom: 24, // Added bottom padding
    borderWidth: 1,
    borderColor: 'rgba(218, 196, 140, 0.35)',
  },

  securityText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  primaryBtnLoading: {
    // Removed border styles as per user request
  },
  primaryBtnContent: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTextPhantom: {
    opacity: 0,
  },
  loadingTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

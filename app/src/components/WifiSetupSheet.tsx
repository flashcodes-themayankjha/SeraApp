import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../theme';

const WifiSetupSheet = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [visible, setVisible] = useState(isOpen);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [isOpen, slideAnim]);

  const sheetStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0], // Animate from bottom
        }),
      },
    ],
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.backdrop}>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <Text style={styles.title}>Wi-Fi Setup</Text>
        <Text style={styles.subtitle}>
          Connect your Sera to a Wi-Fi network.
        </Text>
        {/* Add Wi-Fi setup form here */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.xl,
    height: '85%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  closeButton: {
    marginTop: 'auto',
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default WifiSetupSheet;

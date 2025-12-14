import { StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { theme } from '../app/src/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomSheet({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 18,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '92%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.xl,
  },
});

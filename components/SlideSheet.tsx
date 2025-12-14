import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import { useEffect, useRef } from 'react';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/* =================================================
   SNAP POINTS
================================================= */

const SNAP = {
  CLOSED: SCREEN_HEIGHT,
  MID: SCREEN_HEIGHT * 0.20, // Changed to 20% from the top (80% of screen height)
  EXPANDED: SCREEN_HEIGHT * 0.08,
};

/* =================================================
   SLIDE SHEET
================================================= */

export default function SlideSheet({
  visible,
  onClose,
  children,
  enableBackdrop = true,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  enableBackdrop?: boolean;
}) {
  const translateY = useRef(
    new Animated.Value(SNAP.CLOSED)
  ).current;

  const backdropOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const lastOffset = useRef(SNAP.CLOSED);

  /* =================================================
     OPEN / CLOSE
  ================================================= */

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SNAP.MID,
          damping: 22,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.45,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        lastOffset.current = SNAP.MID;
      });
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SNAP.CLOSED,
          damping: 22,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        lastOffset.current = SNAP.CLOSED;
      });
    }
  }, [visible, translateY, backdropOpacity]);

  /* =================================================
     PAN / DRAG
  ================================================= */

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        let nextY = lastOffset.current + gesture.dy;

        if (nextY < SNAP.EXPANDED) {
          nextY = SNAP.EXPANDED;
        }

        translateY.setValue(nextY);
      },

      onPanResponderRelease: (_, gesture) => {
        const finalY = lastOffset.current + gesture.dy;

        let snapTo = SNAP.MID;

        if (finalY > SCREEN_HEIGHT * 0.7) {
          snapTo = SNAP.CLOSED;
        } else if (finalY < SCREEN_HEIGHT * 0.25) {
          snapTo = SNAP.EXPANDED;
        }

        Animated.spring(translateY, {
          toValue: snapTo,
          damping: 24,
          useNativeDriver: true,
        }).start(() => {
          lastOffset.current = snapTo;
          if (snapTo === SNAP.CLOSED) onClose();
        });
      },
    })
  ).current;

  if (!visible) return null;

  /* =================================================
     RENDER
  ================================================= */

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* BACKDROP */}
      {enableBackdrop && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        {/* DRAG HANDLE */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#0E0E0E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  handleContainer: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

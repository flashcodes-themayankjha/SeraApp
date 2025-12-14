import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

type Props = {
  icon: any;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export default function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress && onPress();
      }}
      style={styles.wrapper}
    >
      <View style={styles.iconBox}>
        <MaterialIcons
          name={icon}
          size={22}
          color={theme.colors.accent}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 130,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 14,
    justifyContent: 'space-between',

    // subtle depth
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});

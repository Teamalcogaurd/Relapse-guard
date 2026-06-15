import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii } from '@/constants/theme';

export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: '#F5ECE7',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginRight: 8,
    marginBottom: 8,
  },
  active: {
    backgroundColor: colors.lavender,
    borderColor: '#C9B7F0',
  },
  text: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '800',
  },
  activeText: {
    color: colors.lavenderStrong,
  },
});
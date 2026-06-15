import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/theme';
import { GlassCard } from './GlassCard';

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: '47%' },
  value: { color: colors.text, fontSize: 21, fontWeight: '800' },
  label: { color: colors.textMuted, fontSize: 13, marginTop: 6 }
});

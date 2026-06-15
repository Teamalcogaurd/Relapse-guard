import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { StatCard } from '@/components/StatCard';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function StreakScreen() {
  const { streak, longestStreak } = useApp();
  return (
    <Screen>
      <Text style={styles.title}>Recovery streak</Text>
      <Text style={styles.subtitle}>Protect today. Let the longer streak build quietly.</Text>
      <View style={styles.wrap}>
        <StatCard label="Current streak" value={`${streak} days`} />
        <StatCard label="Longest streak" value={`${longestStreak} days`} />
      </View>
      <GlassCard>
        <Text style={styles.head}>Weekly consistency</Text>
        <View style={styles.calendarRow}>{['M','T','W','T','F','S','S'].map((d, i) => <View key={d + i} style={[styles.day, i < 4 && styles.active]}><Text style={styles.dayText}>{d}</Text></View>)}</View>
        <Text style={styles.note}>Milestone progression: next goal is 7 days. You are closer than it feels.</Text>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 12 },
  subtitle: { color: colors.textMuted, marginTop: 8, fontSize: 15 },
  wrap: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 18 },
  head: { color: colors.text, fontWeight: '700', fontSize: 16 },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  day: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: 'rgba(82,214,154,0.2)', borderWidth: 1, borderColor: colors.success },
  dayText: { color: colors.text },
  note: { color: colors.textMuted, marginTop: 16, lineHeight: 20 }
});

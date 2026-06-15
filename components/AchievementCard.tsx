import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { GlassCard } from './GlassCard';

export function AchievementCard({ title, description, unlocked, date }: { title: string; description: string; unlocked: boolean; date?: string }) {
  return (
    <GlassCard style={[styles.card, !unlocked && styles.locked]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, !unlocked && styles.lockedIcon]}>
          <Ionicons name={unlocked ? 'sparkles' : 'lock-closed'} size={18} color={unlocked ? colors.success : colors.textMuted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <Text style={styles.date}>{unlocked ? `Unlocked ${date}` : 'Locked milestone'}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  locked: { opacity: 0.75 },
  row: { flexDirection: 'row', gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(82, 214, 154, 0.12)'
  },
  lockedIcon: { backgroundColor: 'rgba(255,255,255,0.06)' },
  title: { color: colors.text, fontWeight: '700', fontSize: 15 },
  description: { color: colors.textMuted, marginTop: 4, lineHeight: 18, fontSize: 13 },
  date: { color: colors.textMuted, marginTop: 12, fontSize: 12 }
});

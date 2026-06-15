import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ProfileScreen() {
  const app = useApp();

  const user = app?.user ?? null;
  const latestMoodLog = app?.latestMoodLog ?? null;
  const journals = app?.journals ?? [];

  const displayName = useMemo(
    () =>
      user?.name || user?.fullName || user?.username || 'SoberShield User',
    [user]
  );
  const journalCount = journals.length;
  const moodCount = latestMoodLog ? 1 : 0;
  const statusLabel = app?.isLoggedIn ? 'Member' : 'Guest';
  const recoveryLevel = Math.max(1, Math.ceil((journalCount + moodCount) / 2));
  const consistencyScore = Math.min(96, 24 + (journalCount + moodCount) * 8);

  const overviewItems: Array<{
    id: string;
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }> = [
    {
      id: 'level',
      label: 'Recovery level',
      value: `Lvl ${recoveryLevel}`,
      icon: 'bar-chart-outline',
      color: colors.lavenderStrong,
    },
    {
      id: 'journals',
      label: 'Journals',
      value: String(journalCount),
      icon: 'book-outline',
      color: colors.blueStrong,
    },
    {
      id: 'mood',
      label: 'Mood checks',
      value: String(moodCount),
      icon: 'happy-outline',
      color: colors.sageStrong,
    },
  ];

  return (
    <Screen>
      <Text style={styles.eyebrow}>Account</Text>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        Your recovery profile and progress.
      </Text>

      <GlassCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.nameText}>{displayName}</Text>
            <Text style={styles.secondaryText}>
              {app?.isLoggedIn ? 'Your private recovery space' : 'Guest profile'}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.lavenderStrong} />
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
          <Text style={styles.levelText}>{`Consistency ${consistencyScore}%`}</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Account details</Text>
        <View style={styles.detailGrid}>
          <DetailItem label="Email" value={user?.email ?? 'No email set'} />
          <DetailItem label="Journal count" value={`${journalCount} entries`} />
          <DetailItem label="Current status" value={statusLabel} />
        </View>
      </GlassCard>
    </Screen>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  title: {
    color: colors.heading,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    fontWeight: '600',
    maxWidth: '92%',
  },
  heroCard: {
    marginBottom: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.cardLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.lavenderStrong,
    fontSize: 32,
    fontWeight: '900',
  },
  heroCopy: {
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    color: colors.heading,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  secondaryText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(161, 133, 232, 0.14)',
  },
  statusText: {
    color: colors.lavenderStrong,
    fontSize: 13,
    fontWeight: '800',
  },
  levelText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: 22,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  overviewIcon: {
    width: 38,
    height: 38,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  overviewValue: {
    color: colors.heading,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  overviewLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionCard: {
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 26,
  },
  sectionHeader: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  detailItem: {
    flexBasis: '48%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  itemLabel: {
    color: colors.textMuted,
    fontSize: 11.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  itemValue: {
    color: colors.heading,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  noteText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
});

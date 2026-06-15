import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function HistoryScreen() {
  const app = useApp();

  const latestMoodLog = app?.latestMoodLog ?? null;
  const journals = app?.journals ?? [];

  const historyItems = [
    ...(latestMoodLog
      ? [
          {
            id: `mood-${latestMoodLog.createdAt}`,
            type: 'Mood check-in',
            title: latestMoodLog.title,
            subtitle: latestMoodLog.subtitle,
            meta: new Date(latestMoodLog.createdAt).toLocaleString(),
          },
        ]
      : []),
    ...(journals ?? []).map((entry: any, index: number) => ({
      id: entry?.id ?? `journal-${index}`,
      type: 'Journal',
      title: entry?.title ?? 'Daily reflection',
      subtitle: entry?.body ?? '',
      meta: entry?.date ?? '',
    })),
  ];

  return (
    <Screen>
      <Text style={styles.eyebrow}>Progress</Text>
      <Text style={styles.title}>Activity history</Text>
      <Text style={styles.subtitle}>
        A gentle timeline of your check-ins and reflections.
      </Text>

      {historyItems.length === 0 ? (
        <GlassCard style={styles.card}>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyText}>
            Your mood check-ins and journal activity will appear here once you start using them.
          </Text>
        </GlassCard>
      ) : (
        (historyItems ?? []).map((item) => (
          <GlassCard key={item.id} style={styles.card}>
            <Text style={styles.itemType}>{item.type}</Text>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {!!item.subtitle && (
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            )}
            {!!item.meta && <Text style={styles.itemMeta}>{item.meta}</Text>}
          </GlassCard>
        ))
      )}
    </Screen>
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
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  card: {
    marginBottom: 14,
  },
  emptyTitle: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  itemType: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  itemTitle: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  itemSubtitle: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  itemMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
});
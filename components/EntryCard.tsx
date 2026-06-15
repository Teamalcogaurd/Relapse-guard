import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadows } from '@/constants/theme';

export function EntryCard({
  title,
  subtitle,
  meta,
  body,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  body?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {!!meta && (
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>{meta}</Text>
          </View>
        )}
      </View>

      {!!body && <Text style={styles.body}>{body}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 18,
    borderWidth: 1.2,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  title: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  metaChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.cardPeach,
  },
  metaText: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
});
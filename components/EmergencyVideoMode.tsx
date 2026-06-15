import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { colors } from '@/constants/theme';
import { RecoveryVideo } from '@/types';

export function EmergencyVideoMode({
  video,
  onCallSupport,
  onBreathing,
  onTriggerVibration,
}: {
  video: RecoveryVideo;
  onCallSupport: () => void;
  onBreathing: () => void;
  onTriggerVibration: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.heroBlock}>
        <Text style={styles.heroTag}>Emergency intervention</Text>
        <Text style={styles.heroTitle}>{video.title}</Text>
        <Text style={styles.heroSubtitle}>{video.description}</Text>
      </View>

      <View style={styles.buttonsRow}>
        <AppButton label="Call Support" onPress={onCallSupport} style={styles.button} />
        <AppButton
          label="Start breathing"
          variant="secondary"
          onPress={onBreathing}
          style={styles.button}
        />
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Wearable support</Text>
        <Text style={styles.actionText}>
          Trigger an alert on your wearable and shift your focus to the next safe step.
        </Text>
        <AppButton label="Vibrate wearable" variant="ghost" onPress={onTriggerVibration} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  heroBlock: {
    backgroundColor: '#FBEFF2',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.2,
    borderColor: colors.roseStrong,
    marginBottom: 16,
  },
  heroTag: {
    color: colors.roseStrong,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: colors.heading,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: colors.border,
  },
  actionTitle: {
    fontSize: 16,
    color: colors.heading,
    fontWeight: '900',
    marginBottom: 10,
  },
  actionText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
});

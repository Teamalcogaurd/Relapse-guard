import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { AppButton } from '@/components/AppButton';
import { colors } from '@/constants/theme';
import { getEmergencyVideo, logVideoInteraction } from '@/services/videoRecommendationService';
import { RecoveryVideo, VideoContext } from '@/types';
import { useApp } from '@/context/AppContext';

function parseNumber(raw?: string | string[]): number {
  if (!raw) return 0;
  if (Array.isArray(raw)) return Number(raw[0]) || 0;
  return Number(raw) || 0;
}

export default function EmergencyVideoScreen() {
  const params = useLocalSearchParams();
  const { latestMoodLog, hardwareState } = useApp();
  const [video, setVideo] = useState<RecoveryVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      const context: VideoContext = {
        cravingIntensity: parseNumber(params.intensity),
        mood: latestMoodLog?.title || undefined,
        trigger: params.trigger as string | undefined,
        states: params.states ? [params.states as string] : [],
        supports: params.supports ? [params.supports as string] : [],
        note: params.note as string | undefined,
        sensorData: {
          heartRate: hardwareState.liveHeartRate,
          gsr: hardwareState.stressLevel,
          bodyTemp: hardwareState.bodyTemp,
        },
      };

      const emergency = await getEmergencyVideo(context);
      if (emergency) {
        setVideo(emergency);
        await logVideoInteraction(emergency.id, 'watched');
      }
      setLoading(false);
    };

    loadVideo();
  }, [latestMoodLog, hardwareState, params]);

  const triggerWearableVibration = () => {
    Alert.alert('Wearable vibration', 'This is a placeholder for wearable vibration support.');
    console.log('Wearable vibration placeholder triggered');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:9999999999').catch(() => {
      Alert.alert('Unable to call', 'Please call your support number manually.');
    });
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Emergency intervention</Text>
      <Text style={styles.title}>Stay with this moment</Text>
      <Text style={styles.subtitle}>Use this video and support tools until the urge eases.</Text>

      <GlassCard style={styles.heroCard}>
        <Text style={styles.heroTag}>Emergency mode</Text>
        <Text style={styles.heroVideoTitle}>{video?.title ?? 'Preparing support...'}</Text>
        <Text style={styles.heroText}>{video?.description ?? 'A rapid intervention clip selected for this moment.'}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>{video?.duration ?? 0} min</Text>
        </View>

        <AppButton label="Call Support" onPress={handleCallSupport} />
        <View style={{ height: 10 }} />
        <AppButton
          label="Start breathing"
          variant="secondary"
          onPress={() => router.push('/support/breathing')}
        />
        <View style={{ height: 10 }} />
        <AppButton label="Vibrate wearable" variant="ghost" onPress={triggerWearableVibration} />
      </GlassCard>

      {loading ? (
        <Text style={styles.loadingText}>Loading emergency video...</Text>
      ) : (
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>When to use this</Text>
          <Text style={styles.sectionText}>
            If your craving intensity is high and your wearable shows elevated heart rate or stress, keep this screen open and use the breathing tool.
          </Text>
        </GlassCard>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.roseStrong,
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
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroCard: {
    marginBottom: 16,
    borderColor: colors.roseStrong,
  },
  heroTag: {
    color: colors.roseStrong,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroVideoTitle: {
    color: colors.heading,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  metaValue: {
    color: colors.heading,
    fontSize: 13,
    fontWeight: '900',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  card: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  sectionText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});

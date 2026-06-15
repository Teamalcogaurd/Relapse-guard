import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { AppButton } from '@/components/AppButton';
import { VideoRecommendationCard } from '@/components/VideoRecommendationCard';
import { EmergencyVideoMode } from '@/components/EmergencyVideoMode';
import { useApp } from '@/context/AppContext';
import {
  getVideoRecommendations,
  logVideoInteraction,
  isEmergencyContext,
} from '@/services/videoRecommendationService';
import { RecoveryVideo, VideoContext } from '@/types';
import { colors } from '@/constants/theme';

function parseListParam(raw?: string | string[]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => parseListParam(item));
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [raw];
  }
}

export default function RecoveryVideoScreen() {
  const params = useLocalSearchParams();
  const { latestMoodLog, latestCravingEntry, hardwareState } = useApp();
  const [recommendations, setRecommendations] = useState<RecoveryVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const context: VideoContext = useMemo(() => {
    const hasParams = Boolean(params.intensity || params.trigger || params.note || params.states || params.supports);
    const entrySource = hasParams
      ? {
          intensity: Number(params.intensity ?? '0'),
          states: parseListParam(params.states),
          triggers: parseListParam(params.triggers),
          supports: parseListParam(params.supports),
          note: params.note as string | undefined,
        }
      : latestCravingEntry ?? {
          intensity: 0,
          states: [],
          triggers: [],
          supports: [],
          note: undefined,
        };

    return {
      cravingIntensity: entrySource.intensity,
      mood: latestMoodLog?.title || params.mood || undefined,
      trigger: entrySource.triggers?.join(', ') || params.trigger || undefined,
      states: entrySource.states,
      supports: entrySource.supports,
      note: entrySource.note,
      sensorData: {
        heartRate: hardwareState.liveHeartRate,
        gsr: hardwareState.stressLevel,
        bodyTemp: hardwareState.bodyTemp,
      },
    };
  }, [params, latestMoodLog, latestCravingEntry, hardwareState]);

  const hasEntry = Boolean(
    context.cravingIntensity > 0 ||
      context.trigger ||
      (context.states && context.states.length > 0) ||
      (context.supports && context.supports.length > 0) ||
      context.note
  );

  const emergency = isEmergencyContext(context);
  const emergencyVideo = useMemo(
    () => recommendations.find((item) => item.emergency) ?? null,
    [recommendations]
  );

  useEffect(() => {
    let isMounted = true;
    
    if (recommendations.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getVideoRecommendations(context)
      .then((videos) => {
        if (isMounted) {
          setRecommendations(videos);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRecommendations([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [context, recommendations.length]);

  const handleWatch = async (video: RecoveryVideo) => {
    await logVideoInteraction(video.id, 'watched');
    if (video.emergency) {
      const emergencyQuery = new URLSearchParams({
        videoId: video.id,
        title: video.title,
        category: video.category,
      }).toString();

      router.push(`/support/emergency-video?${emergencyQuery}`);
      return;
    }

    Linking.openURL(video.videoUrl).catch(() => {
      console.warn('Unable to open video URL', video.videoUrl);
    });
  };

  const handleSkip = async (videoId: string) => {
    await logVideoInteraction(videoId, 'skipped');
    setRecommendations((current) => current.filter((item) => item.id !== videoId));
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Recovery video</Text>
      <Text style={styles.title}>Situation-based support</Text>
      <Text style={styles.subtitle}>
        Videos recommended for your current craving, mood, and wearable state.
      </Text>

      <GlassCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your moment</Text>
        <Text style={styles.summaryText}>
          Intensity: {context.cravingIntensity || '—'} •
          {context.trigger ? ` Trigger: ${context.trigger}` : ''}
        </Text>
        <Text style={styles.summaryText}>
          Heart rate: {context.sensorData?.heartRate ?? '—'} bpm • Stress: {context.sensorData?.gsr ?? '—'}
        </Text>
      </GlassCard>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.blueStrong} />
          <Text style={styles.loaderText}>Finding the best recovery videos...</Text>
        </View>
      ) : (
        <> 
          {!hasEntry ? (
            <GlassCard style={styles.card}>
              <Text style={styles.sectionTitle}>No craving data loaded</Text>
              <Text style={styles.sectionText}>
                Press Save on the craving journal first, then try again. If this keeps happening, the app is not passing the entry data.
              </Text>
              <Text style={styles.sectionText}>Current source:</Text>
              <Text style={styles.debugText}>{JSON.stringify(context, null, 2)}</Text>
            </GlassCard>
          ) : null}

          {emergency && emergencyVideo ? (
            <EmergencyVideoMode
              video={emergencyVideo}
              onCallSupport={() => Linking.openURL('tel:9999999999')}
              onBreathing={() => router.push('/support/breathing')}
              onTriggerVibration={() => {
                console.log('Wearable vibration placeholder triggered');
              }}
            />
          ) : null}

          <GlassCard style={styles.card}>
            <Text style={styles.sectionTitle}>Top picks</Text>
            <Text style={styles.sectionText}>
              Choose a short video matched to your current state and past support history.
            </Text>
          </GlassCard>

          {recommendations.length === 0 ? (
            <GlassCard style={styles.card}>
              <Text style={styles.sectionText}>
                No videos available right now. Add links in services/videoRecommendationService.ts to test.
              </Text>
            </GlassCard>
          ) : (
            recommendations.map((video) => (
              <VideoRecommendationCard
                key={video.id}
                video={video}
                onWatch={handleWatch}
                onSkip={handleSkip}
              />
            ))
          )}
        </>
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
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  summaryText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  loaderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  loaderText: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  sectionText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  debugText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 10,
  },
});

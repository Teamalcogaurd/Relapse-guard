import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { AppButton } from '@/components/AppButton';
import { colors } from '@/constants/theme';

type BreathPhaseKey = 'inhale' | 'hold' | 'exhale' | 'rest';

type BreathPreset = {
  id: string;
  name: string;
  subtitle: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  accent: string;
  tint: string;
};

type Phase = {
  key: BreathPhaseKey;
  label: string;
  seconds: number;
};

const PRESETS: BreathPreset[] = [
  {
    id: 'calm',
    name: 'Calm',
    subtitle: 'Gentle daily reset',
    inhale: 4,
    hold: 2,
    exhale: 6,
    rest: 2,
    accent: '#43B8C8',
    tint: '#EEF9FB',
  },
  {
    id: 'focus',
    name: 'Focus',
    subtitle: 'Steady and clear',
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    accent: colors.blueStrong,
    tint: '#EEF3FF',
  },
  {
    id: 'release',
    name: 'Release',
    subtitle: 'Longer exhale support',
    inhale: 5,
    hold: 1,
    exhale: 7,
    rest: 1,
    accent: colors.lavenderStrong,
    tint: '#F4F0FD',
  },
];

const DEFAULT_CYCLES = 5;

const PHASE_COPY: Record<BreathPhaseKey, string> = {
  inhale: 'Breathe in slowly',
  hold: 'Hold softly',
  exhale: 'Let the breath go',
  rest: 'Pause and settle',
};

const PHASE_COLOR: Record<BreathPhaseKey, string> = {
  inhale: '#8D79E6',
  hold: '#7E6ED6',
  exhale: '#6D4338',
  rest: '#B59C95',
};

const SCALE_TARGETS: Record<BreathPhaseKey, number> = {
  inhale: 1.08,
  hold: 1.08,
  exhale: 0.9,
  rest: 0.96,
};

function buildPhases(preset: BreathPreset): Phase[] {
  return [
    { key: 'inhale', label: 'Inhale', seconds: preset.inhale },
    { key: 'hold', label: 'Hold', seconds: preset.hold },
    { key: 'exhale', label: 'Exhale', seconds: preset.exhale },
    { key: 'rest', label: 'Rest', seconds: preset.rest },
  ].filter((phase) => phase.seconds > 0);
}

function formatSeconds(total: number) {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function BloomBreathVisual({
  accent,
  scaleAnim,
}: {
  accent: string;
  scaleAnim: Animated.Value;
}) {
  const petals = new Array(10).fill(0);

  return (
    <Animated.View
      style={[
        bloomStyles.wrap,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={bloomStyles.bloom}>
        {petals.map((_, index) => {
          const rotate = `${index * 36}deg`;

          return (
            <View
              key={index}
              style={[
                bloomStyles.petal,
                {
                  backgroundColor: accent,
                  transform: [{ rotate }],
                },
              ]}
            />
          );
        })}

        <View
          style={[
            bloomStyles.coreGlow,
            {
              backgroundColor: accent,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export default function BreathingScreen() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('calm');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phaseRemainingMs, setPhaseRemainingMs] = useState(0);
  const [totalRemainingMs, setTotalRemainingMs] = useState(0);

  const selectedPreset =
    PRESETS.find((preset) => preset.id === selectedPresetId) ?? PRESETS[0];

  const phases = useMemo(() => buildPhases(selectedPreset), [selectedPreset]);

  const totalSessionMs = useMemo(() => {
    const oneCycleMs =
      phases.reduce((sum, phase) => sum + phase.seconds, 0) * 1000;
    return oneCycleMs * DEFAULT_CYCLES;
  }, [phases]);

  const currentPhase = phases[currentPhaseIndex] ?? phases[0];

  const bloomScale = useRef(new Animated.Value(0.88)).current;
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef({
    phaseIndex: 0,
    cycle: 1,
    phaseRemainingMs: 0,
    totalRemainingMs: 0,
    running: false,
    paused: false,
  });

  const resetSessionState = () => {
    stopTicker();

    sessionRef.current = {
      phaseIndex: 0,
      cycle: 1,
      phaseRemainingMs: 0,
      totalRemainingMs: totalSessionMs,
      running: false,
      paused: false,
    };

    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentPhaseIndex(0);
    setCurrentCycle(1);
    setPhaseRemainingMs(0);
    setTotalRemainingMs(totalSessionMs);

    Animated.timing(bloomScale, {
      toValue: 0.88,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    resetSessionState();
  }, [selectedPresetId, totalSessionMs]);

  useEffect(() => {
    return () => stopTicker();
  }, []);

  const stopTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  };

  const animateForPhase = (phaseKey: BreathPhaseKey, durationMs: number) => {
    Animated.timing(bloomScale, {
      toValue: SCALE_TARGETS[phaseKey],
      duration: Math.max(durationMs, 250),
      easing:
        phaseKey === 'exhale'
          ? Easing.inOut(Easing.cubic)
          : Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const beginPhase = (phaseIndex: number, cycle: number, remainingMs?: number) => {
    const phase = phases[phaseIndex];
    if (!phase) return;

    const durationMs =
      typeof remainingMs === 'number' ? remainingMs : phase.seconds * 1000;

    sessionRef.current.phaseIndex = phaseIndex;
    sessionRef.current.cycle = cycle;
    sessionRef.current.phaseRemainingMs = durationMs;

    setCurrentPhaseIndex(phaseIndex);
    setCurrentCycle(cycle);
    setPhaseRemainingMs(durationMs);

    animateForPhase(phase.key, durationMs);
  };

  const completeSession = () => {
    stopTicker();
    sessionRef.current.running = false;
    sessionRef.current.paused = false;

    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(true);
    setPhaseRemainingMs(0);
    setTotalRemainingMs(0);

    Animated.timing(bloomScale, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const advancePhase = () => {
    const { phaseIndex, cycle } = sessionRef.current;
    const isLastPhase = phaseIndex >= phases.length - 1;
    const isLastCycle = cycle >= DEFAULT_CYCLES;

    if (isLastPhase && isLastCycle) {
      completeSession();
      return;
    }

    if (isLastPhase) {
      beginPhase(0, cycle + 1);
      return;
    }

    beginPhase(phaseIndex + 1, cycle);
  };

  const startTicker = () => {
    stopTicker();

    tickerRef.current = setInterval(() => {
      if (!sessionRef.current.running || sessionRef.current.paused) return;

      const nextPhaseRemaining = Math.max(
        sessionRef.current.phaseRemainingMs - 100,
        0
      );
      const nextTotalRemaining = Math.max(
        sessionRef.current.totalRemainingMs - 100,
        0
      );

      sessionRef.current.phaseRemainingMs = nextPhaseRemaining;
      sessionRef.current.totalRemainingMs = nextTotalRemaining;

      setPhaseRemainingMs(nextPhaseRemaining);
      setTotalRemainingMs(nextTotalRemaining);

      if (nextPhaseRemaining <= 0) {
        advancePhase();
      }
    }, 100);
  };

  const handleStart = () => {
    setIsComplete(false);
    setIsRunning(true);
    setIsPaused(false);

    sessionRef.current.running = true;
    sessionRef.current.paused = false;
    sessionRef.current.totalRemainingMs = totalSessionMs;

    setTotalRemainingMs(totalSessionMs);
    beginPhase(0, 1);
    startTicker();
  };

  const handlePause = () => {
    sessionRef.current.paused = true;
    setIsPaused(true);
    setIsRunning(false);
    stopTicker();
    bloomScale.stopAnimation();
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
    sessionRef.current.running = true;
    sessionRef.current.paused = false;

    const phase = phases[sessionRef.current.phaseIndex];
    if (phase) {
      animateForPhase(phase.key, sessionRef.current.phaseRemainingMs);
    }

    startTicker();
  };

  const handleReset = () => {
    resetSessionState();
  };

  const phaseSecondsLeft = Math.max(1, Math.ceil(phaseRemainingMs / 1000));
  const totalSecondsLeft = Math.max(0, Math.ceil(totalRemainingMs / 1000));
  const progress =
    totalSessionMs > 0 ? 1 - totalRemainingMs / totalSessionMs : 0;

  return (
    <Screen>
      <Text style={styles.eyebrow}>Guided calm</Text>
      <Text style={styles.title}>Breathing support</Text>
      <Text style={styles.subtitle}>
        Follow one simple rhythm and let the breath slow the body down.
      </Text>

      <GlassCard style={styles.heroCard}>
        <LinearGradient
          colors={['#FFFDFC', selectedPreset.tint, '#FFF8F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.topRow}>
            <View style={styles.topPill}>
              <Ionicons
                name="time-outline"
                size={14}
                color={selectedPreset.accent}
              />
              <Text style={[styles.topPillText, { color: selectedPreset.accent }]}>
                {formatSeconds(totalSecondsLeft)}
              </Text>
            </View>

            <View style={styles.topPill}>
              <Text style={styles.patternText}>
                {selectedPreset.inhale}-{selectedPreset.hold}-{selectedPreset.exhale}
                {selectedPreset.rest ? `-${selectedPreset.rest}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.orbArea}>
            <BloomBreathVisual
              accent={selectedPreset.accent}
              scaleAnim={bloomScale}
            />
          </View>

          <View style={styles.phaseBlock}>
            <Text
              style={[
                styles.phaseTitle,
                { color: PHASE_COLOR[currentPhase?.key ?? 'inhale'] },
              ]}
            >
              {isComplete ? 'Complete' : currentPhase?.label ?? 'Ready'}
            </Text>

            <Text style={styles.phaseSeconds}>
              {isComplete ? 'Done' : `${phaseSecondsLeft}s`}
            </Text>

            <Text style={styles.phaseSupport}>
              {isComplete
                ? 'You completed this breathing session.'
                : PHASE_COPY[currentPhase?.key ?? 'inhale']}
            </Text>
          </View>

          <View style={styles.phaseRow}>
            {(phases ?? []).map((phase, index) => {
              const active = index === currentPhaseIndex;

              return (
                <View
                  key={phase.key}
                  style={[
                    styles.phasePill,
                    active && {
                      backgroundColor: PHASE_COLOR[phase.key] + '12',
                      borderColor: PHASE_COLOR[phase.key] + '42',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.phasePillText,
                      active && { color: PHASE_COLOR[phase.key] },
                    ]}
                  >
                    {phase.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Cycle</Text>
              <Text style={styles.metaValue}>
                {Math.min(currentCycle, DEFAULT_CYCLES)} / {DEFAULT_CYCLES}
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Time left</Text>
              <Text style={styles.metaValue}>{formatSeconds(totalSecondsLeft)}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(6, progress * 100)}%`,
                  backgroundColor: selectedPreset.accent,
                },
              ]}
            />
          </View>

          <View style={styles.inlineControls}>
            {!isRunning && !isPaused && !isComplete && (
              <AppButton label="Start session" onPress={handleStart} />
            )}

            {isRunning && (
              <View style={styles.dualButtonRow}>
                <AppButton
                  label="Pause"
                  variant="secondary"
                  style={{ flex: 1 }}
                  onPress={handlePause}
                />
                <View style={{ width: 10 }} />
                <AppButton
                  label="Reset"
                  variant="ghost"
                  style={{ flex: 1 }}
                  onPress={handleReset}
                />
              </View>
            )}

            {!isRunning && isPaused && (
              <View style={styles.dualButtonRow}>
                <AppButton
                  label="Resume"
                  style={{ flex: 1 }}
                  onPress={handleResume}
                />
                <View style={{ width: 10 }} />
                <AppButton
                  label="Reset"
                  variant="secondary"
                  style={{ flex: 1 }}
                  onPress={handleReset}
                />
              </View>
            )}

            {isComplete && (
              <View style={styles.completeWrap}>
                <View style={styles.completeBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.sageStrong}
                  />
                  <Text style={styles.completeBadgeText}>Session complete</Text>
                </View>
                <Text style={styles.completeText}>
                  You gave your body a calmer rhythm.
                </Text>
                <AppButton label="Start again" onPress={handleStart} />
              </View>
            )}
          </View>
        </LinearGradient>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Breathing style</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the pace that feels right for this moment.
        </Text>

        <View style={styles.presetWrap}>
          {(PRESETS ?? []).map((preset) => {
            const active = preset.id === selectedPresetId;

            return (
              <Pressable
                key={preset.id}
                onPress={() => setSelectedPresetId(preset.id)}
                style={[
                  styles.presetCard,
                  active && {
                    borderColor: preset.accent,
                    backgroundColor: preset.tint,
                  },
                ]}
              >
                <View
                  style={[
                    styles.presetDot,
                    { backgroundColor: preset.accent },
                  ]}
                />
                <Text
                  style={[
                    styles.presetTitle,
                    active && { color: preset.accent },
                  ]}
                >
                  {preset.name}
                </Text>
                <Text style={styles.presetSubtitle}>{preset.subtitle}</Text>
                <Text style={styles.presetPattern}>
                  {preset.inhale}-{preset.hold}-{preset.exhale}
                  {preset.rest ? `-${preset.rest}` : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>
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
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 18,
  },

  heroCard: {
    overflow: 'hidden',
    padding: 0,
    marginBottom: 14,
  },
  heroGradient: {
    padding: 18,
    borderRadius: 30,
    overflow: 'hidden',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  patternText: {
    color: colors.textSoft,
    fontSize: 12.5,
    fontWeight: '800',
  },

  orbArea: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },

  phaseBlock: {
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  phaseTitle: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 2,
  },
  phaseSeconds: {
    color: colors.heading,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
  },
  phaseSupport: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },

  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  phasePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  phasePillText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaBlock: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metaValue: {
    color: colors.heading,
    fontSize: 15,
    fontWeight: '900',
  },

  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#F2EAE6',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  inlineControls: {
    marginTop: 2,
  },
  dualButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  completeWrap: {
    gap: 12,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.sage,
  },
  completeBadgeText: {
    color: colors.sageStrong,
    fontSize: 13,
    fontWeight: '800',
  },
  completeText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },

  card: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },

  presetWrap: {
    gap: 10,
  },
  presetCard: {
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 14,
    backgroundColor: '#FFFDFC',
  },
  presetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  presetTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  presetSubtitle: {
    color: colors.textSoft,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetPattern: {
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: '700',
  },
});

const bloomStyles = StyleSheet.create({
  wrap: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloom: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    display: 'none',
  },
  petal: {
    position: 'absolute',
    width: 72,
    height: 112,
    borderRadius: 999,
    opacity: 0.14,
  },
  coreGlow: {
    width: 52,
    height: 52,
    borderRadius: 999,
    opacity: 0.12,
  },
});
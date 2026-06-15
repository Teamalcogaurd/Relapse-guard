import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '@/components/AppButton';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { colors, radii, shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { RecoveryEvent, RecoveryOutcome } from '@/types';

const TRIGGERS = ['stress', 'loneliness', 'anger', 'sadness', 'social pressure', 'craving', 'other'];
const HELPED = ['breathing', 'water', 'support', 'music', 'walking', 'vibration', 'none'];
const SAFE_STEPS = ['Drink Water', 'Avoid Driving', 'Move Away From Trigger'];
const ALCOHOL_OPTIONS: RecoveryOutcome[] = ['Yes', 'No', 'Skip'];

type Step = 0 | 1 | 2;

function formatTime(seconds: number) {
  return `0:${seconds.toString().padStart(2, '0')}`;
}

export default function RecoveryModeScreen() {
  const { hardwareState, saveRecoveryEvent } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [remaining, setRemaining] = useState(60);
  const [safeActions, setSafeActions] = useState<string[]>([]);
  const [alcoholInvolved, setAlcoholInvolved] = useState<RecoveryOutcome | null>(null);
  const [trigger, setTrigger] = useState('stress');
  const [helped, setHelped] = useState('breathing');
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');

  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 560,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [entrance, pulse]);

  useEffect(() => {
    if (step !== 0) return;

    if (hardwareState.connected) {
      // Connect to BLE haptics when available: slow inhale pulse, pause, longer exhale pulse.
      console.log('Recovery Mode haptic breathing placeholder');
    }

    const timer = setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [hardwareState.connected, step]);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.14] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.42, 0.12] });
  const calmProgress = Math.round(((60 - remaining) / 60) * 100);
  const waveProgress = step === 0 ? Math.max(12, calmProgress * 0.45) : step === 1 ? 68 : 100;
  const waveLabel = step === 0 ? 'Intense' : step === 1 ? 'Settling' : 'Stable';
  const riseIn = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  const toggleSafeAction = (item: string) => {
    setSafeActions((current) =>
      current.includes(item) ? current.filter((x) => x !== item) : [...current, item]
    );
  };

  const messageTrustedPerson = () => {
    const body = encodeURIComponent("I'm having a difficult moment. Can you check on me?");
    Linking.openURL(`sms:9999999999?body=${body}`).catch(() => {});
  };

  const playRainSound = () => {
    console.log('Rain sound placeholder');
  };

  const saveRecovery = (outcome: RecoveryOutcome) => {
    const event: RecoveryEvent = {
      id: Date.now().toString(),
      source: 'manual_recovery',
      outcome,
      trigger: outcome === 'Yes' ? trigger : '',
      helped: outcome === 'Yes' ? [helped] : safeActions,
      note: outcome === 'Yes' ? note.trim() : '',
      durationSeconds: 60 - remaining,
      createdAt: new Date().toISOString(),
    };

    saveRecoveryEvent(event);
    router.replace('/(tabs)');
  };

  const chooseAlcohol = (option: RecoveryOutcome) => {
    setAlcoholInvolved(option);
    if (option !== 'Yes') {
      saveRecovery(option);
    }
  };

  return (
    <Screen>
      <Animated.View style={[styles.wrap, riseIn]}>
        <View style={styles.dimLayer} />

        <Text style={styles.eyebrow}>Recovery Mode</Text>
        <Text style={styles.title}>{step === 0 ? 'Calm Body' : step === 1 ? 'Stay Safe' : 'Log Privately'}</Text>
        <Text style={styles.subtitle}>
          {step === 0 ? 'Breathe. You’re safe.' : step === 1 ? 'Choose what protects you.' : 'Only if you want to.'}
        </Text>

        <WaveBar progress={waveProgress} label={waveLabel} />

        {step === 0 ? (
          <>
            <GlassCard style={styles.heroCard}>
              <LinearGradient
                colors={['#FFFDFC', '#F4F0FD', '#EEF8F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.orbWrap}>
                  <Animated.View
                    style={[
                      styles.orbAura,
                      { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
                    ]}
                  />
                  <Animated.View style={[styles.orb, { transform: [{ scale: pulseScale }] }]}>
                    <Text style={styles.orbLabel}>60 sec</Text>
                    <Text style={styles.orbTime}>{formatTime(remaining)}</Text>
                  </Animated.View>
                </View>
              </LinearGradient>
            </GlassCard>

            <Pressable onPress={playRainSound} style={styles.audioCard}>
              <MaterialCommunityIcons name="weather-pouring" size={21} color={colors.blueStrong} />
              <Text style={styles.audioText}>Rain sounds</Text>
            </Pressable>

            <AppButton label="Next" onPress={() => setStep(1)} />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <View style={styles.safeGrid}>
              {SAFE_STEPS.map((item) => {
                const active = safeActions.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => toggleSafeAction(item)}
                    style={[styles.safeCard, active && styles.safeCardActive]}
                  >
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={active ? colors.sageStrong : colors.textMuted}
                    />
                    <Text style={[styles.safeText, active && styles.safeTextActive]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={messageTrustedPerson} style={styles.messageCard}>
              <View style={styles.messageIcon}>
                <MaterialCommunityIcons name="message-text-outline" size={22} color={colors.brown} />
              </View>
              <View style={styles.messageCopy}>
                <Text style={styles.messageTitle}>Message Trusted Person</Text>
                <Text style={styles.messageText}>Send a simple check-in request.</Text>
              </View>
            </Pressable>

            <AppButton label="Next" onPress={() => setStep(2)} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <GlassCard style={styles.logCard}>
              <Text style={styles.blockTitle}>Did alcohol become part of this moment?</Text>
              <View style={styles.chipWrap}>
                {ALCOHOL_OPTIONS.map((item) => (
                  <ChoiceChip
                    key={item}
                    label={item}
                    active={alcoholInvolved === item}
                    onPress={() => chooseAlcohol(item)}
                  />
                ))}
              </View>
            </GlassCard>

            {alcoholInvolved === 'Yes' ? (
              <>
                <ReflectionBlock title="Trigger?">
                  {TRIGGERS.map((item) => (
                    <ChoiceChip
                      key={item}
                      label={item}
                      active={trigger === item}
                      onPress={() => setTrigger(item)}
                    />
                  ))}
                </ReflectionBlock>

                <ReflectionBlock title="What helped?">
                  {HELPED.map((item) => (
                    <ChoiceChip
                      key={item}
                      label={item}
                      active={helped === item}
                      onPress={() => setHelped(item)}
                    />
                  ))}
                </ReflectionBlock>

                {!showNote ? (
                  <Pressable onPress={() => setShowNote(true)} style={styles.addNoteButton}>
                    <Text style={styles.addNoteText}>Add note</Text>
                  </Pressable>
                ) : (
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    multiline
                    textAlignVertical="top"
                    placeholder="Optional note"
                    placeholderTextColor={colors.textMuted}
                    style={styles.noteInput}
                  />
                )}

                <AppButton label="Save" onPress={() => saveRecovery('Yes')} />
              </>
            ) : null}
          </>
        ) : null}
      </Animated.View>
    </Screen>
  );
}

function WaveBar({ progress, label }: { progress: number; label: string }) {
  return (
    <GlassCard style={styles.waveCard}>
      <View style={styles.waveTop}>
        <Text style={styles.waveLabel}>Craving Wave</Text>
        <Text style={styles.waveState}>{label}</Text>
      </View>
      <View style={styles.waveTrack}>
        <View style={[styles.waveFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.waveLabels}>
        <Text style={styles.waveTick}>Intense</Text>
        <Text style={styles.waveTick}>Settling</Text>
        <Text style={styles.waveTick}>Stable</Text>
      </View>
    </GlassCard>
  );
}

function ReflectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard style={styles.reflectCard}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.chipWrap}>{children}</View>
    </GlassCard>
  );
}

function ChoiceChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  dimLayer: {
    position: 'absolute',
    top: -20,
    left: -18,
    right: -18,
    height: 420,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    backgroundColor: 'rgba(109,67,56,0.035)',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 10,
  },
  title: {
    color: colors.heading,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '700',
    marginBottom: 14,
  },
  waveCard: {
    marginBottom: 14,
    padding: 14,
  },
  waveTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waveLabel: {
    color: colors.heading,
    fontSize: 14,
    fontWeight: '900',
  },
  waveState: {
    color: colors.sageStrong,
    fontSize: 12,
    fontWeight: '900',
  },
  waveTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.borderSoft,
    overflow: 'hidden',
  },
  waveFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.sageStrong,
  },
  waveLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  waveTick: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  heroCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroGradient: {
    padding: 18,
    borderRadius: radii.xl,
  },
  orbWrap: {
    height: 232,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbAura: {
    position: 'absolute',
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: colors.lavenderStrong,
  },
  orb: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  orbLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  orbTime: {
    color: colors.heading,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
  },
  audioCard: {
    minHeight: 54,
    borderRadius: 19,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
    ...shadows.soft,
  },
  audioText: {
    color: colors.heading,
    fontSize: 14,
    fontWeight: '900',
  },
  safeGrid: {
    gap: 10,
    marginBottom: 14,
  },
  safeCard: {
    minHeight: 58,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadows.soft,
  },
  safeCardActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sageStrong,
  },
  safeText: {
    color: colors.heading,
    fontSize: 15,
    fontWeight: '900',
  },
  safeTextActive: {
    color: colors.sageStrong,
  },
  messageCard: {
    minHeight: 76,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    ...shadows.soft,
  },
  messageIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.cardPeach,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageCopy: {
    flex: 1,
  },
  messageTitle: {
    color: colors.heading,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 3,
  },
  messageText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  logCard: {
    marginBottom: 14,
  },
  reflectCard: {
    marginBottom: 14,
  },
  blockTitle: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: colors.cardSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sageStrong,
  },
  chipText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextActive: {
    color: colors.sageStrong,
  },
  addNoteButton: {
    minHeight: 48,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  addNoteText: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: '900',
  },
  noteInput: {
    minHeight: 108,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
    color: colors.heading,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
    marginBottom: 14,
  },
});

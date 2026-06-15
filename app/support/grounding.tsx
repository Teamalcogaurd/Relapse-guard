import React, { useMemo, useRef, useState } from 'react';
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

type GroundingStep = {
  id: string;
  count: number;
  title: string;
  prompt: string;
  help: string;
  placeholderPrefix: string;
  accent: string;
  tint: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const STEPS: GroundingStep[] = [
  {
    id: 'see',
    count: 5,
    title: 'Notice 5 things you can see',
    prompt: 'Look around and gently name what is in front of you.',
    help: 'Try colors, shapes, light, shadows, or objects nearby.',
    placeholderPrefix: 'Thing',
    accent: '#6A8FE8',
    tint: '#EEF3FF',
    icon: 'eye-outline',
  },
  {
    id: 'feel',
    count: 4,
    title: 'Notice 4 things you can feel',
    prompt: 'Bring attention back to your body and what touches it.',
    help: 'Notice fabric, air, temperature, pressure, or texture.',
    placeholderPrefix: 'Sensation',
    accent: '#56A97A',
    tint: '#EEF8F1',
    icon: 'hand-left-outline',
  },
  {
    id: 'hear',
    count: 3,
    title: 'Notice 3 things you can hear',
    prompt: 'Listen for sounds near you and farther away.',
    help: 'A fan, traffic, birds, voices, footsteps, or silence.',
    placeholderPrefix: 'Sound',
    accent: '#4FA6C8',
    tint: '#EEF9FB',
    icon: 'volume-medium-outline',
  },
  {
    id: 'smell',
    count: 2,
    title: 'Notice 2 things you can smell',
    prompt: 'Take a slow breath and notice any scent around you.',
    help: 'It can be subtle — air, soap, food, coffee, or nothing strong.',
    placeholderPrefix: 'Scent',
    accent: '#D28A47',
    tint: '#FBF3E8',
    icon: 'flower-outline',
  },
  {
    id: 'taste',
    count: 1,
    title: 'Notice 1 thing you can taste',
    prompt: 'Or notice one slow breath if taste is hard to find.',
    help: 'You can notice water, mint, dryness, or simply the breath.',
    placeholderPrefix: 'Taste / breath',
    accent: '#C77A8D',
    tint: '#FBEFF2',
    icon: 'water-outline',
  },
];

export default function GroundingScreen() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const riseAnim = useRef(new Animated.Value(0)).current;
  const bloomScale = useRef(new Animated.Value(1)).current;

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + (completed ? 1 : 0)) / STEPS.length) * 100;

  const entrySets = useMemo(
    () =>
      STEPS.map((step) =>
        new Array(step.count).fill(0).map((_, index) => ({
          id: `${step.id}-${index + 1}`,
          label: `${step.placeholderPrefix} ${index + 1}`,
          selected: false,
        }))
      ),
    []
  );

  const [responses, setResponses] = useState(entrySets);

  const selectedCount =
    responses[stepIndex]?.filter((item) => item.selected).length ?? 0;

  const isStepComplete = selectedCount >= currentStep.count;

  const animateStepChange = (next: () => void) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(riseAnim, {
          toValue: 10,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(riseAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bloomScale, {
            toValue: 1.05,
            duration: 180,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bloomScale, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(next);
  };

  const toggleItem = (index: number) => {
    setResponses((prev) =>
      prev.map((stepItems, sIndex) =>
        sIndex === stepIndex
          ? stepItems.map((item, i) =>
              i === index ? { ...item, selected: !item.selected } : item
            )
          : stepItems
      )
    );
  };

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    if (completed) return;

    if (stepIndex < STEPS.length - 1) {
      animateStepChange(() => setStepIndex((prev) => prev + 1));
    } else {
      animateStepChange(() => setCompleted(true));
    }
  };

  const handleBack = () => {
    if (completed) {
      animateStepChange(() => setCompleted(false));
      return;
    }

    if (stepIndex > 0) {
      animateStepChange(() => setStepIndex((prev) => prev - 1));
    }
  };

  const resetFlow = () => {
    setStarted(false);
    setCompleted(false);
    setStepIndex(0);
    setResponses(entrySets);
  };

  if (!started) {
    return (
      <Screen>
        <Text style={styles.eyebrow}>Support</Text>
        <Text style={styles.title}>Grounding</Text>
        <Text style={styles.subtitle}>
          Let’s come back to the present, one small step at a time.
        </Text>

        <GlassCard style={styles.heroCard}>
          <LinearGradient
            colors={['#FFFDFC', '#F4F0FD', '#FFF8F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconWrap}>
              <Ionicons name="sparkles-outline" size={28} color={colors.lavenderStrong} />
            </View>

            <Text style={styles.heroTitle}>5 • 4 • 3 • 2 • 1 grounding</Text>
            <Text style={styles.heroText}>
              We’ll move through sight, touch, sound, smell, and taste one by one.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.sageStrong} />
                <Text style={styles.featureText}>One step at a time</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.sageStrong} />
                <Text style={styles.featureText}>Very little to read</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.sageStrong} />
                <Text style={styles.featureText}>Gentle progress through the exercise</Text>
              </View>
            </View>

            <AppButton label="Begin grounding" onPress={handleNext} />
          </LinearGradient>
        </GlassCard>
      </Screen>
    );
  }

  if (completed) {
    return (
      <Screen>
        <Text style={styles.eyebrow}>Support</Text>
        <Text style={styles.title}>Grounding complete</Text>
        <Text style={styles.subtitle}>
          You’ve come back to the present, one gentle step at a time.
        </Text>

        <GlassCard style={styles.heroCard}>
          <LinearGradient
            colors={['#FFFDFC', '#EEF8F1', '#FFF8F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={[styles.heroIconWrap, { backgroundColor: colors.sage }]}>
              <Ionicons name="leaf-outline" size={28} color={colors.sageStrong} />
            </View>

            <Text style={styles.heroTitle}>You’re here right now</Text>
            <Text style={styles.heroText}>
              You noticed your surroundings, your body, and the moment. That counts.
            </Text>

            <View style={styles.finishCard}>
              <Text style={styles.finishCardTitle}>What helped</Text>
              <Text style={styles.finishCardText}>
                Coming back to the senses can lower overwhelm and give the mind something steady to hold.
              </Text>
            </View>

            <View style={styles.finishActions}>
              <AppButton label="Do it again" onPress={resetFlow} />
              <View style={{ height: 10 }} />
              <AppButton label="Back one step" variant="secondary" onPress={handleBack} />
            </View>
          </LinearGradient>
        </GlassCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.eyebrow}>Support</Text>
      <Text style={styles.title}>Grounding</Text>
      <Text style={styles.subtitle}>One thing at a time. No pressure.</Text>

      <GlassCard style={styles.heroCard}>
        <LinearGradient
          colors={['#FFFDFC', currentStep.tint, '#FFF8F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.topRow}>
            <View style={styles.topPill}>
              <Text style={[styles.topPillText, { color: currentStep.accent }]}>
                Step {stepIndex + 1} / {STEPS.length}
              </Text>
            </View>

            <View style={styles.topPill}>
              <Text style={styles.patternText}>
                {selectedCount}/{currentStep.count}
              </Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.visualWrap,
              {
                opacity: fadeAnim,
                transform: [{ translateY: riseAnim }, { scale: bloomScale }],
              },
            ]}
          >
            <GroundingBloom accent={currentStep.accent} icon={currentStep.icon} />
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: riseAnim }],
            }}
          >
            <View style={styles.phaseBlock}>
              <Text style={[styles.phaseTitle, { color: currentStep.accent }]}>
                {currentStep.title}
              </Text>
              <Text style={styles.phaseSupport}>{currentStep.prompt}</Text>
              <Text style={styles.helpText}>{currentStep.help}</Text>
            </View>

            <View style={styles.slotWrap}>
              {(responses[stepIndex] ?? []).map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => toggleItem(index)}
                  style={[
                    styles.slot,
                    item.selected && {
                      backgroundColor: currentStep.accent + '14',
                      borderColor: currentStep.accent + '44',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.slotDot,
                      item.selected && { backgroundColor: currentStep.accent },
                    ]}
                  />
                  <Text
                    style={[
                      styles.slotText,
                      item.selected && { color: currentStep.accent },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(8, progress)}%`,
                    backgroundColor: currentStep.accent,
                  },
                ]}
              />
            </View>

            <View style={styles.inlineControls}>
              <View style={styles.dualButtonRow}>
                <AppButton
                  label="Back"
                  variant="secondary"
                  style={{ flex: 1 }}
                  onPress={handleBack}
                />
                <View style={{ width: 10 }} />
                <AppButton
                  label={stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}
                  style={{ flex: 1 }}
                  onPress={handleNext}
                />
              </View>

              {!isStepComplete && (
                <Text style={styles.bottomHelp}>
                  Select all {currentStep.count} to complete this step.
                </Text>
              )}
            </View>
          </Animated.View>
        </LinearGradient>
      </GlassCard>
    </Screen>
  );
}

function GroundingBloom({
  accent,
  icon,
}: {
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={bloomStyles.wrap}>
      <View style={[bloomStyles.aura, { backgroundColor: accent + '18' }]} />
      <View style={bloomStyles.core}>
        {[0, 60, 120].map((deg) => (
          <View
            key={deg}
            style={[
              bloomStyles.petal,
              {
                backgroundColor: accent + '18',
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <View style={[bloomStyles.center, { backgroundColor: accent + '12' }]}>
          <Ionicons name={icon} size={28} color={accent} />
        </View>
      </View>
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

  heroIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardLavender,
    alignSelf: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    color: colors.heading,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
  },

  featureList: {
    marginBottom: 18,
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    color: colors.textSoft,
    fontSize: 14.5,
    fontWeight: '600',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topPill: {
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

  visualWrap: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },

  phaseBlock: {
    alignItems: 'center',
    marginTop: -6,
    marginBottom: 16,
  },
  phaseTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 8,
  },
  phaseSupport: {
    color: colors.heading,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  helpText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 290,
  },

  slotWrap: {
    gap: 10,
    marginBottom: 16,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
  },
  slotDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5DDD8',
    marginRight: 12,
  },
  slotText: {
    color: colors.textSoft,
    fontSize: 14.5,
    fontWeight: '700',
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
  bottomHelp: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  finishCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
  },
  finishCardTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  finishCardText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  finishActions: {
    marginTop: 2,
  },
});

const bloomStyles = StyleSheet.create({
  wrap: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  core: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 56,
    height: 92,
    borderRadius: 999,
  },
  center: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
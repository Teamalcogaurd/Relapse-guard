import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

type Step = 'entry' | 'valence' | 'labels' | 'summary';
type Mode = 'emotion' | 'mood';
type ValenceKey =
  | 'very_unpleasant'
  | 'unpleasant'
  | 'neutral'
  | 'pleasant'
  | 'very_pleasant';

const VALENCE_ORDER: ValenceKey[] = [
  'very_unpleasant',
  'unpleasant',
  'neutral',
  'pleasant',
  'very_pleasant',
];

const VALENCE_META: Record<
  ValenceKey,
  {
    title: string;
    colors: [string, string, string];
    cta: string;
    glow: string;
    bloom: string;
    summary: string;
  }
> = {
  very_unpleasant: {
    title: 'Very Unpleasant',
    colors: ['#0E111A', '#1A1F31', '#24325A'],
    cta: '#1A4ED8',
    glow: 'rgba(72, 112, 255, 0.35)',
    bloom: '#6D8BFF',
    summary: 'A very difficult moment',
  },
  unpleasant: {
    title: 'Unpleasant',
    colors: ['#11141D', '#252C40', '#49546F'],
    cta: '#1650D2',
    glow: 'rgba(118, 154, 255, 0.32)',
    bloom: '#90AFFF',
    summary: 'A difficult moment',
  },
  neutral: {
    title: 'Neutral',
    colors: ['#11171B', '#2D3940', '#56656C'],
    cta: '#4AA9C7',
    glow: 'rgba(142, 229, 255, 0.28)',
    bloom: '#A4EEFF',
    summary: 'A steady moment',
  },
  pleasant: {
    title: 'Pleasant',
    colors: ['#161A12', '#3B471D', '#67771F'],
    cta: '#93AB00',
    glow: 'rgba(221, 255, 100, 0.28)',
    bloom: '#D8FF5A',
    summary: 'A slightly pleasant day',
  },
  very_pleasant: {
    title: 'Very Pleasant',
    colors: ['#17120E', '#5A3918', '#935B17'],
    cta: '#FF742D',
    glow: 'rgba(255, 194, 120, 0.32)',
    bloom: '#FFC27A',
    summary: 'A very positive moment',
  },
};

const LABELS: Record<ValenceKey, string[]> = {
  very_unpleasant: [
    'Panicked',
    'Consumed',
    'Unsafe',
    'Hopeless',
    'Shaken',
    'Overloaded',
    'Anguished',
    'Cornered',
  ],
  unpleasant: [
    'Restless',
    'Uneasy',
    'Lonely',
    'Tense',
    'Sad',
    'Triggered',
    'Drained',
    'Heavy',
    'Irritated',
  ],
  neutral: ['Steady', 'Calm', 'Okay', 'Balanced', 'Quiet', 'Blank', 'Grounded'],
  pleasant: [
    'Hopeful',
    'Relieved',
    'Grateful',
    'Proud',
    'Peaceful',
    'Clear',
    'Supported',
    'Encouraged',
  ],
  very_pleasant: [
    'Joyful',
    'Excited',
    'Happy',
    'Confident',
    'Content',
    'Brave',
    'Amazed',
    'Satisfied',
    'Proud',
  ],
};

const CONTEXTS = [
  'Work',
  'Health',
  'Family',
  'Social',
  'Recovery',
  'Craving',
  'Rest',
  'Support',
  'Routine',
  'Community',
];

export default function EmotionLogScreen() {
  const { saveMoodLog } = useApp();

  const [step, setStep] = useState<Step>('entry');
  const [mode, setMode] = useState<Mode>('emotion');
  const [valenceIndex, setValenceIndex] = useState(2);
  const [labels, setLabels] = useState<string[]>([]);
  const [contexts, setContexts] = useState<string[]>([]);

  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const valence = VALENCE_ORDER[valenceIndex];
  const meta = VALENCE_META[valence];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.04,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  const animateStepChange = (nextStep: Step) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(rise, {
          toValue: 8,
          duration: 140,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(rise, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setStep(nextStep);
  };

  const summaryTitle = useMemo(() => {
    if (labels.length) return labels.slice(0, 3).join(', ');
    return meta.title;
  }, [labels, meta.title]);

  const persistMoodLog = () => {
    saveMoodLog({
      title: summaryTitle,
      subtitle: meta.summary,
      contexts,
      labels,
      valence,
      createdAt: new Date().toISOString(),
    });
  };

  const onNext = () => {
    if (step === 'entry') return animateStepChange('valence');
    if (step === 'valence') return animateStepChange('labels');
    if (step === 'labels') {
      persistMoodLog();
      return animateStepChange('summary');
    }
    persistMoodLog();
    router.back();
  };

  const onBack = () => {
    if (step === 'valence') return animateStepChange('entry');
    if (step === 'labels') return animateStepChange('valence');
    if (step === 'summary') return animateStepChange('labels');
  };

  const toggleLabel = (label: string) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const toggleContext = (context: string) => {
    setContexts((prev) =>
      prev.includes(context)
        ? prev.filter((x) => x !== context)
        : [...prev, context]
    );
  };

  return (
    <LinearGradient colors={meta.colors} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.glow, { backgroundColor: meta.glow }]} />
      <View style={[styles.glowSmall, { backgroundColor: meta.glow }]} />

      <SafeAreaView style={styles.safe}>
        <FlowHeader
          title={step === 'entry' ? '' : mode === 'emotion' ? 'Emotion' : 'Mood'}
          showBack={step !== 'entry'}
          onBack={onBack}
          onClose={() => router.back()}
          tint={meta.bloom}
        />

        <Animated.View
          style={{
            flex: 1,
            opacity: fade,
            transform: [{ translateY: rise }],
          }}
        >
          {step === 'entry' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <View style={styles.entryTopIcons}>
                <MiniBloom color="#7DB8FF" />
                <MiniBloom color="#D7FF55" />
                <MiniBloom color="#FFC07C" big />
                <MiniBloom color="#9EEBFF" />
                <MiniBloom color="#8B6EFF" />
              </View>

              <Text style={styles.heroTitle}>Log an Emotion{'\n'}or Mood</Text>

              <ChoiceCard
                title="Emotion"
                subtitle="How you feel right now"
                meta={new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                selected={mode === 'emotion'}
                onPress={() => setMode('emotion')}
                icon="clock-outline"
              />

              <ChoiceCard
                title="Mood"
                subtitle="How you’ve felt overall today"
                selected={mode === 'mood'}
                onPress={() => setMode('mood')}
                icon="weather-sunset"
              />
            </ScrollView>
          )}

          {step === 'valence' && (
            <View style={styles.content}>
              <Text style={styles.heroTitle}>Choose how you’re{'\n'}feeling right now</Text>

              <Animated.View
                style={[styles.bloomWrap, { transform: [{ scale: pulse }] }]}
              >
                <EmotionBloom valence={valence} color={meta.bloom} />
              </Animated.View>

              <Text style={styles.valenceTitle}>{meta.title}</Text>

              <View style={styles.sliderTrack}>
                {VALENCE_ORDER.map((item, index) => (
                  <Pressable
                    key={item}
                    onPress={() => setValenceIndex(index)}
                    style={[
                      styles.sliderStep,
                      index === valenceIndex && styles.sliderStepActive,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.scaleRow}>
                <Text style={styles.scaleText}>VERY UNPLEASANT</Text>
                <Text style={styles.scaleText}>VERY PLEASANT</Text>
              </View>
            </View>
          )}

          {step === 'labels' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <View style={styles.labelsHeader}>
                <View style={styles.smallBloomWrap}>
                  <EmotionBloom valence={valence} color={meta.bloom} small />
                </View>
                <Text style={styles.valenceTitle}>{meta.title}</Text>
              </View>

              <Text style={styles.sectionTitle}>What best describes{'\n'}this feeling?</Text>
              <View style={styles.divider} />

              <View style={styles.chipWrap}>
                {LABELS[valence].map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    active={labels.includes(label)}
                    onPress={() => toggleLabel(label)}
                  />
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 18, fontSize: 20 }]}>
                Context
              </Text>
              <View style={styles.chipWrap}>
                {CONTEXTS.map((context) => (
                  <Chip
                    key={context}
                    label={context}
                    active={contexts.includes(context)}
                    onPress={() => toggleContext(context)}
                  />
                ))}
              </View>
            </ScrollView>
          )}

          {step === 'summary' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <Text style={styles.summaryDate}>
                Today,{' '}
                {new Date().toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>

              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.10)',
                  'rgba(255,255,255,0.06)',
                ]}
                style={styles.summaryCard}
              >
                <Text style={styles.summaryEyebrow}>STATE OF MIND</Text>

                <View style={styles.summaryBloom}>
                  <EmotionBloom valence={valence} color={meta.bloom} small />
                </View>

                <Text style={styles.summaryTitle}>{summaryTitle}</Text>
                <Text style={styles.summarySub}>{meta.summary}</Text>

                {!!contexts.length && (
                  <Text style={styles.summaryContexts}>{contexts.join(', ')}</Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.summaryEyebrow}>MOMENTARY EMOTIONS</Text>

                <View style={styles.summaryRow}>
                  <View style={styles.summaryRowLeft}>
                    <View style={styles.summaryIconMini}>
                      <EmotionBloom valence={valence} color={meta.bloom} tiny />
                    </View>
                    <View>
                      <Text style={styles.summaryRowTitle}>{meta.title}</Text>
                      <Text style={styles.summaryRowSub}>
                        {labels.length ? labels.join(', ') : 'No labels selected'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.summaryTime}>
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </LinearGradient>
            </ScrollView>
          )}
        </Animated.View>

        <BottomCTA
          label={step === 'summary' ? 'Done' : 'Next'}
          color={meta.cta}
          onPress={onNext}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

function FlowHeader({
  title,
  showBack,
  onBack,
  onClose,
  tint,
}: {
  title: string;
  showBack: boolean;
  onBack: () => void;
  onClose: () => void;
  tint: string;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        style={[styles.circleBtn, !showBack && { opacity: 0 }]}
      >
        <Ionicons name="chevron-back" size={28} color="#F6F7FB" />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>

      <Pressable
        onPress={onClose}
        style={[styles.circleBtn, { borderColor: tint + '55' }]}
      >
        <Ionicons name="close" size={28} color="#F6F7FB" />
      </Pressable>
    </View>
  );
}

function ChoiceCard({
  title,
  subtitle,
  meta,
  selected,
  onPress,
  icon,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  selected?: boolean;
  onPress: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceCard, selected && styles.choiceCardActive]}
    >
      <View style={styles.choiceTop}>
        <View style={styles.choiceLabelRow}>
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color="rgba(255,255,255,0.72)"
          />
          <Text style={styles.choiceLabel}>{title}</Text>
        </View>
        {selected ? (
          <Ionicons name="checkmark" size={30} color="#1E90FF" />
        ) : null}
      </View>

      <Text style={styles.choiceTitle}>{subtitle}</Text>
      {!!meta && <Text style={styles.choiceMeta}>{meta}</Text>}
    </Pressable>
  );
}

function BottomCTA({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.cta, { backgroundColor: color }]}>
      <Text style={styles.ctaText}>{label}</Text>
    </Pressable>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function MiniBloom({ color, big }: { color: string; big?: boolean }) {
  return (
    <View
      style={[
        styles.miniBloom,
        big && { width: 72, height: 72, borderRadius: 36 },
        { shadowColor: color },
      ]}
    >
      <View
        style={[
          styles.miniBloomInner,
          { backgroundColor: color },
        ]}
      />
    </View>
  );
}

function EmotionBloom({
  valence,
  color,
  small,
  tiny,
}: {
  valence: ValenceKey;
  color: string;
  small?: boolean;
  tiny?: boolean;
}) {
  const size = tiny ? 32 : small ? 108 : 248;
  const mid = tiny ? 20 : small ? 64 : 124;
  const inner = tiny ? 10 : small ? 30 : 56;

  if (valence === 'very_pleasant') {
    return (
      <View
        style={[
          styles.bloomOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: color,
          },
        ]}
      >
        {[0, 45, 90, 135].map((deg) => (
          <View
            key={deg}
            style={[
              styles.flowerPetal,
              {
                width: mid,
                height: size * 0.42,
                borderRadius: 999,
                backgroundColor: color + '44',
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.bloomInner,
            {
              width: inner,
              height: inner,
              borderRadius: inner / 2,
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        />
      </View>
    );
  }

  if (valence === 'pleasant') {
    return (
      <View
        style={[
          styles.bloomOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: color,
          },
        ]}
      >
        {[0, 60, 120].map((deg) => (
          <View
            key={deg}
            style={[
              styles.flowerPetal,
              {
                width: mid,
                height: size * 0.36,
                borderRadius: 999,
                backgroundColor: color + '38',
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.bloomRing,
            {
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: 999,
              borderColor: color + '88',
            },
          ]}
        />
        <View
          style={[
            styles.bloomInner,
            {
              width: inner,
              height: inner,
              borderRadius: inner / 2,
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        />
      </View>
    );
  }

  if (valence === 'neutral') {
    return (
      <View
        style={[
          styles.bloomOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: color,
          },
        ]}
      >
        <View
          style={[
            styles.bloomRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color + '66',
            },
          ]}
        />
        <View
          style={[
            styles.bloomRing,
            {
              width: mid,
              height: mid,
              borderRadius: mid / 2,
              borderColor: color + '99',
            },
          ]}
        />
        <View
          style={[
            styles.bloomInner,
            {
              width: inner,
              height: inner,
              borderRadius: inner / 2,
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        />
      </View>
    );
  }

  if (valence === 'unpleasant') {
    return (
      <View
        style={[
          styles.bloomOuter,
          {
            width: size,
            height: size,
            shadowColor: color,
          },
        ]}
      >
        {[0, 45, 90, 135].map((deg) => (
          <View
            key={deg}
            style={[
              styles.sharpRay,
              {
                width: 6,
                height: size * 0.42,
                borderRadius: 999,
                backgroundColor: color + '55',
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.bloomRing,
            {
              width: mid,
              height: mid,
              borderRadius: mid / 2,
              borderColor: color + '99',
            },
          ]}
        />
        <View
          style={[
            styles.bloomInner,
            {
              width: inner,
              height: inner,
              borderRadius: inner / 2,
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.bloomOuter,
        {
          width: size,
          height: size,
          shadowColor: color,
        },
      ]}
    >
      {[0, 30, 60, 90, 120, 150].map((deg) => (
        <View
          key={deg}
          style={[
            styles.sharpRay,
            {
              width: 4,
              height: size * 0.46,
              borderRadius: 999,
              backgroundColor: color + '60',
              transform: [{ rotate: `${deg}deg` }],
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.bloomInner,
          {
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#10151E',
  },
  safe: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    width: 340,
    height: 340,
    borderRadius: 170,
    opacity: 0.28,
  },
  glowSmall: {
    position: 'absolute',
    bottom: 120,
    left: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerTitle: {
    color: '#F6F7FB',
    fontSize: 18,
    fontWeight: '700',
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },

  entryTopIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    marginBottom: 24,
  },
  heroTitle: {
    color: '#F6F7FB',
    textAlign: 'center',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    marginBottom: 24,
  },

  choiceCard: {
    backgroundColor: 'rgba(25, 29, 36, 0.74)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 18,
    minHeight: 146,
    marginBottom: 16,
  },
  choiceCardActive: {
    backgroundColor: 'rgba(28, 31, 38, 0.92)',
  },
  choiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choiceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    fontWeight: '700',
  },
  choiceTitle: {
    marginTop: 10,
    color: '#F6F7FB',
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800',
    maxWidth: '84%',
  },
  choiceMeta: {
    marginTop: 10,
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: '800',
  },

  bloomWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  valenceTitle: {
    color: '#F6F7FB',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 24,
  },

  sliderTrack: {
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    marginTop: 'auto',
    marginHorizontal: 16,
  },
  sliderStep: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  sliderStepActive: {
    backgroundColor: '#FFFFFF',
  },
  scaleRow: {
    marginHorizontal: 18,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 13,
    fontWeight: '800',
  },

  labelsHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  smallBloomWrap: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#F6F7FB',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 16,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  chipText: {
    color: '#F6F7FB',
    fontSize: 16,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  summaryDate: {
    color: '#F6F7FB',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  summaryCard: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 20,
  },
  summaryEyebrow: {
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryBloom: {
    alignItems: 'center',
    marginVertical: 16,
  },
  summaryTitle: {
    color: '#F6F7FB',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  summarySub: {
    color: '#F6F7FB',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    opacity: 0.92,
  },
  summaryContexts: {
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  summaryIconMini: {
    marginRight: 10,
  },
  summaryRowTitle: {
    color: '#F6F7FB',
    fontSize: 18,
    fontWeight: '800',
  },
  summaryRowSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    marginTop: 2,
    maxWidth: 190,
  },
  summaryTime: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    fontWeight: '700',
  },

  cta: {
    marginHorizontal: 16,
    marginBottom: 22,
    borderRadius: 24,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#F6F7FB',
    fontSize: 18,
    fontWeight: '800',
  },

  miniBloom: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 6,
  },
  miniBloomInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },

  bloomOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.42,
    shadowRadius: 30,
    elevation: 8,
  },
  bloomRing: {
    position: 'absolute',
    borderWidth: 1.2,
    backgroundColor: 'transparent',
  },
  bloomInner: {
    shadowOpacity: 0.36,
    shadowRadius: 28,
    elevation: 6,
  },
  flowerPetal: {
    position: 'absolute',
    alignSelf: 'center',
  },
  sharpRay: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
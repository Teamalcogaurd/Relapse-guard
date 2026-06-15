import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { colors, radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const slides = [
  {
    eyebrow: 'Recovery support',
    title: 'A calm companion for recovery',
    body: 'RelapseGaurd helps you stay aware of how you feel, respond to cravings, and find support when you need it most.'
  },
  {
    eyebrow: 'In difficult moments',
    title: 'Support that meets you where you are',
    body: 'Use breathing, grounding, journaling, and quick tools designed to help you pause, regulate, and regain clarity.'
  },
  {
    eyebrow: 'Gentle progress',
    title: 'Progress without pressure',
    body: 'Track check-ins, cravings, and recovery streaks in a way that feels honest, calm, and encouraging.'
  }
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { completeOnboarding } = useApp();

  const item = useMemo(() => slides[index], [index]);

  const handleNext = () => {
    if (index < slides.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }
    completeOnboarding();
    router.replace('/(public)/login');
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <Pressable onPress={() => router.replace('/(public)/login')} style={styles.skipWrap}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.illustrationOuter}>
            <View style={styles.illustrationRing} />
            <View style={styles.illustrationCore} />
            <View style={styles.illustrationSmall} />
          </View>

          <Text style={styles.eyebrow}>{item.eyebrow}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>

        <GlassCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>Built to feel safe and simple</Text>
          <Text style={styles.noteBody}>
            Nothing here is meant to overwhelm you. The app keeps help close, keeps pressure low, and helps you steady yourself one step at a time.
          </Text>
        </GlassCard>

        <View style={styles.bottom}>
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <AppButton
            label={index === slides.length - 1 ? 'Get started' : 'Continue'}
            onPress={handleNext}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8
  },
  skipWrap: {
    alignSelf: 'flex-end',
    paddingVertical: 8
  },
  skip: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600'
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 12
  },
  illustrationOuter: {
    width: 220,
    height: 220,
    borderRadius: 220,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.border
  },
  illustrationRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 170,
    borderWidth: 1,
    borderColor: 'rgba(142,146,255,0.24)'
  },
  illustrationCore: {
    width: 96,
    height: 96,
    borderRadius: 96,
    backgroundColor: 'rgba(119,224,216,0.16)'
  },
  illustrationSmall: {
    position: 'absolute',
    right: 40,
    top: 52,
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(178,156,255,0.38)'
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center'
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 10
  },
  noteCard: {
    borderRadius: radii.lg,
    marginBottom: 18
  },
  noteTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8
  },
  noteBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  bottom: {
    paddingBottom: 12
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    marginHorizontal: 5
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary
  }
});

import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { AppButton } from '@/components/AppButton';
import { colors } from '@/constants/theme';

const SUPPORT_MESSAGE =
  "I'm having a difficult moment right now and need support. Can you stay with me for a bit?";

const MODES = [
  {
    id: 'calm',
    label: 'Calm down',
    accent: '#6A8FE8',
    tint: '#EEF3FF',
    icon: 'water-outline' as const,
    title: 'Start with your body',
    text: 'Slow the intensity first.',
    primaryLabel: 'Start breathing',
    primaryAction: 'breathing',
    secondaryLabel: 'Open grounding',
    secondaryAction: 'grounding',
  },
  {
    id: 'contact',
    label: 'Reach someone',
    accent: '#56A97A',
    tint: '#EEF8F1',
    icon: 'call-outline' as const,
    title: 'Do not carry this alone',
    text: 'Use the fastest support path.',
    primaryLabel: 'Call support',
    primaryAction: 'call',
    secondaryLabel: 'Send message',
    secondaryAction: 'message',
  },
  {
    id: 'leave',
    label: 'Leave trigger',
    accent: '#D28A47',
    tint: '#FBF3E8',
    icon: 'walk-outline' as const,
    title: 'Create distance now',
    text: 'Move away from the trigger.',
    primaryLabel: 'Open grounding',
    primaryAction: 'grounding',
    secondaryLabel: 'Start breathing',
    secondaryAction: 'breathing',
  },
  {
    id: 'unsafe',
    label: 'Unsafe',
    accent: '#D86D7C',
    tint: '#FBEFF2',
    icon: 'shield-outline' as const,
    title: 'Use strongest support',
    text: 'Get direct help right away.',
    primaryLabel: 'Call emergency',
    primaryAction: 'emergency',
    secondaryLabel: 'Call support',
    secondaryAction: 'call',
  },
];

const QUICK_STEPS = [
  { id: 'water', text: 'Drink water', icon: 'water-outline' as const },
  { id: 'move', text: 'Move away from the trigger', icon: 'walk-outline' as const },
  { id: 'person', text: 'Sit near someone', icon: 'people-outline' as const },
  { id: 'breath', text: 'Stay for one minute', icon: 'leaf-outline' as const },
];

export default function EmergencyScreen() {
  const [selectedModeId, setSelectedModeId] = useState('calm');

  const selectedMode =
    MODES.find((mode) => mode.id === selectedModeId) ?? MODES[0];

  const doAction = async (action: string) => {
    const trustedNumber = '9999999999';

    try {
      if (action === 'breathing') {
        router.push('/support/breathing');
        return;
      }

      if (action === 'grounding') {
        router.push('/support/grounding');
        return;
      }

      if (action === 'call') {
        await Linking.openURL(`tel:${trustedNumber}`);
        return;
      }

      if (action === 'message') {
        await Linking.openURL(
          `sms:${trustedNumber}?body=${encodeURIComponent(SUPPORT_MESSAGE)}`
        );
        return;
      }

      if (action === 'emergency') {
        await Linking.openURL('tel:112');
      }
    } catch (error) {
      console.log('Action failed', error);
    }
  };

  const heroLine = useMemo(() => {
    if (selectedModeId === 'calm') return 'Let’s make this moment smaller.';
    if (selectedModeId === 'contact') return 'Support can be immediate.';
    if (selectedModeId === 'leave') return 'Create distance from the urge.';
    return 'Choose the strongest next step.';
  }, [selectedModeId]);

  return (
    <Screen>
      <Text style={styles.eyebrow}>Emergency support</Text>
      <Text style={styles.title}>Need support right now?</Text>
      <Text style={styles.subtitle}>
        Choose one next step. That is enough.
      </Text>

      <GlassCard style={styles.heroCard}>
        <LinearGradient
          colors={['#FFFDFC', selectedMode.tint, '#FFF8F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <View style={[styles.heroIconWrap, { backgroundColor: selectedMode.tint }]}>
              <Ionicons
                name={selectedMode.icon}
                size={26}
                color={selectedMode.accent}
              />
            </View>

            <View style={styles.heroPill}>
              <Text style={[styles.heroPillText, { color: selectedMode.accent }]}>
                Right now
              </Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: selectedMode.accent }]}>
            {heroLine}
          </Text>

          <View style={styles.modeWrap}>
            {MODES.map((mode) => {
              const active = mode.id === selectedModeId;

              return (
                <Pressable
                  key={mode.id}
                  onPress={() => setSelectedModeId(mode.id)}
                  style={[
                    styles.modeChip,
                    active && {
                      backgroundColor: mode.tint,
                      borderColor: mode.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modeChipText,
                      active && { color: mode.accent },
                    ]}
                  >
                    {mode.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.actionCard, { backgroundColor: '#FFFDFC' }]}>
            <Text style={styles.actionCardTitle}>{selectedMode.title}</Text>
            <Text style={styles.actionCardText}>{selectedMode.text}</Text>

            <View style={styles.actionButtons}>
              <AppButton
                label={selectedMode.primaryLabel}
                onPress={() => doAction(selectedMode.primaryAction)}
              />
              <View style={{ height: 10 }} />
              <AppButton
                label={selectedMode.secondaryLabel}
                variant="secondary"
                onPress={() => doAction(selectedMode.secondaryAction)}
              />
            </View>
          </View>
        </LinearGradient>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Quick steps</Text>

        <View style={styles.quickWrap}>
          {QUICK_STEPS.map((step) => (
            <View key={step.id} style={styles.quickCard}>
              <View style={styles.quickIcon}>
                <Ionicons name={step.icon} size={17} color={colors.brown} />
              </View>
              <Text style={styles.quickText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Serious right now?</Text>
        <View style={{ height: 10 }} />
        <AppButton label="Call emergency services" onPress={() => doAction('emergency')} />
      </GlassCard>

      <Text style={styles.footerText}>
        Stay with the next minute, not the whole night.
      </Text>
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
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
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
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPill: {
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroPillText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginBottom: 14,
  },

  modeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
    marginRight: 8,
    marginBottom: 8,
  },
  modeChipText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
  },

  actionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 14,
  },
  actionCardTitle: {
    color: colors.heading,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionCardText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionButtons: {
    marginTop: 2,
  },

  card: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 17,
    fontWeight: '800',
  },

  quickWrap: {
    marginTop: 12,
    gap: 10,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
    borderRadius: 18,
    padding: 13,
  },
  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.cardPeach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    color: colors.heading,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },

  footerText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 20,
  },
});
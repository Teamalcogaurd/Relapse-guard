import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppTextInput } from '@/components/AppTextInput';
import { Chip } from '@/components/Chip';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { supportToolOptions, triggerOptions } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { SupportTool, Trigger } from '@/types';

const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Late night'];
const goalOptions = [
  'Stay sober today',
  'Get through cravings safely',
  'Build a 7-day streak',
  'Feel more in control',
];

export default function CalibrationScreen() {
  const { finishCalibration } = useApp();
  const [triggers, setTriggers] = useState<Trigger[]>(['Stress']);
  const [times, setTimes] = useState<string[]>(['Late night']);
  const [tools, setTools] = useState<SupportTool[]>(['Breathing']);
  const [goal, setGoal] = useState('Stay sober today');
  const [emergencyContact, setEmergencyContact] = useState('Trusted friend');

  const toggleValue = <T extends string>(
    value: T,
    list: T[],
    setList: (items: T[]) => void
  ) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const handleFinish = () => {
    finishCalibration({ triggers, times, tools, goal, emergencyContact });

    router.replace('/(tabs)');

    setTimeout(() => {
      router.push('/emotion-log');
    }, 350);
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Personal setup</Text>
      <Text style={styles.title}>Let’s shape your support baseline.</Text>
      <Text style={styles.subtitle}>
        This takes a minute and helps the app bring the right kind of support
        closer, faster.
      </Text>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Common triggers</Text>
        <Text style={styles.sectionSubtitle}>
          Pick what tends to show up most often.
        </Text>
        <View style={styles.wrap}>
          {triggerOptions.map((item) => (
            <Chip
              key={item}
              label={item}
              active={triggers.includes(item)}
              onPress={() => toggleValue(item, triggers, setTriggers)}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Hard times of day</Text>
        <Text style={styles.sectionSubtitle}>
          Choose when support matters most.
        </Text>
        <View style={styles.wrap}>
          {timeOptions.map((item) => (
            <Chip
              key={item}
              label={item}
              active={times.includes(item)}
              onPress={() => toggleValue(item, times, setTimes)}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Preferred tools</Text>
        <Text style={styles.sectionSubtitle}>
          The fastest path back to steady.
        </Text>
        <View style={styles.wrap}>
          {supportToolOptions.map((item) => (
            <Chip
              key={item}
              label={item}
              active={tools.includes(item)}
              onPress={() => toggleValue(item, tools, setTools)}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Recovery goal</Text>
        <Text style={styles.sectionSubtitle}>
          Choose what matters most right now.
        </Text>
        <View style={styles.wrap}>
          {goalOptions.map((item) => (
            <Chip
              key={item}
              label={item}
              active={goal === item}
              onPress={() => setGoal(item)}
            />
          ))}
        </View>

        <View style={{ height: 12 }} />

        <AppTextInput
          label="Emergency contact preference"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Sponsor, sibling, trusted friend..."
        />
      </GlassCard>

      <AppButton
        label="My baseline is ready"
        style={{ marginTop: 8 }}
        onPress={handleFinish}
      />

      <Text style={styles.note}>
        Your support space will now feel more personal, calm, and useful.
      </Text>
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
    color: colors.text,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  card: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  note: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
  },
});
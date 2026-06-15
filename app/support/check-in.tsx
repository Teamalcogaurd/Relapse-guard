import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { Chip } from '@/components/Chip';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { moodOptions } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Mood } from '@/types';

export default function CheckInScreen() {
  const { addCheckIn } = useApp();
  const [mood, setMood] = useState<Mood>('Calm');
  const [cravingLevel, setCravingLevel] = useState(3);
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [confidence, setConfidence] = useState(7);
  const [reflection, setReflection] = useState('steady');

  const ScaleRow = ({ label, value, setValue }: { label: string; value: number; setValue: (v: number) => void }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}: {value}/10</Text>
      <View style={styles.wrap}>{[1,3,5,7,9].map((item) => <Chip key={item} label={`${item}`} active={value === item} onPress={() => setValue(item)} />)}</View>
    </View>
  );

  return (
    <Screen>
      <Text style={styles.title}>Daily check-in</Text>
      <Text style={styles.subtitle}>Fast, honest, and useful.</Text>
      <GlassCard style={{ marginTop: 20 }}>
        <Text style={styles.label}>Mood</Text>
        <View style={styles.wrap}>{moodOptions.map((item) => <Chip key={item} label={item} active={mood === item} onPress={() => setMood(item as Mood)} />)}</View>
        <ScaleRow label="Craving level" value={cravingLevel} setValue={setCravingLevel} />
        <ScaleRow label="Stress" value={stress} setValue={setStress} />
        <ScaleRow label="Energy" value={energy} setValue={setEnergy} />
        <ScaleRow label="Confidence" value={confidence} setValue={setConfidence} />
        <Text style={styles.label}>One-word reflection</Text>
        <View style={styles.wrap}>{['steady','tired','hopeful','shaky','proud'].map((item) => <Chip key={item} label={item} active={reflection === item} onPress={() => setReflection(item)} />)}</View>
        <AppButton label="Save check-in" onPress={() => addCheckIn({ mood, cravingLevel, stress, energy, confidence, reflection })} />
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 12 },
  subtitle: { color: colors.textMuted, marginTop: 8, fontSize: 15 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' }
});

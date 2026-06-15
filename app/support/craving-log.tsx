import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { AppButton } from '@/components/AppButton';
import { AppTextInput } from '@/components/AppTextInput';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { CravingEntry, RecoveryVideo } from '@/types';
import { getVideoRecommendations, logVideoInteraction } from '@/services/videoRecommendationService';

const URGE_STATES = [
  'Restless',
  'Triggered',
  'Heavy',
  'Anxious',
  'Overwhelmed',
  'Lonely',
  'Tense',
  'Numb',
];

const TRIGGERS = [
  'Stress',
  'Alone',
  'Conflict',
  'Social pressure',
  'Boredom',
  'Night time',
  'Routine',
  'Craving wave',
];

const SUPPORT_CHOICES = [
  'Drink water',
  'Step outside',
  'Call someone',
  'Grounding',
  'Breathing',
  'Journal',
  'Move away',
  'Sit with someone',
];

type SavedCraving = CravingEntry;

export default function CravingLogScreen() {
  const { saveCravingEntry } = useApp();
  const [intensity, setIntensity] = useState<number>(4);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<SavedCraving[]>([]);
  const [showVideos, setShowVideos] = useState(false);
  const [recommendedVideo, setRecommendedVideo] = useState<RecoveryVideo | null>(null);

  const tone = useMemo(() => {
    if (intensity <= 3) {
      return {
        title: 'Low pull',
        text: 'Notice it early and stay ahead of it.',
        accent: colors.blueStrong,
        tint: colors.blueSoft,
      };
    }
    if (intensity <= 6) {
      return {
        title: 'Rising craving',
        text: 'This is a good moment to use support.',
        accent: colors.amberStrong,
        tint: colors.amber,
      };
    }
    return {
      title: 'High urge',
      text: 'Keep things simple. Choose the safest next step.',
      accent: colors.roseStrong,
      tint: colors.rose,
    };
  }, [intensity]);

  const toggleItem = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const saveEntry = async () => {
    const item: SavedCraving = {
      id: Date.now().toString(),
      intensity,
      states: selectedStates,
      triggers: selectedTriggers,
      supports: selectedSupports,
      note,
      date: new Date().toLocaleString(),
    };

    setEntries((prev) => [item, ...prev]);
    saveCravingEntry(item);

    const recommendations = await getVideoRecommendations({
      cravingIntensity: intensity,
      states: selectedStates,
      trigger: selectedTriggers.join(', ') || undefined,
      supports: selectedSupports,
      note: note || undefined,
    });

    if (recommendations.length > 0) {
      setRecommendedVideo(recommendations[0]);
      setShowVideos(true);
    }

    setIntensity(4);
    setSelectedStates([]);
    setSelectedTriggers([]);
    setSelectedSupports([]);
    setNote('');
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Support</Text>
      <Text style={styles.title}>Craving journal</Text>
      <Text style={styles.subtitle}>Log it quickly. Move forward safely.</Text>

      <GlassCard style={styles.heroCard}>
        <View style={[styles.heroBadge, { backgroundColor: tone.tint }]}>
          <Text style={[styles.heroBadgeText, { color: tone.accent }]}>
            {tone.title}
          </Text>
        </View>

        <Text style={styles.heroText}>{tone.text}</Text>

        <Text style={styles.sectionTitle}>Intensity</Text>
        <View style={styles.intensityRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => {
            const active = value === intensity;

            return (
              <Pressable
                key={value}
                onPress={() => setIntensity(value)}
                style={[
                  styles.intensityDot,
                  active && {
                    backgroundColor: tone.accent,
                    borderColor: tone.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.intensityText,
                    active && styles.intensityTextActive,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Feeling</Text>

        <View style={styles.chipWrap}>
          {URGE_STATES.map((item) => {
            const active = selectedStates.includes(item);

            return (
              <ChoiceChip
                key={item}
                label={item}
                active={active}
                onPress={() => toggleItem(item, selectedStates, setSelectedStates)}
                accent={tone.accent}
              />
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Trigger</Text>

        <View style={styles.chipWrap}>
          {TRIGGERS.map((item) => {
            const active = selectedTriggers.includes(item);

            return (
              <ChoiceChip
                key={item}
                label={item}
                active={active}
                onPress={() => toggleItem(item, selectedTriggers, setSelectedTriggers)}
                accent={tone.accent}
              />
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>What helps</Text>

        <View style={styles.chipWrap}>
          {SUPPORT_CHOICES.map((item) => {
            const active = selectedSupports.includes(item);

            return (
              <ChoiceChip
                key={item}
                label={item}
                active={active}
                onPress={() => toggleItem(item, selectedSupports, setSelectedSupports)}
                accent={tone.accent}
              />
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Add a note</Text>

        <AppTextInput
          label="Note"
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Write a few words..."
        />

        <AppButton label="Save" onPress={saveEntry} />
      </GlassCard>

      {showVideos && recommendedVideo ? (
        <GlassCard style={styles.videoCard}>
          <Text style={styles.videoCardTitle}>💡 Quick recovery support</Text>
          <Text style={styles.videoTitle}>{recommendedVideo.title}</Text>
          <Text style={styles.videoDesc}>{recommendedVideo.description}</Text>

          <View style={styles.videoDuration}>
            <Text style={styles.videoDurationText}>{recommendedVideo.duration} min</Text>
          </View>

          <AppButton
            label="Play video"
            onPress={async () => {
              await logVideoInteraction(recommendedVideo.id, 'watched');
              Linking.openURL(recommendedVideo.videoUrl).catch(() => {
                console.warn('Unable to open video URL', recommendedVideo.videoUrl);
              });
            }}
          />

          <AppButton
            label="Maybe later"
            variant="secondary"
            onPress={() => {
              setShowVideos(false);
            }}
            style={{ marginTop: 8 }}
          />
        </GlassCard>
      ) : null}

      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <Text style={styles.recentMeta}>{entries.length} saved</Text>
      </View>

      {entries.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptyText}>Saved logs will appear here.</Text>
        </GlassCard>
      ) : (
        entries.map((entry) => (
          <GlassCard key={entry.id} style={styles.entryCard}>
            <View style={styles.entryTop}>
              <View
                style={[
                  styles.entryPill,
                  {
                    backgroundColor:
                      entry.intensity <= 3
                        ? colors.blueSoft
                        : entry.intensity <= 6
                        ? colors.amber
                        : colors.rose,
                  },
                ]}
              >
                <Text style={styles.entryPillText}>Level {entry.intensity}</Text>
              </View>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>

            {!!entry.states.length && (
              <Text style={styles.entryLine}>
                <Text style={styles.entryLabel}>Feel: </Text>
                {entry.states.join(', ')}
              </Text>
            )}

            {!!entry.triggers.length && (
              <Text style={styles.entryLine}>
                <Text style={styles.entryLabel}>Trigger: </Text>
                {entry.triggers.join(', ')}
              </Text>
            )}

            {!!entry.supports.length && (
              <Text style={styles.entryLine}>
                <Text style={styles.entryLabel}>Help: </Text>
                {entry.supports.join(', ')}
              </Text>
            )}

            {!!entry.note.trim() && (
              <Text style={styles.entryNote}>{entry.note}</Text>
            )}
          </GlassCard>
        ))
      )}
    </Screen>
  );
}

function ChoiceChip({
  label,
  active,
  onPress,
  accent,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accent: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceChip,
        active && {
          borderColor: accent,
          backgroundColor: accent + '12',
        },
      ]}
    >
      <Text
        style={[
          styles.choiceChipText,
          active && { color: accent },
        ]}
      >
        {label}
      </Text>
    </Pressable>
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
    marginBottom: 14,
  },

  heroCard: {
    marginBottom: 16,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: 10,
  },

  sectionTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 10,
  },

  intensityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intensityDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  intensityText: {
    color: colors.heading,
    fontSize: 13,
    fontWeight: '800',
  },
  intensityTextActive: {
    color: colors.white,
  },

  card: {
    marginBottom: 16,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
    marginRight: 8,
    marginBottom: 8,
  },
  choiceChipText: {
    color: colors.textSoft,
    fontSize: 12.5,
    fontWeight: '800',
  },

  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentMeta: {
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: '700',
  },

  emptyCard: {
    marginBottom: 14,
  },
  emptyTitle: {
    color: colors.heading,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  entryCard: {
    marginBottom: 12,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  entryPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  entryPillText: {
    color: colors.heading,
    fontSize: 12.5,
    fontWeight: '800',
  },
  entryDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  entryLine: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: 6,
  },
  entryLabel: {
    color: colors.heading,
    fontWeight: '800',
  },
  entryNote: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 6,
  },

  videoCard: {
    marginBottom: 16,
    borderColor: colors.blueStrong,
  },
  videoCardTitle: {
    color: colors.blueStrong,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  videoTitle: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  videoDesc: {
    color: colors.textSoft,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  videoDuration: {
    backgroundColor: colors.cardSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  videoDurationText: {
    color: colors.heading,
    fontSize: 12,
    fontWeight: '800',
  },
});
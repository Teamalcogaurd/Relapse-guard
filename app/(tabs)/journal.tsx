import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { moodOptions } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Mood } from '@/types';

const PROMPTS = [
  'What helped today?',
  'What felt hard?',
  'What am I proud of?',
  'What do I need next?',
];

const QUICK_TAGS = ['Craving', 'Stress', 'Trigger', 'Win'];

export default function JournalScreen() {
  const { journals, addJournal } = useApp();

  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood | undefined>();
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const canSave = useMemo(() => body.trim().length > 0, [body]);
  const entryCount = (journals ?? []).length;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const onSave = () => {
    if (!canSave) return;

    addJournal({
      title: selectedPrompt || 'Daily reflection',
      body: body.trim(),
      mood,
      tags: [
        ...(mood ? [mood.toLowerCase()] : []),
        ...selectedTags,
      ],
    });

    setBody('');
    setMood(undefined);
    setSelectedPrompt('');
    setSelectedTags([]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Journal</Text>
          <Text style={styles.title}>Write it down</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="book-heart-outline" size={22} color={colors.brown} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <LinearGradient
          colors={['#FFFDFC', '#F4F0FD', '#FFF2EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="feather" size={30} color={colors.lavenderStrong} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>A few honest lines are enough.</Text>
            <Text style={styles.heroText}>Capture the moment. You can keep it short.</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.writeCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>New entry</Text>
          <Text style={styles.cardMeta}>{body.trim().length} chars</Text>
        </View>

        <Text style={styles.fieldLabel}>Mood</Text>
        <View style={styles.moodRow}>
          {(moodOptions ?? []).map((item) => {
            const active = mood === item;
            return (
              <Pressable
                key={item}
                onPress={() => setMood(active ? undefined : (item as Mood))}
                style={[styles.moodPill, active && styles.moodPillActive]}
              >
                <Text style={[styles.moodText, active && styles.moodTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Prompt</Text>
        <View style={styles.promptGrid}>
          {PROMPTS.map((prompt) => {
            const active = selectedPrompt === prompt;
            return (
              <Pressable
                key={prompt}
                onPress={() => setSelectedPrompt(active ? '' : prompt)}
                style={[styles.promptPill, active && styles.promptPillActive]}
              >
                <Text style={[styles.promptText, active && styles.promptTextActive]} numberOfLines={2}>
                  {prompt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
          placeholder={selectedPrompt || 'Write a few lines...'}
          placeholderTextColor={colors.textMuted}
          style={styles.noteInput}
        />

        <View style={styles.tagsRow}>
          {QUICK_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                style={[styles.tagPill, active && styles.tagPillActive]}
              >
                <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={onSave}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>Save entry</Text>
          <Ionicons name="checkmark" size={18} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent entries</Text>
        <Text style={styles.recentMeta}>{entryCount} saved</Text>
      </View>

      {entryCount === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="notebook-outline" size={24} color={colors.lavenderStrong} />
          </View>
          <View style={styles.emptyCopy}>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptyText}>Your reflections will appear here after you save.</Text>
          </View>
        </View>
      ) : (
        (journals ?? []).map((entry) => <JournalEntry key={entry.id} entry={entry} />)
      )}
    </Screen>
  );
}

function JournalEntry({ entry }: { entry: any }) {
  const tags = entry.tags?.filter((tag: string) => tag !== entry.mood?.toLowerCase()) ?? [];

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryTop}>
        <View style={styles.entryIcon}>
          <MaterialCommunityIcons name="notebook-check-outline" size={21} color={colors.brown} />
        </View>
        <View style={styles.entryCopy}>
          <Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text>
          <Text style={styles.entryDate}>{entry.date}</Text>
        </View>
        {!!entry.mood && (
          <View style={styles.entryMood}>
            <Text style={styles.entryMoodText}>{entry.mood}</Text>
          </View>
        )}
      </View>

      <Text style={styles.entryBody} numberOfLines={4}>{entry.body}</Text>

      {!!tags.length && (
        <View style={styles.entryTags}>
          {tags.slice(0, 3).map((tag: string) => (
            <View key={tag} style={styles.entryTag}>
              <Text style={styles.entryTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 18,
    minHeight: 78,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: colors.heading,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '900',
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: '#B78F84',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  heroGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardLavender,
    marginRight: 14,
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    color: colors.heading,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  writeCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#B78F84',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.heading,
    fontSize: 20,
    fontWeight: '900',
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 8,
  },
  moodPill: {
    minHeight: 36,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moodPillActive: {
    backgroundColor: colors.cardLavender,
    borderColor: colors.lavenderStrong,
  },
  moodText: {
    color: colors.textSoft,
    fontSize: 12.5,
    fontWeight: '800',
  },
  moodTextActive: {
    color: colors.lavenderStrong,
  },
  promptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  promptPill: {
    width: '48.5%',
    minHeight: 52,
    borderRadius: 17,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.cardSoft,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    justifyContent: 'center',
  },
  promptPillActive: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blueStrong,
  },
  promptText: {
    color: colors.heading,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '800',
  },
  promptTextActive: {
    color: colors.blueStrong,
  },
  noteInput: {
    minHeight: 148,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
    color: colors.heading,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.cardSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagPillActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sageStrong,
  },
  tagText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
  },
  tagTextActive: {
    color: colors.sageStrong,
  },
  saveButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 21,
    fontWeight: '900',
  },
  recentMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardLavender,
    marginRight: 12,
  },
  emptyCopy: {
    flex: 1,
  },
  emptyTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  entryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  entryIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardPeach,
    marginRight: 10,
  },
  entryCopy: {
    flex: 1,
    minWidth: 0,
  },
  entryTitle: {
    color: colors.heading,
    fontSize: 15.5,
    fontWeight: '900',
    marginBottom: 3,
  },
  entryDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  entryMood: {
    borderRadius: 999,
    backgroundColor: colors.cardLavender,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 8,
  },
  entryMoodText: {
    color: colors.lavenderStrong,
    fontSize: 11,
    fontWeight: '900',
  },
  entryBody: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  entryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
  },
  entryTag: {
    borderRadius: 999,
    backgroundColor: colors.cardSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  entryTagText: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
  },
});

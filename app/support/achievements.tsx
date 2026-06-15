import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

type AchievementCategory = 'Foundation' | 'Momentum' | 'Resilience';
type ViewMode = 'Badges' | 'Stats';
type IconFamily = 'ion' | 'mci';

type Achievement = {
  id: string;
  title: string;
  category: AchievementCategory;
  icon: string;
  family: IconFamily;
  accent: string;
  tint: string;
  glow: string;
  unlockHint: string;
  current: number;
  target: number;
};

const CATEGORY_ORDER: AchievementCategory[] = ['Foundation', 'Momentum', 'Resilience'];

export default function AchievementsScreen() {
  const app = useApp();
  const [mode, setMode] = useState<ViewMode>('Badges');
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const latestMoodLog = app?.latestMoodLog ?? null;
  const journals = app?.journals ?? [];
  const moodCount = latestMoodLog ? 1 : 0;
  const journalCount = journals.length;
  const totalActions = moodCount + journalCount;
  const calmSessions = Math.max(0, totalActions - journalCount);

  const achievements: Achievement[] = useMemo(
    () => [
      badge('first_step', 'First Step', 'Foundation', 'diamond-stone', 'mci', '#42C878', colors.sage, '#C9F7D8', 'Open your recovery space', 1, 1),
      badge('mood_check', 'Mood Check', 'Foundation', 'emoticon-happy-outline', 'mci', colors.blueStrong, colors.blueSoft, '#C9DDFF', 'Log your mood once', moodCount, 1),
      badge('reflection', 'Reflection', 'Foundation', 'book-heart-outline', 'mci', colors.amberStrong, colors.amber, '#FFE4AF', 'Write your first journal entry', journalCount, 1),
      badge('showing_up', 'Showing Up', 'Momentum', 'leaf-circle-outline', 'mci', colors.sageStrong, colors.sage, '#CFEFD2', 'Complete 3 support actions', totalActions, 3),
      badge('weekly_rhythm', 'Weekly Rhythm', 'Momentum', 'crown-outline', 'mci', colors.lavenderStrong, colors.cardLavender, '#E6D8FF', 'Complete 7 support actions', totalActions, 7),
      badge('calm_practice', 'Calm Practice', 'Momentum', 'flower-outline', 'mci', '#20A7C9', '#DDF4FA', '#BDEDFC', 'Use 5 calm support moments', calmSessions, 5),
      badge('kept_going', 'Kept Going', 'Resilience', 'trophy-award', 'mci', colors.roseStrong, colors.rose, '#FFD0DA', 'Complete 12 support actions', totalActions, 12),
      badge('deep_work', 'Deep Work', 'Resilience', 'notebook-check-outline', 'mci', colors.lavenderStrong, colors.cardLavender, '#E6D8FF', 'Save 5 journal entries', journalCount, 5),
      badge('protector', 'Protector', 'Resilience', 'shield-star-outline', 'mci', colors.brown, '#F4E8E3', '#E8D1C6', 'Complete 20 support actions', totalActions, 20),
    ],
    [calmSessions, journalCount, moodCount, totalActions]
  );

  const unlockedItems = achievements.filter((item) => isUnlocked(item));
  const lockedItems = achievements.filter((item) => !isUnlocked(item));
  const unlockedCount = unlockedItems.length;
  const completion = Math.round((unlockedCount / achievements.length) * 100);
  const featured = unlockedItems[unlockedItems.length - 1] ?? achievements[0];
  const nextUnlock = lockedItems.slice().sort((a, b) => missingCount(a) - missingCount(b))[0];

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.07],
  });

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1150,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1150,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [entrance, pulse]);

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

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={21} color={colors.brown} />
            </Pressable>
            <Text style={styles.topTitle}>Achievements</Text>
            <View style={styles.iconButton}>
              <MaterialCommunityIcons name="medal-outline" size={21} color={colors.brown} />
            </View>
          </View>

          <View style={styles.segment}>
            {(['Badges', 'Stats'] as ViewMode[]).map((item) => (
              <Pressable
                key={item}
                onPress={() => setMode(item)}
                style={[styles.segmentItem, mode === item && styles.segmentItemActive]}
              >
                <Text style={[styles.segmentText, mode === item && styles.segmentTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Animated.View style={[styles.heroCard, riseIn]}>
            <LinearGradient
              colors={['#FFFDFC', '#F4F0FD', '#FFF2EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroTop}>
                <View style={styles.heroCopy}>
                  <Text style={styles.kicker}>My Achievements</Text>
                  <Text style={styles.heroTitle}>{unlockedCount} badges unlocked</Text>
                  <Text style={styles.heroSubtitle}>A calm record of the progress you keep choosing.</Text>
                </View>

                <Animated.View style={[styles.featureBadgeWrap, { transform: [{ scale: pulseScale }] }]}>
                  <BadgeMedal item={featured} size="large" unlocked />
                </Animated.View>
              </View>

              <View style={styles.completionTrack}>
                <View style={[styles.completionFill, { width: `${completion}%` }]} />
              </View>

              <View style={styles.summaryRow}>
                <Summary label="Unlocked" value={unlockedCount} />
                <Summary label="Locked" value={lockedItems.length} />
                <Summary label="Complete" value={`${completion}%`} />
              </View>
            </LinearGradient>
          </Animated.View>

          {mode === 'Badges' ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Badge Cabinet</Text>
                <Text style={styles.sectionMeta}>{unlockedCount}/{achievements.length}</Text>
              </View>

              {CATEGORY_ORDER.map((category) => {
                const items = achievements.filter((item) => item.category === category);

                return (
                  <View key={category} style={styles.categoryBlock}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryTitle}>{category}</Text>
                      <Text style={styles.categoryMeta}>{items.filter(isUnlocked).length}/{items.length}</Text>
                    </View>
                    <View style={styles.badgeGrid}>
                      {items.map((item, index) => (
                        <BadgeTile key={item.id} item={item} index={index} entrance={entrance} />
                      ))}
                    </View>
                  </View>
                );
              })}

              <LockedSection items={lockedItems} entrance={entrance} />
            </>
          ) : (
            <Animated.View style={[styles.statsCard, riseIn]}>
              <Text style={styles.sectionTitle}>Activity Stats</Text>
              <StatRow icon="medal-outline" label="Badge completion" value={`${completion}%`} color={colors.lavenderStrong} />
              <StatRow icon="check-circle-outline" label="Unlocked badges" value={`${unlockedCount}/${achievements.length}`} color={colors.sageStrong} />
              <StatRow icon="emoticon-happy-outline" label="Mood check-ins" value={moodCount} color={colors.blueStrong} />
              <StatRow icon="book-heart-outline" label="Journal entries" value={journalCount} color={colors.brown} />
              <StatRow icon="flag-outline" label="Next unlock" value={nextUnlock ? nextUnlock.title : 'Complete'} color={colors.amberStrong} />
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BadgeTile({ item, index, entrance }: { item: Achievement; index: number; entrance: Animated.Value }) {
  const unlocked = isUnlocked(item);

  return (
    <Animated.View
      style={[
        styles.badgeTile,
        !unlocked && styles.badgeTileLocked,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [18 + index * 3, 0],
              }),
            },
            {
              scale: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        },
      ]}
    >
      <BadgeMedal item={item} size="small" unlocked={unlocked} />
      <Text style={[styles.badgeTitle, !unlocked && styles.badgeTitleLocked]} numberOfLines={2}>{item.title}</Text>
      <Text style={[styles.badgeStatus, unlocked && { color: item.accent }]}>{unlocked ? 'Unlocked' : 'Locked'}</Text>
    </Animated.View>
  );
}

function LockedSection({ items, entrance }: { items: Achievement[]; entrance: Animated.Value }) {
  if (!items.length) {
    return (
      <Animated.View style={[styles.lockedPanel, { opacity: entrance }]}>
        <View style={styles.lockedHeader}>
          <Text style={styles.lockedTitle}>Locked Badges</Text>
          <Text style={styles.lockedMeta}>0 left</Text>
        </View>
        <Text style={styles.lockedComplete}>Every current badge is unlocked.</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.lockedPanel, { opacity: entrance }]}>
      <View style={styles.lockedHeader}>
        <Text style={styles.lockedTitle}>Locked Badges</Text>
        <Text style={styles.lockedMeta}>{items.length} left</Text>
      </View>
      {items.map((item) => (
        <View key={item.id} style={styles.lockedRow}>
          <View style={styles.lockedIcon}>
            <BadgeIcon item={item} color={colors.textMuted} size={20} locked />
          </View>
          <View style={styles.lockedCopy}>
            <Text style={styles.lockedName}>{item.title}</Text>
            <Text style={styles.lockedHint}>{item.unlockHint}</Text>
          </View>
          <Text style={styles.lockedProgress}>{Math.min(item.current, item.target)}/{item.target}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

function BadgeMedal({
  item,
  size,
  unlocked,
}: {
  item: Achievement;
  size: 'small' | 'large';
  unlocked: boolean;
}) {
  const outer = size === 'large' ? 92 : 62;
  const inner = size === 'large' ? 68 : 46;
  const icon = size === 'large' ? 34 : 23;
  const accent = unlocked ? item.accent : colors.textMuted;
  const tint = unlocked ? item.tint : '#F0E7E2';
  const glow = unlocked ? item.glow : '#E9DED8';

  return (
    <View style={[styles.medalOuter, { width: outer, height: outer, borderRadius: outer / 2, backgroundColor: colors.white }]}>
      <View style={[styles.medalColorRing, { width: outer - 8, height: outer - 8, borderRadius: outer / 2, backgroundColor: glow }]}>
        <View style={[styles.medalInnerGlow, { width: outer - 20, height: outer - 20, borderRadius: outer / 2, backgroundColor: tint }]} />
      </View>
      <View style={[styles.medalRing, { width: inner, height: inner, borderRadius: inner / 2, borderColor: accent }]}>
        {unlocked && <View style={[styles.medalSpark, size === 'large' && styles.medalSparkLarge]} />}
        <BadgeIcon item={item} color={accent} size={icon} locked={!unlocked} />
      </View>
    </View>
  );
}

function BadgeIcon({
  item,
  color,
  size,
  locked,
}: {
  item: Achievement;
  color: string;
  size: number;
  locked?: boolean;
}) {
  if (locked) {
    return <MaterialCommunityIcons name="lock-question" size={size} color={color} />;
  }

  if (item.family === 'mci') {
    return <MaterialCommunityIcons name={item.icon as any} size={size} color={color} />;
  }

  return <Ionicons name={item.icon as any} size={size} color={color} />;
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function StatRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={color} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function badge(
  id: string,
  title: string,
  category: AchievementCategory,
  icon: string,
  family: IconFamily,
  accent: string,
  tint: string,
  glow: string,
  unlockHint: string,
  current: number,
  target: number
): Achievement {
  return { id, title, category, icon, family, accent, tint, glow, unlockHint, current, target };
}

function isUnlocked(item: Achievement) {
  return item.current >= item.target;
}

function missingCount(item: Achievement) {
  return item.target - Math.min(item.current, item.target);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
  },
  topBar: {
    minHeight: 50,
    marginTop: 6,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topTitle: {
    color: colors.heading,
    fontSize: 21,
    fontWeight: '900',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#B78F84',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  segmentItem: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.cardLavender,
  },
  segmentText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: colors.lavenderStrong,
  },
  heroCard: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: '#B78F84',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  heroGradient: {
    padding: 18,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 12,
  },
  kicker: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  heroTitle: {
    color: colors.heading,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  heroSubtitle: {
    color: colors.textSoft,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  featureBadgeWrap: {
    width: 98,
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.borderSoft,
    overflow: 'hidden',
    marginBottom: 14,
  },
  completionFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.lavenderStrong,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 11,
    alignItems: 'center',
  },
  summaryValue: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '900',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 10.5,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 21,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.lavenderStrong,
    fontSize: 13,
    fontWeight: '900',
  },
  categoryBlock: {
    marginBottom: 18,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryTitle: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '900',
  },
  categoryMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeTile: {
    width: '31.5%',
    minHeight: 154,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  badgeTileLocked: {
    backgroundColor: '#FAF4F0',
  },
  medalOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: '#9F8175',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  medalColorRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalInnerGlow: {
    opacity: 0.9,
  },
  medalRing: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    overflow: 'hidden',
  },
  medalSpark: {
    position: 'absolute',
    right: 8,
    top: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.9,
    transform: [{ rotate: '45deg' }],
  },
  medalSparkLarge: {
    right: 12,
    top: 12,
    width: 11,
    height: 11,
    borderRadius: 5,
  },
  badgeTitle: {
    color: colors.heading,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '900',
    textAlign: 'center',
    minHeight: 34,
    marginTop: 12,
  },
  badgeTitleLocked: {
    color: colors.textSoft,
  },
  badgeStatus: {
    color: colors.textMuted,
    fontSize: 11.5,
    fontWeight: '800',
    marginTop: 3,
  },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  nextIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
    marginRight: 12,
  },
  nextCopy: {
    flex: 1,
  },
  nextLabel: {
    color: colors.amberStrong,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nextTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '900',
  },
  nextMeta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '900',
  },
  lockedPanel: {
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  lockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lockedTitle: {
    color: colors.heading,
    fontSize: 17,
    fontWeight: '900',
  },
  lockedMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  lockedComplete: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: 10,
    marginTop: 10,
  },
  lockedIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E7E2',
    marginRight: 11,
  },
  lockedCopy: {
    flex: 1,
    minWidth: 0,
  },
  lockedName: {
    color: colors.heading,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 3,
  },
  lockedHint: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  lockedProgress: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 10,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  statRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statLabel: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '800',
  },
  statValue: {
    color: colors.heading,
    fontSize: 14,
    fontWeight: '900',
    maxWidth: 130,
    textAlign: 'right',
  },
});

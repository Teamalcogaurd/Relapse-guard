import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

type Milestone = {
  label: string;
  days: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Achievement = {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accent: string;
  tint: string;
  glow: string;
  unlockHint: string;
};

const MILESTONES: Milestone[] = [
  { label: 'Start', days: 1, icon: 'flag-variant' },
  { label: 'Week', days: 7, icon: 'leaf-circle-outline' },
  { label: 'Month', days: 30, icon: 'moon-waxing-crescent' },
  { label: '90 Days', days: 90, icon: 'ribbon' },
  { label: 'Year', days: 365, icon: 'trophy-award' },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Step', icon: 'diamond-stone', accent: '#42C878', tint: colors.sage, glow: '#C9F7D8', unlockHint: 'Open your recovery space' },
  { id: 'mood_awareness', title: 'Mood Check', icon: 'emoticon-happy-outline', accent: colors.blueStrong, tint: colors.blueSoft, glow: '#C9DDFF', unlockHint: 'Log your mood once' },
  { id: 'reflection_started', title: 'Reflection', icon: 'book-heart-outline', accent: colors.amberStrong, tint: colors.amber, glow: '#FFE4AF', unlockHint: 'Write your first journal entry' },
  { id: 'showing_up', title: 'Showing Up', icon: 'leaf-circle-outline', accent: colors.sageStrong, tint: colors.sage, glow: '#CFEFD2', unlockHint: 'Complete 3 support actions' },
  { id: 'steady_rhythm', title: 'Rhythm', icon: 'crown-outline', accent: colors.lavenderStrong, tint: colors.cardLavender, glow: '#E6D8FF', unlockHint: 'Complete 7 support actions' },
  { id: 'kept_going', title: 'Resilience', icon: 'trophy-award', accent: colors.roseStrong, tint: colors.rose, glow: '#FFD0DA', unlockHint: 'Complete 12 support actions' },
];

export default function ProgressScreen() {
  const { latestMoodLog, journals } = useApp();
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const journalCount = (journals ?? []).length;
  const moodCount = latestMoodLog ? 1 : 0;
  const supportCount = journalCount + moodCount;

  const streakDays = useMemo(() => {
    if (supportCount <= 1) return 2;
    if (supportCount <= 3) return 6;
    if (supportCount <= 5) return 10;
    return Math.min(365, supportCount * 3);
  }, [supportCount]);

  const achievementData = useMemo(() => {
    const unlockedIds: Record<string, boolean> = {
      first_step: true,
      mood_awareness: moodCount >= 1,
      reflection_started: journalCount >= 1,
      showing_up: supportCount >= 3,
      steady_rhythm: supportCount >= 7,
      kept_going: supportCount >= 12,
    };

    const items = ACHIEVEMENTS.map((item) => ({
      ...item,
      unlocked: unlockedIds[item.id],
    }));

    return {
      items,
      lockedItems: items.filter((item) => !item.unlocked),
      unlockedCount: items.filter((item) => item.unlocked).length,
    };
  }, [journalCount, moodCount, supportCount]);

  const nextMilestone = MILESTONES.find((item) => streakDays < item.days) ?? MILESTONES[MILESTONES.length - 1];
  const nextMilestoneDays = Math.max(0, nextMilestone.days - streakDays);
  const milestoneProgress = Math.min(100, Math.round((streakDays / nextMilestone.days) * 100));
  const completion = Math.round((achievementData.unlockedCount / ACHIEVEMENTS.length) * 100);
  const featuredBadge = achievementData.items.find((item) => item.unlocked) ?? achievementData.items[0];
  const nextBadge = achievementData.lockedItems[0];

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
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Progress</Text>
          <Text style={styles.title}>Your recovery streak</Text>
        </View>
        <Pressable onPress={() => router.push('/support/achievements')} style={styles.headerButton}>
          <Animated.View style={[styles.headerButtonGlow, { transform: [{ scale: pulseScale }] }]} />
          <MaterialCommunityIcons name="medal-outline" size={22} color={colors.brown} />
        </Pressable>
      </View>

      <Animated.View style={[styles.heroCard, riseIn]}>
        <LinearGradient
          colors={['#FFFDFC', '#F4F0FD', '#FFF2EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <Animated.View style={[styles.heroBadgeWrap, { transform: [{ scale: pulseScale }] }]}>
              <BadgeCoin item={featuredBadge} unlocked size="large" />
            </Animated.View>
            <View style={styles.heroMeta}>
              <Text style={styles.heroLabel}>Current streak</Text>
              <View style={styles.heroNumberRow}>
                <Text style={styles.heroNumber}>{streakDays}</Text>
                <Text style={styles.heroUnit}>days</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroStats}>
            <MetricBlock label="Badges" value={`${achievementData.unlockedCount}/${ACHIEVEMENTS.length}`} icon="medal-outline" color={colors.lavenderStrong} />
            <MetricBlock label="Check-ins" value={supportCount} icon="check-circle-outline" color={colors.sageStrong} />
            <MetricBlock label="Next goal" value={`${nextMilestoneDays}d`} icon="flag-outline" color={colors.amberStrong} />
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.panel, riseIn]}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelTitle}>Milestone path</Text>
            <Text style={styles.panelSubtitle}>{nextMilestone.label}</Text>
          </View>
          <Text style={styles.panelMeta}>{milestoneProgress}%</Text>
        </View>

        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${milestoneProgress}%` }]} />
        </View>

        <View style={styles.milestoneRail}>
          {MILESTONES.map((item) => {
            const complete = streakDays >= item.days;
            const active = item.label === nextMilestone.label;

            return (
              <View key={item.label} style={styles.milestoneStep}>
                <View style={[styles.milestoneDot, complete && styles.milestoneDotComplete, active && !complete && styles.milestoneDotActive]}>
                  <MaterialCommunityIcons
                    name={complete ? 'check' : item.icon}
                    size={14}
                    color={complete || active ? colors.white : colors.textMuted}
                  />
                </View>
                <Text style={[styles.milestoneLabel, active && styles.milestoneLabelActive]} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View style={[styles.nextUnlockCard, riseIn]}>
        <View style={styles.nextUnlockIcon}>
          <BadgeCoin item={nextBadge ?? featuredBadge} unlocked={!nextBadge} size="tiny" />
        </View>
        <View style={styles.nextUnlockCopy}>
          <Text style={styles.nextUnlockLabel}>{nextBadge ? 'Next badge' : 'Badge board'}</Text>
          <Text style={styles.nextUnlockTitle}>{nextBadge ? nextBadge.title : 'All badges unlocked'}</Text>
          <Text style={styles.nextUnlockHint} numberOfLines={2}>
            {nextBadge ? nextBadge.unlockHint : 'You have completed every current badge.'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
      </Animated.View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Achievement preview</Text>
          <Text style={styles.sectionHint}>{completion}% complete</Text>
        </View>
        <Pressable onPress={() => router.push('/support/achievements')} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.brown} />
        </Pressable>
      </View>

      <View style={styles.badgeGrid}>
        {achievementData.items.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.badgeCard,
              !item.unlocked && styles.badgeCardLocked,
              {
                opacity: entrance,
                transform: [
                  {
                    translateY: entrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18 + index * 2, 0],
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
            <BadgeCoin item={item} unlocked={item.unlocked} size="small" />
            <Text style={[styles.badgeTitle, !item.unlocked && styles.badgeTitleLocked]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.badgeStatus, item.unlocked && { color: item.accent }]}>
              {item.unlocked ? 'Unlocked' : 'Locked'}
            </Text>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

function BadgeCoin({
  item,
  unlocked,
  size,
}: {
  item: Achievement;
  unlocked?: boolean;
  size: 'tiny' | 'small' | 'large';
}) {
  const outer = size === 'large' ? 82 : size === 'small' ? 54 : 42;
  const inner = size === 'large' ? 62 : size === 'small' ? 40 : 31;
  const iconSize = size === 'large' ? 31 : size === 'small' ? 21 : 16;
  const accent = unlocked ? item.accent : colors.textMuted;
  const tint = unlocked ? item.tint : '#F0E7E2';
  const glow = unlocked ? item.glow : '#E9DED8';

  return (
    <View style={[styles.coinOuter, { width: outer, height: outer, borderRadius: outer / 2 }]}>
      <View style={[styles.coinGlow, { width: outer - 8, height: outer - 8, borderRadius: outer / 2, backgroundColor: glow }]}>
        <View style={[styles.coinTint, { width: outer - 19, height: outer - 19, borderRadius: outer / 2, backgroundColor: tint }]} />
      </View>
      <View style={[styles.coinInner, { width: inner, height: inner, borderRadius: inner / 2, borderColor: accent }]}>
        {unlocked && <View style={[styles.coinSpark, size === 'large' && styles.coinSparkLarge]} />}
        <MaterialCommunityIcons name={unlocked ? item.icon : 'lock-question'} size={iconSize} color={accent} />
      </View>
    </View>
  );
}

function MetricBlock({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.metricBlock}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}18` }]}>
        <MaterialCommunityIcons name={icon} size={17} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
  headerText: {
    flex: 1,
    paddingRight: 16,
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
    maxWidth: 250,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginTop: 2,
  },
  headerButtonGlow: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 16,
    backgroundColor: colors.amber,
  },
  heroCard: {
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 14,
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
    marginBottom: 18,
  },
  heroBadgeWrap: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroMeta: {
    flex: 1,
  },
  heroLabel: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  heroNumberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  heroNumber: {
    color: colors.heading,
    fontSize: 55,
    lineHeight: 60,
    fontWeight: '900',
  },
  heroUnit: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '800',
    marginLeft: 8,
    marginBottom: 7,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBlock: {
    flex: 1,
    minHeight: 92,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    justifyContent: 'space-between',
  },
  metricIcon: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: colors.heading,
    fontSize: 20,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  panelTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  panelSubtitle: {
    color: colors.heading,
    fontSize: 20,
    fontWeight: '900',
  },
  panelMeta: {
    color: colors.lavenderStrong,
    fontSize: 18,
    fontWeight: '900',
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.borderSoft,
    marginBottom: 16,
  },
  trackFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.lavenderStrong,
  },
  milestoneRail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneStep: {
    width: '19%',
    alignItems: 'center',
  },
  milestoneDot: {
    width: 34,
    height: 34,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardSoft,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 7,
  },
  milestoneDotComplete: {
    backgroundColor: colors.sageStrong,
    borderColor: colors.sageStrong,
  },
  milestoneDotActive: {
    backgroundColor: colors.lavenderStrong,
    borderColor: colors.lavenderStrong,
  },
  milestoneLabel: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  milestoneLabelActive: {
    color: colors.heading,
  },
  nextUnlockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 20,
  },
  nextUnlockIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nextUnlockCopy: {
    flex: 1,
    minWidth: 0,
  },
  nextUnlockLabel: {
    color: colors.amberStrong,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  nextUnlockTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 3,
  },
  nextUnlockHint: {
    color: colors.textSoft,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
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
  sectionHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingLeft: 12,
  },
  viewAllText: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '900',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '31.5%',
    minHeight: 136,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCardLocked: {
    backgroundColor: '#FAF4F0',
  },
  coinOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: '#9F8175',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  coinGlow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTint: {
    opacity: 0.9,
  },
  coinInner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    overflow: 'hidden',
  },
  coinSpark: {
    position: 'absolute',
    right: 6,
    top: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.9,
    transform: [{ rotate: '45deg' }],
  },
  coinSparkLarge: {
    right: 11,
    top: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badgeTitle: {
    color: colors.heading,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '900',
    textAlign: 'center',
    minHeight: 32,
    marginTop: 10,
  },
  badgeTitleLocked: {
    color: colors.textSoft,
  },
  badgeStatus: {
    color: colors.textMuted,
    fontSize: 10.5,
    fontWeight: '800',
    marginTop: 4,
  },
});

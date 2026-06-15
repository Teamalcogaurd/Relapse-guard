import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

const COLORS = {
  bg: '#F8EFEB',
  card: 'rgba(255,253,252,0.95)',
  border: '#E7D7CF',

  heading: '#3E2420',
  text: '#6E5751',
  muted: '#9E8780',

  brown: '#6D4338',
  lavenderStrong: '#A185E8',
  blueStrong: '#5E7FE6',
  sageStrong: '#4E9B62',
  amberStrong: '#D58A23',
  roseStrong: '#D86D7C',
  white: '#FFFFFF',
};

const QUICK_ACTIONS = [
  {
    title: 'Breathe',
    icon: 'leaf-outline' as const,
    color: COLORS.sageStrong,
    bubble: '#EAF5EC',
    route: '/support/breathing',
  },
  {
    title: 'Ground',
    icon: 'compass-outline' as const,
    color: COLORS.blueStrong,
    bubble: '#EEF2FF',
    route: '/support/grounding',
  },
  {
    title: 'Journal',
    icon: 'book-outline' as const,
    color: COLORS.lavenderStrong,
    bubble: '#F3EDFB',
    route: '/journal',
  },
  {
    title: 'Urgent',
    icon: 'alert-circle-outline' as const,
    color: COLORS.roseStrong,
    bubble: '#FBE8EC',
    route: '/support/emergency',
  },
];

type HomeValence =
  | 'very_unpleasant'
  | 'unpleasant'
  | 'neutral'
  | 'pleasant'
  | 'very_pleasant';

const VALENCE_VISUALS: Record<HomeValence, { color: string; shadow: string }> = {
  very_unpleasant: {
    color: '#6D8BFF',
    shadow: 'rgba(109, 139, 255, 0.34)',
  },
  unpleasant: {
    color: '#90AFFF',
    shadow: 'rgba(144, 175, 255, 0.30)',
  },
  neutral: {
    color: '#4FA6C8',
    shadow: 'rgba(79, 166, 200, 0.24)',
  },
  pleasant: {
    color: '#8BC53F',
    shadow: 'rgba(139, 197, 63, 0.28)',
  },
  very_pleasant: {
    color: '#F48A36',
    shadow: 'rgba(244, 138, 54, 0.30)',
  },
};

export default function HomeScreen() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const { latestMoodLog, hardwareState, latestRecoveryEvent } = useApp();

  const moodValence = latestMoodLog?.valence ?? 'pleasant';

  const moodTitle = latestMoodLog?.title ?? 'No mood logged yet';
  const moodSubtitle = latestMoodLog?.subtitle ?? 'Log your mood to see your daily trend.';
  const moodContexts = latestMoodLog?.contexts?.length ? latestMoodLog.contexts.join(', ') : '';

  const moodTime = latestMoodLog
    ? new Date(latestMoodLog.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  const rowTitle =
    latestMoodLog?.valence === 'very_pleasant'
      ? 'Very Pleasant'
      : latestMoodLog?.valence === 'pleasant'
      ? 'Pleasant'
      : latestMoodLog?.valence === 'neutral'
      ? 'Neutral'
      : latestMoodLog?.valence === 'unpleasant'
      ? 'Unpleasant'
      : latestMoodLog?.valence === 'very_unpleasant'
      ? 'Very Unpleasant'
      : 'No entry';

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.subGreeting}>One step at a time.</Text>
            </View>

            <Pressable
              onPress={() => router.push('/support/profile')}
              style={styles.profileButton}
            >
              <Ionicons name="person-outline" size={18} color={COLORS.brown} />
            </Pressable>
          </View>

          {hardwareState.connected && (
            <Pressable
              onPress={() => router.push('/support/vitals')}
              style={styles.liveBiometricsCard}
            >
              <View style={styles.liveTopRow}>
                <View style={styles.liveLeft}>
                  <View style={styles.heartIconWrap}>
                    <MaterialCommunityIcons name="heart-pulse" size={24} color={COLORS.roseStrong} />
                  </View>
                  <View style={styles.liveTextWrap}>
                    <Text style={styles.liveTitle}>Live Heart Rate</Text>
                    <Text style={styles.liveSubtitle} numberOfLines={1} ellipsizeMode="tail">
                      {hardwareState.deviceName || 'SoberShield Watch'}
                    </Text>
                  </View>
                </View>
                <View style={styles.liveRight}>
                  <Text style={styles.liveBpm}>{hardwareState.liveHeartRate ?? '--'}</Text>
                  <Text style={styles.liveUnit}>BPM</Text>
                </View>
              </View>
              <View style={styles.liveDivider} />
              <View style={styles.liveBottomRow}>
                <View style={styles.liveExtraItem}>
                  <Ionicons name="thermometer-outline" size={14} color={COLORS.blueStrong} />
                  <Text style={styles.liveExtraText}>{hardwareState.bodyTemp ?? '--'}°C</Text>
                </View>
                <View style={styles.liveExtraItem}>
                  <Ionicons name="medical-outline" size={14} color={COLORS.amberStrong} />
                  <Text style={styles.liveExtraText}>{hardwareState.spo2 ?? '--'}%</Text>
                </View>
              </View>
            </Pressable>
          )}

          {!hardwareState.connected && (
            <Pressable
              onPress={() => router.push('/support/hardware-sync')}
              style={styles.hardwarePromptCard}
            >
              <Ionicons name="watch-outline" size={20} color={COLORS.blueStrong} />
              <Text style={styles.hardwarePromptText}>Connect watch for live vitals</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>
          )}

          <View style={styles.moodCard}>
            <View style={styles.moodCardTop}>
              <View>
                <Text style={styles.moodEyebrow}>Today's mood</Text>
                <Text style={styles.moodDate}>
                  {new Date().toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/emotion-log')}
                style={styles.logButton}
              >
                <Text style={styles.logButtonText}>Log</Text>
              </Pressable>
            </View>

            <View style={styles.heroBloomWrap}>
              <MoodBloom valence={moodValence} />
            </View>

            <Text style={styles.moodTitle}>{moodTitle}</Text>
            <Text style={styles.moodSubtitle}>{moodSubtitle}</Text>
            {!!moodContexts && <Text style={styles.moodContexts}>{moodContexts}</Text>}

            <View style={styles.divider} />

            <Text style={styles.sectionEyebrow}>Current mood</Text>

            <View style={styles.emotionRow}>
              <View style={styles.emotionLeft}>
                <MoodBloom valence={moodValence} small />
                <View style={styles.emotionTextWrap}>
                  <Text style={styles.emotionTitle}>{rowTitle}</Text>
                  <Text style={styles.emotionSubtitle}>
                    {latestMoodLog?.labels?.length
                      ? latestMoodLog.labels.join(', ')
                      : 'No labels'}
                  </Text>
                </View>
              </View>

              <Text style={styles.emotionTime}>{moodTime}</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick support</Text>
            <Pressable onPress={() => router.push('/(tabs)/support')}>
              <Text style={styles.sectionLink}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => router.push(item.route as any)}
                style={styles.quickCard}
              >
                <View style={[styles.quickIconWrap, { backgroundColor: item.bubble }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.quickTitle}>{item.title}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.recoveryRow}>
            <Pressable
              onPress={() => router.push('/support/recovery-mode?source=manual_recovery')}
              style={styles.recoveryMiniCard}
            >
              <View style={[styles.recoveryMiniIcon, { backgroundColor: '#EEF2FF' }]}>
                <MaterialCommunityIcons name="shield-heart-outline" size={19} color={COLORS.blueStrong} />
              </View>
              <View style={styles.recoveryMiniCopy}>
                <Text style={styles.recoveryMiniTitle}>Reset This Moment</Text>
                <Text style={styles.recoveryMiniText}>A private space to calm down.</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.progressStrip}>
            <Text style={styles.progressText}>7-day streak</Text>
            <View style={styles.dot} />
            <Text style={styles.progressText}>4 check-ins</Text>
          </View>

          {!!latestRecoveryEvent && (
            <View style={styles.recoveryInsightCard}>
              <View style={styles.recoveryInsightIcon}>
                <MaterialCommunityIcons name="shield-heart-outline" size={21} color={COLORS.sageStrong} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recoveryInsightTitle}>Recovery saved.</Text>
                <Text style={styles.recoveryInsightText}>Progress continues.</Text>
              </View>
            </View>
          )}

          <View style={styles.supportCard}>
            <View style={styles.supportIconWrap}>
              <MaterialCommunityIcons
                name="leaf-circle-outline"
                size={22}
                color={COLORS.sageStrong}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.supportTitle}>Support tools are ready.</Text>
              <Text style={styles.supportText}>Breathe, ground, journal, and reset.</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}

function MoodBloom({ valence, small }: { valence: HomeValence; small?: boolean }) {
  const size = small ? 46 : 148;
  const mid = small ? 28 : 76;
  const inner = small ? 13 : 34;
  const visual = VALENCE_VISUALS[valence];

  if (valence === 'very_pleasant') {
    return (
      <BloomShell size={size} shadow={visual.shadow}>
        {[0, 45, 90, 135].map((deg) => (
          <View
            key={deg}
            style={[
              styles.flowerPetal,
              {
                width: mid,
                height: size * 0.42,
                backgroundColor: `${visual.color}36`,
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <BloomCore size={inner} color={visual.color} />
      </BloomShell>
    );
  }

  if (valence === 'pleasant') {
    return (
      <BloomShell size={size} shadow={visual.shadow}>
        {[0, 60, 120].map((deg) => (
          <View
            key={deg}
            style={[
              styles.flowerPetal,
              {
                width: mid,
                height: size * 0.38,
                backgroundColor: `${visual.color}30`,
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.bloomRing,
            {
              width: size * 0.74,
              height: size * 0.74,
              borderRadius: 999,
              borderColor: `${visual.color}88`,
            },
          ]}
        />
        <BloomCore size={inner} color={visual.color} />
      </BloomShell>
    );
  }

  if (valence === 'neutral') {
    return (
      <BloomShell size={size} shadow={visual.shadow}>
        <View
          style={[
            styles.bloomRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: `${visual.color}55`,
            },
          ]}
        />
        <View
          style={[
            styles.bloomRing,
            {
              width: size * 0.62,
              height: size * 0.62,
              borderRadius: 999,
              borderColor: `${visual.color}88`,
            },
          ]}
        />
        <BloomCore size={inner} color={visual.color} />
      </BloomShell>
    );
  }

  if (valence === 'unpleasant') {
    return (
      <BloomShell size={size} shadow={visual.shadow}>
        {[0, 45, 90, 135].map((deg) => (
          <View
            key={deg}
            style={[
              styles.sharpRay,
              {
                width: small ? 3 : 5,
                height: size * 0.42,
                backgroundColor: `${visual.color}55`,
                transform: [{ rotate: `${deg}deg` }],
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.bloomRing,
            {
              width: size * 0.58,
              height: size * 0.58,
              borderRadius: 999,
              borderColor: `${visual.color}88`,
            },
          ]}
        />
        <BloomCore size={inner} color={visual.color} />
      </BloomShell>
    );
  }

  return (
    <BloomShell size={size} shadow={visual.shadow}>
      {[0, 30, 60, 90, 120, 150].map((deg) => (
        <View
          key={deg}
          style={[
            styles.sharpRay,
            {
              width: small ? 2 : 4,
              height: size * 0.46,
              backgroundColor: `${visual.color}60`,
              transform: [{ rotate: `${deg}deg` }],
            },
          ]}
        />
      ))}
      <BloomCore size={inner} color={visual.color} />
    </BloomShell>
  );
}

function BloomShell({
  children,
  size,
  shadow,
}: {
  children: React.ReactNode;
  size: number;
  shadow: string;
}) {
  return (
    <View
      style={[
        styles.bloomOuter,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: shadow,
        },
      ]}
    >
      {children}
    </View>
  );
}

function BloomCore({ size, color }: { size: number; color: string }) {
  return (
    <View
      style={[
        styles.bloomCenter,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -1,
    color: COLORS.heading,
    marginBottom: 6,
  },
  subGreeting: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: '600',
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,253,252,0.82)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  moodCard: {
    backgroundColor: COLORS.card,
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#B78F84',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  moodCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  moodEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  moodDate: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.heading,
  },
  logButton: {
    backgroundColor: COLORS.blueStrong,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  logButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  heroBloomWrap: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  moodTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '900',
    color: COLORS.heading,
    textAlign: 'center',
    marginBottom: 6,
  },
  moodSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  moodContexts: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.muted,
    textAlign: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  emotionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emotionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  emotionTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  emotionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.heading,
    marginBottom: 2,
  },
  emotionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  emotionTime: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.muted,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.heading,
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickCard: {
    width: '23.5%',
    backgroundColor: 'rgba(255,253,252,0.88)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.heading,
    textAlign: 'center',
    lineHeight: 15,
  },
  recoveryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  recoveryMiniCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: 'rgba(255,253,252,0.88)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recoveryMiniIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recoveryMiniCopy: {
    flex: 1,
    minWidth: 0,
  },
  recoveryMiniTitle: {
    color: COLORS.heading,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 3,
  },
  recoveryMiniText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },

  progressStrip: {
    backgroundColor: 'rgba(255,253,252,0.78)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.muted,
    marginHorizontal: 10,
  },
  recoveryInsightCard: {
    backgroundColor: 'rgba(255,253,252,0.86)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recoveryInsightIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF5EC',
    marginRight: 12,
  },
  recoveryInsightTitle: {
    color: COLORS.heading,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 3,
  },
  recoveryInsightText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },

  supportCard: {
    backgroundColor: 'rgba(255,253,252,0.74)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  supportIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF5EC',
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.heading,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.text,
    fontWeight: '600',
  },

  bloomOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.38,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
  bloomRing: {
    position: 'absolute',
    borderWidth: 1.6,
    backgroundColor: 'transparent',
  },
  bloomCenter: {
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 5,
  },
  flowerPetal: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 999,
  },
  sharpRay: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 999,
  },

  hardwarePromptCard: {
    backgroundColor: 'rgba(94, 127, 230, 0.08)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(94, 127, 230, 0.2)',
    gap: 10,
  },
  hardwarePromptText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.blueStrong,
  },

  liveBiometricsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'column',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 18,
    shadowColor: COLORS.roseStrong,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  liveTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  liveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  liveTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  heartIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FBE8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.heading,
  },
  liveSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  liveRight: {
    alignItems: 'flex-end',
  },
  liveBpm: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.roseStrong,
    lineHeight: 28,
  },
  liveUnit: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
    textTransform: 'uppercase',
  },
  liveDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  liveBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  liveExtraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveExtraText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.heading,
  },
});

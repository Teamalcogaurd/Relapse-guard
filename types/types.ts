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
  bg: '#F7EFEA',
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

export default function HomeScreen() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const { latestMoodLog } = useApp();

  const moodTone = latestMoodLog?.valence ?? 'pleasant';

  const bloomTone =
    moodTone === 'very_pleasant'
      ? 'warm'
      : moodTone === 'pleasant'
      ? 'green'
      : moodTone === 'neutral'
      ? 'blue'
      : moodTone === 'unpleasant'
      ? 'blue'
      : 'blue';

  const moodTitle = latestMoodLog?.title ?? 'No mood logged yet';
  const moodSubtitle = latestMoodLog?.subtitle ?? 'Log how you feel to see your daily state of mind.';
  const moodContexts = latestMoodLog?.contexts?.length
    ? latestMoodLog.contexts.join(', ')
    : 'Health, Recovery, Support';

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
          <View style={styles.bgCircleTopRight} />
          <View style={styles.bgCircleLeft} />
          <View style={styles.bgCircleBottom} />

          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.subGreeting}>Take one small step right now.</Text>
            </View>

            <Pressable
              onPress={() => router.push('/support/profile')}
              style={styles.profileButton}
            >
              <Ionicons name="person-outline" size={18} color={COLORS.brown} />
            </Pressable>
          </View>

          <View style={styles.moodCard}>
            <View style={styles.moodCardTop}>
              <View>
                <Text style={styles.moodEyebrow}>Today’s mood</Text>
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
              <MoodBloom tone={bloomTone} />
            </View>

            <Text style={styles.moodTitle}>{moodTitle}</Text>
            <Text style={styles.moodSubtitle}>{moodSubtitle}</Text>
            <Text style={styles.moodContexts}>{moodContexts}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionEyebrow}>Momentary emotions</Text>

            <View style={styles.emotionRow}>
              <View style={styles.emotionLeft}>
                <MoodBloom tone={bloomTone} small />
                <View style={styles.emotionTextWrap}>
                  <Text style={styles.emotionTitle}>{rowTitle}</Text>
                  <Text style={styles.emotionSubtitle}>
                    {latestMoodLog?.labels?.length
                      ? latestMoodLog.labels.join(', ')
                      : 'No labels selected'}
                  </Text>
                </View>
              </View>

              <Text style={styles.emotionTime}>{moodTime}</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Support now</Text>
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

          <View style={styles.progressStrip}>
            <Text style={styles.progressText}>7 day streak</Text>
            <View style={styles.dot} />
            <Text style={styles.progressText}>4 check-ins this week</Text>
          </View>

          <View style={styles.supportCard}>
            <View style={styles.supportIconWrap}>
              <MaterialCommunityIcons
                name="leaf-circle-outline"
                size={22}
                color={COLORS.sageStrong}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.supportTitle}>Gentle support, ready fast.</Text>
              <Text style={styles.supportText}>
                Use breathing, grounding, journaling, or a fresh mood check-in whenever you need a softer reset.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MoodBloom({
  tone,
  small,
}: {
  tone: 'green' | 'warm' | 'blue';
  small?: boolean;
}) {
  const size = small ? 42 : 92;

  const toneMap = {
    green: {
      outer: '#DDF4A3',
      mid: '#BFE85A',
      inner: '#8BC53F',
    },
    warm: {
      outer: '#FFD8A8',
      mid: '#FFB567',
      inner: '#F48A36',
    },
    blue: {
      outer: '#D7E8FF',
      mid: '#8EB6FF',
      inner: '#5E7FE6',
    },
  };

  const color = toneMap[tone];

  return (
    <View
      style={[
        styles.bloomOuter,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: color.mid,
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
            borderColor: color.outer,
          },
        ]}
      />
      <View
        style={[
          styles.bloomRing,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: 999,
            borderColor: color.mid,
          },
        ]}
      />
      <View
        style={[
          styles.bloomCenter,
          {
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: 999,
            backgroundColor: color.inner,
            shadowColor: color.inner,
          },
        ]}
      />
    </View>
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

  bgCircleTopRight: {
    position: 'absolute',
    top: 40,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: '#F2D8D2',
  },
  bgCircleLeft: {
    position: 'absolute',
    top: 470,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#E3D8F5',
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: 110,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#EEE0CC',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -1,
    color: COLORS.heading,
    marginBottom: 6,
  },
  subGreeting: {
    fontSize: 16,
    lineHeight: 24,
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
    marginBottom: 14,
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
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  moodContexts: {
    fontSize: 14,
    lineHeight: 21,
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
    fontSize: 14,
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
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.heading,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: COLORS.text,
    fontWeight: '600',
  },

  bloomOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 4,
  },
  bloomRing: {
    position: 'absolute',
    borderWidth: 1.2,
    backgroundColor: 'transparent',
  },
  bloomCenter: {
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 3,
  },
});
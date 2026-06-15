import React, { useMemo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bg: '#FDFBF9',
  card: 'rgba(255,255,255,0.9)',
  border: 'rgba(231, 215, 207, 0.4)',
  heading: '#2D1A18',
  text: '#5D443F',
  muted: '#A5928E',
  blue: '#5E7FE6',
  sage: '#6BBF83',
  rose: '#E87D8E',
  amber: '#F4A261',
  white: '#FFFFFF',
};

function getHeartStatus(bpm: number | null) {
  if (!bpm) return { label: 'No signal', tone: '#A5928E' };
  if (bpm < 60) return { label: 'Calm', tone: '#5E7FE6' };
  if (bpm <= 95) return { label: 'Steady', tone: '#6BBF83' };
  return { label: 'Elevated', tone: '#E87D8E' };
}

function formatLastSync(iso: string | null) {
  if (!iso) return 'Waiting for sync';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Waiting for sync';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function VitalsScreen() {
  const { hardwareState } = useApp();
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const barAnims = useRef([0, 1, 2, 3, 4, 5].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Bar growth animation
    const staggerAnims = barAnims.map((anim, i) => 
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 200 + i * 100,
        useNativeDriver: true,
      })
    );
    Animated.parallel(staggerAnims).start();

    // Heartbeat animation
    const bpm = hardwareState.liveHeartRate ?? 72;
    const duration = (60 / bpm) * 1000;
    
    const beat = Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.15,
          duration: duration * 0.3,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: duration * 0.7,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    beat.start();

    return () => beat.stop();
  }, [hardwareState.liveHeartRate]);

  const mockData = useMemo(() => {
    return [
      { label: '8am', val: 68 },
      { label: '10am', val: 72 },
      { label: '12pm', val: 85 },
      { label: '2pm', val: 74 },
      { label: '4pm', val: 70 },
      { label: '6pm', val: 66 },
    ];
  }, []);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  const heartStatus = getHeartStatus(hardwareState.liveHeartRate);
  const lastSyncLabel = formatLastSync(hardwareState.lastSync);
  const recoveryScore = useMemo(() => {
    const hr = hardwareState.liveHeartRate ?? 72;
    const stress = hardwareState.stressLevel ?? 24;
    return Math.max(45, Math.min(99, Math.round(95 - stress - Math.max(0, hr - 80) * 0.8)));
  }, [hardwareState.liveHeartRate, hardwareState.stressLevel]);

  if (!hardwareState.connected) {
    return (
      <View style={styles.screen}>
        <LinearGradient colors={['#FFF5F2', '#FDFBF9', '#F2F6FF']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="watch-vibrate" size={40} color={COLORS.blue} />
            </View>
            <Text style={styles.emptyTitle}>No watch connected</Text>
            <Text style={styles.emptyText}>Pair your watch to view live vitals and insights.</Text>
            <Pressable onPress={() => router.push('/support/hardware-sync')} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Connect Watch</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#FFF5F2', '#FDFBF9', '#F2F6FF']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={COLORS.heading} />
          </Pressable>
          <Text style={styles.title}>Live Vitals</Text>
          <View style={styles.deviceIndicator}>
            <View style={styles.greenDot} />
            <Text style={styles.deviceText} numberOfLines={1}>
              Connected
            </Text>
          </View>
        </Animated.View>

        <Animated.ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {/* Main Reading Card with Heartbeat */}
          <Animated.View style={[styles.heroCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <View style={styles.heroTop}>
              <Animated.View style={[styles.heartPulseWrap, { transform: [{ scale: heartScale }] }]}>
                <MaterialCommunityIcons name="heart-pulse" size={42} color={COLORS.rose} />
              </Animated.View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroLabel}>Live Heart Rate</Text>
                <Text style={styles.heroSubtitle}>Connected and tracking</Text>
              </View>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            </View>

            <View style={styles.bpmRow}>
              <Text style={styles.bpmVal}>{hardwareState.liveHeartRate ?? '--'}</Text>
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.bpmUnit}>BPM</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${heartStatus.tone}20` }]}>
                  <Text style={[styles.statusText, { color: heartStatus.tone }]}>{heartStatus.label}</Text>
                </View>
              </View>
            </View>

            <View style={styles.quickMetaRow}>
              <View style={styles.quickMetaPill}>
                <Ionicons name="battery-half-outline" size={14} color={COLORS.sage} />
                <Text style={styles.quickMetaText}>{hardwareState.batteryLevel ?? '--'}%</Text>
              </View>
              <View style={styles.quickMetaPill}>
                <Ionicons name="time-outline" size={14} color={COLORS.blue} />
                <Text style={styles.quickMetaText}>{lastSyncLabel}</Text>
              </View>
              <View style={styles.quickMetaPill}>
                <Ionicons name="sparkles-outline" size={14} color={COLORS.rose} />
                <Text style={styles.quickMetaText}>Score {recoveryScore}</Text>
              </View>
            </View>

            <View style={styles.graphRow}>
              {mockData.map((d, i) => (
                <View key={i} style={styles.graphCol}>
                  <View style={styles.graphBarTrack}>
                    <Animated.View
                      style={[
                        styles.graphBar,
                        {
                          height: 10 + (d.val / 100) * 52,
                          backgroundColor: i === 2 ? COLORS.rose : '#F2D5DA',
                          opacity: barAnims[i],
                          transform: [
                            {
                              scaleY: barAnims[i].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.75, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.graphLabel}>{d.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Detailed Metrics Grid */}
          <View style={styles.grid}>
            <AnimatedMetricCard 
              index={0}
              icon="water-outline" 
              label="Stress Level" 
              value={hardwareState.stressLevel ? `${hardwareState.stressLevel}%` : '--'} 
              sub="Calm zone" 
              color={COLORS.sage} 
              bg="#EAF5EC"
              cardBg="#FCFFFD"
              progress={0.24}
            />
            <AnimatedMetricCard 
              index={1}
              icon="thermometer-outline" 
              label="Body Temp" 
              value={`${hardwareState.bodyTemp ?? '--'}°C`} 
              sub="Normal" 
              color={COLORS.blue} 
              bg="#EEF2FF"
              cardBg="#FCFDFF"
              progress={0.36}
            />
            <AnimatedMetricCard 
              index={2}
              icon="medical-outline" 
              label="Blood Oxygen" 
              value={`${hardwareState.spo2 ?? '--'}%`} 
              sub="Excellent" 
              color={COLORS.amber} 
              bg="#FFF3E6"
              cardBg="#FFFEFC"
              progress={0.98}
            />
            <AnimatedMetricCard 
              index={3}
              icon="moon-outline" 
              label="Recovery" 
              value={`${recoveryScore}`} 
              sub="Strong" 
              color={COLORS.blue} 
              bg="#F3EDFB"
              cardBg="#FCFAFF"
              progress={recoveryScore / 100}
            />
          </View>

          {/* AI Coaching Section */}
          <Animated.View style={[styles.aiCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[COLORS.blue, '#7289DA']}
              style={styles.aiGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.aiIconWrap}>
              <MaterialCommunityIcons name="robot-happy-outline" size={32} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Quick Insight</Text>
              <Text style={styles.aiText}>
                {heartStatus.label === 'Elevated'
                  ? 'Your heart rate is up. Try a 2-minute breathing reset.'
                  : 'Vitals look stable. Great time for a short check-in.'}
              </Text>
              <Pressable style={styles.aiAction} onPress={() => router.push('/support/breathing')}>
                <Text style={styles.aiActionText}>Start Breathing</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
              </Pressable>
            </View>
          </Animated.View>
          
          <View style={{ height: 100 }} />
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

function AnimatedMetricCard({ index, icon, label, value, sub, color, bg, cardBg, progress }: any) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay: 400 + index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.mCard, { backgroundColor: cardBg ?? COLORS.white, opacity: anim, transform: [{ scale: anim }] }]}>
      <View style={[styles.mIconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.mLabel}>{label}</Text>
      <Text style={styles.mValue}>{value}</Text>
      <Text style={styles.mSub}>{sub}</Text>
      
      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.heading, letterSpacing: -0.5 },
  deviceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 191, 131, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    maxWidth: 110,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.sage },
  deviceText: { fontSize: 10.5, fontWeight: '800', color: COLORS.sage },
  
  content: { paddingHorizontal: 16, paddingTop: 10 },
  
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    shadowColor: COLORS.rose,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  heartPulseWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#FBE8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: { fontSize: 16, fontWeight: '800', color: COLORS.heading },
  heroSubtitle: { fontSize: 12.5, color: COLORS.muted, fontWeight: '600' },
  liveBadge: { backgroundColor: COLORS.rose, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  liveBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '900' },
  
  bpmRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 16, paddingLeft: 4 },
  bpmVal: { fontSize: 56, fontWeight: '900', color: COLORS.heading, lineHeight: 60 },
  bpmUnit: { fontSize: 16, fontWeight: '800', color: COLORS.muted, marginBottom: 4 },
  statusBadge: {
    backgroundColor: '#EAF5EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: '800', color: COLORS.sage, textTransform: 'uppercase' },
  quickMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 16,
    paddingLeft: 4,
  },
  quickMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickMetaText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },

  graphRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 92,
    paddingHorizontal: 4,
    marginTop: 4,
    paddingTop: 8,
  },
  graphCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  graphBarTrack: {
    width: 16,
    height: 62,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  graphBar: {
    width: 12,
    borderRadius: 999,
  },
  graphLabel: { fontSize: 10, fontWeight: '700', color: COLORS.muted, marginTop: 6 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 16 },
  mCard: {
    width: (width - 56) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 14,
    borderWidth: 0.8,
    borderColor: 'rgba(231, 215, 207, 0.5)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  mIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  mLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 2 },
  mValue: { fontSize: 20, fontWeight: '900', color: COLORS.heading, marginBottom: 2 },
  mSub: { fontSize: 11, fontWeight: '600', color: COLORS.muted, marginBottom: 10 },
  progressBarWrap: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 999 },

  aiCard: {
    borderRadius: 28,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    shadowColor: COLORS.blue,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  aiGradient: { ...StyleSheet.absoluteFillObject },
  aiIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 16, fontWeight: '900', color: COLORS.white, marginBottom: 4 },
  aiText: { fontSize: 12.5, color: 'rgba(255,255,255,0.92)', lineHeight: 18, fontWeight: '600', marginBottom: 12 },
  aiAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  aiActionText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#ECF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.heading,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});

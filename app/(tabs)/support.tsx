import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';

type Tool = {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accent: string;
  tint: string;
  route: string;
};

const TOOLS: Tool[] = [
  {
    title: 'Breathe',
    subtitle: 'Guided rhythm',
    icon: 'weather-windy',
    accent: colors.sageStrong,
    tint: colors.sage,
    route: '/support/breathing',
  },
  {
    title: 'Ground',
    subtitle: '5 senses reset',
    icon: 'compass-outline',
    accent: colors.blueStrong,
    tint: colors.blueSoft,
    route: '/support/grounding',
  },
  {
    title: 'Craving Log',
    subtitle: 'Name the urge',
    icon: 'waveform',
    accent: colors.coral,
    tint: '#FBE7E2',
    route: '/support/craving-log',
  },
];

export default function SupportScreen() {
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

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
          duration: 1250,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1250,
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

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Support</Text>
          <Text style={styles.title}>What would help now?</Text>
        </View>
        <Pressable onPress={() => router.push('/support/profile')} style={styles.headerButton}>
          <Ionicons name="person-outline" size={19} color={colors.brown} />
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
            <Animated.View style={[styles.heroIcon, { transform: [{ scale: pulseScale }] }]}>
              <View style={styles.heroIconInner}>
                <MaterialCommunityIcons name="shield-heart-outline" size={34} color={colors.sageStrong} />
              </View>
            </Animated.View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroLabel}>Steady support tools</Text>
              <Text style={styles.heroTitle}>Choose one small reset.</Text>
              <Text style={styles.heroText}>Fast actions for urges, stress, and difficult moments.</Text>
            </View>
          </View>

          <Pressable onPress={() => router.push('/support/emergency')} style={styles.emergencyButton}>
            <View style={styles.emergencyButtonIcon}>
              <Ionicons name="alert-circle-outline" size={19} color={colors.white} />
            </View>
            <Text style={styles.emergencyButtonText}>Urgent support</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.white} />
          </Pressable>
        </LinearGradient>
      </Animated.View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick tools</Text>
        <Text style={styles.sectionMeta}>Tap to start</Text>
      </View>

      <View style={styles.toolGrid}>
        {TOOLS.map((tool, index) => (
          <Animated.View
            key={tool.title}
            style={[
              styles.toolCardWrap,
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
            <Pressable onPress={() => router.push(tool.route as any)} style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: tool.tint }]}>
                <MaterialCommunityIcons name={tool.icon} size={25} color={tool.accent} />
              </View>
              <Text style={styles.toolTitle} numberOfLines={1}>{tool.title}</Text>
              <Text style={styles.toolSubtitle} numberOfLines={1}>{tool.subtitle}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footerNote}>
        <View style={styles.footerIcon}>
          <MaterialCommunityIcons name="lock-check-outline" size={18} color={colors.sageStrong} />
        </View>
        <Text style={styles.footerText}>Your support space stays private and focused.</Text>
      </View>
    </Screen>
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
    maxWidth: 270,
  },
  headerButton: {
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
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
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
  heroIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#9F8175',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  heroIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    borderWidth: 2,
    borderColor: colors.sageStrong,
  },
  heroCopy: {
    flex: 1,
  },
  heroLabel: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    color: colors.heading,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  emergencyButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.roseStrong,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  emergencyButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 10,
  },
  emergencyButtonText: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
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
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  toolCardWrap: {
    width: '48.5%',
    marginBottom: 10,
  },
  toolCard: {
    minHeight: 142,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#B78F84',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  toolIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '900',
  },
  toolSubtitle: {
    color: colors.textSoft,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,253,252,0.78)',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 4,
  },
  footerIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    marginRight: 10,
  },
  footerText: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '700',
  },
});

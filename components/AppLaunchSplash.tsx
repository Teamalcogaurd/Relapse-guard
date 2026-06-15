import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import BrandLogo from './BrandLogo';

export default function AppLaunchSplash() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const floatY = useRef(new Animated.Value(18)).current;
  const pulse = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(floatY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.97,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fade, floatY, pulse, scale]);

  const logoTransform = useMemo(
    () => [{ translateY: floatY }, { scale }, { scale: pulse }],
    [floatY, pulse, scale]
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: fade,
            transform: logoTransform,
          },
        ]}
      >
        <BrandLogo size={190} />
      </Animated.View>

      <Animated.View style={{ opacity: fade, transform: [{ translateY: floatY }] }}>
        <Text style={styles.title}>RelapseGaurd</Text>
        <Text style={styles.subtitle}>
          A softer space for recovery, support,{'\n'}and steady progress.
        </Text>
      </Animated.View>

      <View style={styles.badgesRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Private</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Gentle</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Supportive</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F2EE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  logoWrap: {
    marginBottom: 18,
  },
  title: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '900',
    color: '#2E1F1B',
    letterSpacing: -1.1,
  },
  subtitle: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 26,
    color: '#5E4A45',
    fontWeight: '500',
  },
  badgesRow: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: '#F6ECE7',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EAD8D0',
  },
  badgeText: {
    color: '#5C443D',
    fontWeight: '700',
    fontSize: 14,
  },
});

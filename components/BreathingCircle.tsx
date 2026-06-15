import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export function BreathingCircle({ phase }: { phase: 'Inhale' | 'Hold' | 'Exhale' }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: phase === 'Inhale' ? 1.22 : phase === 'Hold' ? 1.22 : 1,
      duration: phase === 'Hold' ? 1000 : 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [phase, scale]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Text style={styles.phase}>{phase}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(76, 201, 240, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(76, 201, 240, 0.38)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  phase: { color: colors.text, fontSize: 24, fontWeight: '700' }
});

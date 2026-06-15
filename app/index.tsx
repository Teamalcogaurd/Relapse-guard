import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

function SoberShieldMark() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoBadge}>
        <View style={styles.shieldTip} />
        <View style={styles.shieldFrame}>
          <View style={styles.shieldShine} />
          <View style={styles.innerShieldGlow} />

          <View style={styles.star}>
            <View style={styles.starDiamond} />
            <View style={styles.starVertical} />
            <View style={styles.starHorizontal} />
          </View>

          <View style={styles.personHead} />
          <View style={styles.personBody} />
          <View style={styles.personArm} />
          <View style={styles.personLeg} />

          <View style={styles.sunWrap}>
            <View style={styles.sunRayTop} />
            <View style={styles.sunRayLeft} />
            <View style={styles.sunRayRight} />
            <View style={styles.sunCore} />
          </View>

          <View style={styles.pathOne} />
          <View style={styles.pathTwo} />
          <View style={styles.pathCut} />
        </View>
      </View>
    </View>
  );
}

export default function OpeningScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;
  const pulse = useRef(new Animated.Value(0.96)).current;
  const glow = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 850,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulse, {
              toValue: 1.04,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glow, {
              toValue: 0.28,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulse, {
              toValue: 0.96,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glow, {
              toValue: 0.15,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ),
    ]).start();
  }, [fade, rise, pulse, glow]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.logoShell,
              {
                opacity: fade,
                transform: [{ translateY: rise }, { scale: pulse }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoGlow,
                {
                  opacity: glow,
                },
              ]}
            />
            <SoberShieldMark />
          </Animated.View>

          <Animated.View
            style={[
              styles.textBlock,
              {
                opacity: fade,
                transform: [{ translateY: rise }],
              },
            ]}
          >
            <Text style={styles.brand}>SoberShield</Text>
            <Text style={styles.tagline}>
              A softer space for recovery, support, and steady progress.
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.bottomArea,
            {
              opacity: fade,
              transform: [{ translateY: rise }],
            },
          ]}
        >
          <Pressable
            style={styles.beginButton}
            onPress={() => router.push('/(public)/login')}
          >
            <Text style={styles.beginText}>Begin</Text>
          </Pressable>

          <Text style={styles.bottomNote}>
            Private | Gentle | Built for hard moments
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8EFEB' },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoShell: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: '#E9DFF8',
  },

  logoWrap: {
    width: 172,
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 164,
    height: 164,
    borderRadius: 46,
    backgroundColor: '#FFFDFC',
    borderWidth: 1.2,
    borderColor: '#E7D7CF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D4338',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  shieldTip: {
    position: 'absolute',
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#FFFDFC',
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderColor: '#6D4338',
    transform: [{ rotate: '45deg' }],
  },
  shieldFrame: {
    width: 120,
    height: 130,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 8,
    borderColor: '#6D4338',
    backgroundColor: '#FFFDFC',
    overflow: 'hidden',
  },
  shieldShine: {
    position: 'absolute',
    top: 7,
    left: 10,
    width: 88,
    height: 26,
    borderRadius: 20,
    backgroundColor: '#FAEEE7',
    opacity: 0.8,
  },
  innerShieldGlow: {
    position: 'absolute',
    left: 9,
    bottom: 11,
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: '#F3EDFB',
    opacity: 0.62,
  },
  star: {
    position: 'absolute',
    top: 1,
    right: 12,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '12deg' }],
  },
  starDiamond: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#A185E8',
    transform: [{ rotate: '45deg' }],
  },
  starVertical: {
    position: 'absolute',
    width: 5,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#A185E8',
  },
  starHorizontal: {
    position: 'absolute',
    width: 28,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#A185E8',
  },
  personHead: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#4E9B62',
  },
  personBody: {
    position: 'absolute',
    left: 38,
    top: 56,
    width: 25,
    height: 94,
    borderRadius: 999,
    backgroundColor: '#4E9B62',
    transform: [{ rotate: '32deg' }],
  },
  personArm: {
    position: 'absolute',
    left: 60,
    top: 34,
    width: 14,
    height: 88,
    borderRadius: 999,
    backgroundColor: '#A185E8',
    transform: [{ rotate: '41deg' }],
  },
  personLeg: {
    position: 'absolute',
    left: 23,
    bottom: -15,
    width: 24,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#6D4338',
    transform: [{ rotate: '24deg' }],
  },
  sunWrap: {
    position: 'absolute',
    right: 20,
    bottom: 42,
    width: 42,
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sunCore: {
    width: 38,
    height: 20,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: '#E48677',
  },
  sunRayTop: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 13,
    borderRadius: 999,
    backgroundColor: '#D58A23',
  },
  sunRayLeft: {
    position: 'absolute',
    left: 3,
    top: 10,
    width: 4,
    height: 13,
    borderRadius: 999,
    backgroundColor: '#D58A23',
    transform: [{ rotate: '-48deg' }],
  },
  sunRayRight: {
    position: 'absolute',
    right: 3,
    top: 10,
    width: 4,
    height: 13,
    borderRadius: 999,
    backgroundColor: '#D58A23',
    transform: [{ rotate: '48deg' }],
  },
  pathOne: {
    position: 'absolute',
    right: 19,
    bottom: 20,
    width: 64,
    height: 17,
    borderRadius: 999,
    backgroundColor: '#7C6761',
    transform: [{ rotate: '-14deg' }],
  },
  pathTwo: {
    position: 'absolute',
    right: 27,
    bottom: 5,
    width: 50,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#E48677',
    transform: [{ rotate: '-33deg' }],
  },
  pathCut: {
    position: 'absolute',
    right: 40,
    bottom: 17,
    width: 54,
    height: 11,
    borderRadius: 999,
    backgroundColor: '#FFFDFC',
    transform: [{ rotate: '-21deg' }],
    opacity: 0.9,
  },

  textBlock: {
    alignItems: 'center',
    maxWidth: 320,
  },
  brand: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    color: '#3E2420',
    letterSpacing: -1,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '700',
    color: '#6E5751',
    textAlign: 'center',
  },

  bottomArea: {
    alignItems: 'center',
  },
  beginButton: {
    minWidth: 180,
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 22,
    backgroundColor: '#6D4338',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D4338',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  beginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomNote: {
    marginTop: 14,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#9E8780',
    textAlign: 'center',
  },
});

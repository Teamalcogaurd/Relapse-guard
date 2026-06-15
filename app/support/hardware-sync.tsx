import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#FDFBF9',
  card: 'rgba(255,255,255,0.85)',
  border: 'rgba(231, 215, 207, 0.4)',
  heading: '#2D1A18',
  text: '#5D443F',
  muted: '#A5928E',
  blue: '#5E7FE6',
  sage: '#6BBF83',
  rose: '#E87D8E',
  lavender: '#A185E8',
  white: '#FFFFFF',
};

export default function HardwareSyncScreen() {
  const { hardwareState, connectHardware, disconnectHardware } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<string[]>([]);
  
  const floatingAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const timer = setTimeout(() => {
        setFoundDevices(['SoberShield Watch X1']);
        setIsScanning(false);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      pulseAnim.setValue(1);
    }
  }, [isScanning]);

  const floatingY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#F5F7FF', '#FDFBF9']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={COLORS.heading} />
          </Pressable>
          <Text style={styles.title}>Pair Device</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introWrap}>
            <Text style={styles.introTitle}>Let's find your wearable</Text>
            <Text style={styles.introSubtitle}>Connecting your watch helps us keep your recovery journey safe and personalized.</Text>
          </View>

          <View style={styles.visualSection}>
            {isScanning && (
              <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
            )}
            <Animated.View style={[styles.deviceVisual, { transform: [{ translateY: floatingY }] }]}>
              <LinearGradient
                colors={['#FFFFFF', '#F0F4FF']}
                style={styles.visualGradient}
              />
              <MaterialCommunityIcons 
                name={hardwareState.connected ? "watch-variant" : "watch-import"} 
                size={80} 
                color={hardwareState.connected ? COLORS.sage : COLORS.blue} 
              />
            </Animated.View>
          </View>

          {hardwareState.connected ? (
            <View style={styles.connectedCard}>
              <View style={styles.checkWrap}>
                <Ionicons name="checkmark-circle" size={32} color={COLORS.sage} />
              </View>
              <Text style={styles.connectedTitle}>Beautifully Connected</Text>
              <Text style={styles.connectedDevice}>{hardwareState.deviceName}</Text>
              <View style={styles.batteryRow}>
                <Ionicons name="battery-charging" size={16} color={COLORS.sage} />
                <Text style={styles.batteryText}>{hardwareState.batteryLevel}% Battery</Text>
              </View>
              
              <Pressable 
                onPress={() => router.push('/support/vitals')}
                style={styles.vitalsButton}
              >
                <Text style={styles.vitalsButtonText}>View Live Vitals</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </Pressable>

              <Pressable onPress={disconnectHardware} style={styles.disconnectLink}>
                <Text style={styles.disconnectLinkText}>Disconnect Device</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.actionWrap}>
              {!isScanning && foundDevices.length === 0 && (
                <Pressable onPress={() => setIsScanning(true)} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Find my Watch</Text>
                </Pressable>
              )}

              {isScanning && (
                <View style={styles.scanningLabelWrap}>
                  <ActivityIndicator color={COLORS.blue} style={{ marginBottom: 10 }} />
                  <Text style={styles.scanningLabel}>Searching with love...</Text>
                </View>
              )}

              {foundDevices.length > 0 && !isScanning && (
                <View style={styles.deviceList}>
                  <Text style={styles.listLabel}>Found 1 device nearby</Text>
                  {foundDevices.map((d) => (
                    <Pressable 
                      key={d} 
                      onPress={() => connectHardware(d)}
                      style={styles.deviceItem}
                    >
                      <View style={styles.deviceIconWrap}>
                        <MaterialCommunityIcons name="watch" size={24} color={COLORS.blue} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.foundDeviceName}>{d}</Text>
                        <Text style={styles.foundDeviceStatus}>Ready to pair</Text>
                      </View>
                      <View style={styles.pairButton}>
                        <Text style={styles.pairButtonText}>Pair</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.benefitSection}>
            <BenefitItem 
              icon="heart-outline" 
              title="Real-time HRV" 
              desc="Detect stress before it becomes a craving."
            />
            <BenefitItem 
              icon="shield-checkmark-outline" 
              title="Privacy First" 
              desc="Your biometric data is encrypted and stays local."
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BenefitItem({ icon, title, desc }: any) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={20} color={COLORS.blue} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.heading },
  content: { padding: 24 },
  
  introWrap: { alignItems: 'center', marginBottom: 40 },
  introTitle: { fontSize: 28, fontWeight: '900', color: COLORS.heading, marginBottom: 12, textAlign: 'center' },
  introSubtitle: { fontSize: 15, color: COLORS.text, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },

  visualSection: { height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(94, 127, 230, 0.15)',
  },
  deviceVisual: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5E7FE6',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  visualGradient: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },

  connectedCard: {
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
  },
  checkWrap: { marginBottom: 16 },
  connectedTitle: { fontSize: 20, fontWeight: '900', color: COLORS.heading, marginBottom: 4 },
  connectedDevice: { fontSize: 16, fontWeight: '700', color: COLORS.muted, marginBottom: 12 },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
  batteryText: { fontSize: 13, fontWeight: '700', color: COLORS.sage },
  
  vitalsButton: {
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'center',
  },
  vitalsButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  disconnectLink: { marginTop: 16 },
  disconnectLinkText: { fontSize: 14, fontWeight: '700', color: COLORS.muted, textDecorationLine: 'underline' },

  actionWrap: { alignItems: 'center' },
  primaryButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 24,
    shadowColor: COLORS.blue,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  primaryButtonText: { color: COLORS.white, fontSize: 17, fontWeight: '900' },
  
  scanningLabelWrap: { alignItems: 'center' },
  scanningLabel: { fontSize: 14, fontWeight: '700', color: COLORS.blue },

  deviceList: { width: '100%' },
  listLabel: { fontSize: 13, fontWeight: '700', color: COLORS.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  deviceItem: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deviceIconWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F0F4FF', alignItems: 'center', justifyContent: 'center' },
  foundDeviceName: { fontSize: 16, fontWeight: '800', color: COLORS.heading },
  foundDeviceStatus: { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  pairButton: { backgroundColor: COLORS.blue, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  pairButtonText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },

  benefitSection: { marginTop: 40, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 30, gap: 20 },
  benefitItem: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  benefitIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F4FF', alignItems: 'center', justifyContent: 'center' },
  benefitTitle: { fontSize: 15, fontWeight: '800', color: COLORS.heading, marginBottom: 2 },
  benefitDesc: { fontSize: 13, color: COLORS.text, lineHeight: 18, fontWeight: '500' },
});

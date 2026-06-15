import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

function SoberShieldHeaderMark() {
  return (
    <View style={styles.markWrap}>
      <View style={styles.markDot} />

      <View style={styles.markBars}>
        <View style={[styles.markBar, { height: 10 }]} />
        <View style={[styles.markBar, { height: 18 }]} />
        <View style={[styles.markBarCenter, { height: 30 }]} />
        <View style={[styles.markBar, { height: 18 }]} />
        <View style={[styles.markBar, { height: 10 }]} />
      </View>

      <View style={styles.markRing}>
        <View style={styles.markCore} />
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;
  const cardScale = useRef(new Animated.Value(0.98)).current;

  const pinInputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise, cardScale]);

  const focusPin = () => {
    pinInputRef.current?.focus();
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(cleaned);
    if (error) setError('');
  };

  const handlePinChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(cleaned);
    if (error) setError('');
  };

  const isPhoneValid = phone.length === 10;
  const isPinValid = pin.length === 4;
  const canSubmit = isPhoneValid && isPinValid;

  const handleLogin = () => {
    if (!isPhoneValid) {
      setError('Enter a 10-digit phone number.');
      return;
    }

    if (!isPinValid) {
      setError('Enter your 4-digit PIN.');
      return;
    }

    Keyboard.dismiss();

    const account = { phone: `+91${phone}`, name: 'SoberShield User' };
    if (mode === 'signin') {
      login(account);
    } else {
      signup(account);
    }

    router.replace('/(tabs)');

    setTimeout(() => {
      router.push('/emotion-log');
    }, 120);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
          >
            <Animated.View
              style={[
                styles.inner,
                {
                  opacity: fade,
                  transform: [{ translateY: rise }],
                },
              ]}
            >
              <View style={styles.headerArea}>
                <SoberShieldHeaderMark />

                <Text style={styles.brand}>SoberShield</Text>
                <Text style={styles.brandText}>
                  A softer space for recovery, support, and steady progress.
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ scale: cardScale }],
                  },
                ]}
              >
                <View style={styles.segmentWrap}>
                  <Pressable
                    style={[
                      styles.segmentButton,
                      mode === 'signin' && styles.segmentButtonActive,
                    ]}
                    onPress={() => setMode('signin')}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        mode === 'signin' && styles.segmentTextActive,
                      ]}
                    >
                      Sign In
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.segmentButton,
                      mode === 'signup' && styles.segmentButtonActive,
                    ]}
                    onPress={() => setMode('signup')}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        mode === 'signup' && styles.segmentTextActive,
                      ]}
                    >
                      New Account
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.formWrap}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.label}>Phone number</Text>
                    <Text style={styles.counterText}>{phone.length}/10</Text>
                  </View>

                  <View style={styles.inputShell}>
                    <View style={styles.prefixWrap}>
                      <Ionicons
                        name="phone-portrait-outline"
                        size={18}
                        color="#6D4338"
                      />
                      <Text style={styles.prefixText}>+91</Text>
                    </View>

                    <View style={styles.inputDivider} />

                    <TextInput
                      value={phone}
                      onChangeText={handlePhoneChange}
                      placeholder="10 digit number"
                      placeholderTextColor="#AA928B"
                      keyboardType="number-pad"
                      textContentType="telephoneNumber"
                      maxLength={10}
                      returnKeyType="next"
                      onSubmitEditing={focusPin}
                      style={styles.input}
                    />

                    {isPhoneValid ? (
                      <Ionicons name="checkmark-circle" size={19} color="#4E9B62" />
                    ) : null}
                  </View>

                  <View style={styles.fieldHeader}>
                    <Text style={styles.label}>Your PIN</Text>
                    <Text style={styles.counterText}>{pin.length}/4</Text>
                  </View>

                  <Pressable style={styles.pinShell} onPress={focusPin}>
                    <TextInput
                      ref={pinInputRef}
                      value={pin}
                      onChangeText={handlePinChange}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      secureTextEntry
                      maxLength={4}
                      caretHidden
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      style={styles.pinInputOverlay}
                    />

                    <View style={styles.pinDotsWrap}>
                      {[0, 1, 2, 3].map((i) => {
                        const filled = i < pin.length;
                        return (
                          <View
                            key={i}
                            style={[
                              styles.pinDot,
                              filled && styles.pinDotFilled,
                            ]}
                          />
                        );
                      })}
                    </View>
                  </Pressable>

                  {!!error && (
                    <View style={styles.errorBox}>
                      <Ionicons name="alert-circle-outline" size={16} color="#D86D7C" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <Pressable
                    style={({ pressed }) => [
                      styles.ctaButton,
                      !canSubmit && styles.ctaButtonDisabled,
                      pressed && canSubmit && styles.ctaButtonPressed,
                    ]}
                    onPress={handleLogin}
                  >
                    <Text style={styles.ctaText}>
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#FFFFFF"
                    />
                  </Pressable>
                </View>

                <View style={styles.trustRow}>
                  <View style={styles.trustChip}>
                    <Ionicons
                      name="sparkles-outline"
                      size={14}
                      color="#6D4338"
                    />
                    <Text style={styles.trustText}>Private</Text>
                  </View>

                  <View style={styles.trustChip}>
                    <Ionicons
                      name="leaf-outline"
                      size={14}
                      color="#4E9B62"
                    />
                    <Text style={styles.trustText}>Gentle</Text>
                  </View>

                  <View style={styles.trustChip}>
                    <Ionicons
                      name="server-outline"
                      size={14}
                      color="#4FA6C8"
                    />
                    <Text style={styles.trustText}>Local Data</Text>
                  </View>
                </View>

                <View style={styles.quoteWrap}>
                  <View style={styles.quoteLine} />
                  <Text style={styles.quoteText}>
                    Recovery is allowed to feel soft, human, and unfinished.
                  </Text>
                </View>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8EFEB' },
  safe: { flex: 1 },
  flex: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 36,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
  },

  headerArea: {
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 6,
  },

  markWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 18,
  },
  markDot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: '#E48677',
  },
  markBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  markBar: {
    width: 6,
    borderRadius: 999,
    backgroundColor: '#A185E8',
  },
  markBarCenter: {
    width: 6,
    borderRadius: 999,
    backgroundColor: '#E48677',
  },
  markRing: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#D7C4BC',
    backgroundColor: '#FFF8F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCore: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#6D4338',
  },

  brand: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    color: '#3E2420',
    letterSpacing: -0.8,
    marginBottom: 10,
    textAlign: 'center',
  },
  brandText: {
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '700',
    color: '#6E5751',
    textAlign: 'center',
    maxWidth: 320,
  },

  card: {
    backgroundColor: 'rgba(255,253,252,0.88)',
    borderRadius: 30,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D8D0',
    shadowColor: '#6D4338',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: '#F2E4DD',
    borderRadius: 22,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#7B4C3F',
  },
  segmentText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#A1877F',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },

  formWrap: {
    gap: 10,
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 2,
  },

  inputShell: {
    height: 68,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2D2CA',
    backgroundColor: '#FFF9F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  prefixWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 92,
  },
  prefixText: {
    color: '#3E2420',
    fontSize: 17,
    fontWeight: '800',
  },
  inputDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E4D5CE',
    marginHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#3E2420',
    minWidth: 0,
  },

  label: {
    color: '#3E2420',
    fontSize: 15.5,
    fontWeight: '800',
  },
  counterText: {
    color: '#9E8780',
    fontSize: 12.5,
    fontWeight: '800',
  },

  pinShell: {
    height: 68,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2D2CA',
    backgroundColor: '#FFF9F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pinInputOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.01,
  },
  pinDotsWrap: {
    flexDirection: 'row',
    gap: 22,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: '#D8C7BF',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#7B4C3F',
    borderColor: '#7B4C3F',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBE8EC',
    borderWidth: 1,
    borderColor: '#F2C9D1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    flex: 1,
    color: '#B84F60',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },

  ctaButton: {
    height: 66,
    borderRadius: 24,
    backgroundColor: '#E48677',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    shadowColor: '#E48677',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  ctaButtonDisabled: {
    backgroundColor: '#D9C7BF',
    shadowOpacity: 0.04,
  },
  ctaButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.992 }],
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F8EFEA',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  trustText: {
    color: '#6E5751',
    fontSize: 13,
    fontWeight: '800',
  },

  quoteWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  quoteLine: {
    width: 4,
    height: 62,
    borderRadius: 999,
    backgroundColor: '#A185E8',
    marginTop: 4,
  },
  quoteText: {
    flex: 1,
    color: '#6E5751',
    fontSize: 14.5,
    lineHeight: 24,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppTextInput } from '@/components/AppTextInput';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function SignupScreen() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!name.trim()) {
      setError('Please add your name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.trim().length < 4) {
      setError('Password should be at least 4 characters.');
      return;
    }

    setError('');
    login(name);
    router.replace('/(public)/calibration');
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.eyebrow}>Create your safe space</Text>
          <Text style={styles.title}>Simple setup. Calm support. No judgment.</Text>
          <Text style={styles.subtitle}>
            Set up your support tools, reflect honestly, and build progress gently.
          </Text>
        </View>

        <GlassCard style={styles.card}>
          <AppTextInput label="Name" value={name} onChangeText={setName} placeholder="Your name" />
          <AppTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
          />
          <AppTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Create password"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AppButton label="Create account" onPress={handleSignup} />
          <AppButton
            label="Sign in instead"
            variant="ghost"
            onPress={() => router.push('/(public)/login')}
            style={{ marginTop: 8 }}
          />
        </GlassCard>

        <Text style={styles.footer}>
          Already have an account?{' '}
          <Link href="/(public)/login" style={styles.link}>
            Sign in
          </Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  top: {
    marginBottom: 22
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800'
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22
  },
  card: {
    paddingTop: 20
  },
  error: {
    color: colors.amber,
    marginBottom: 14,
    fontSize: 13
  },
  footer: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 14
  },
  link: {
    color: colors.primary
  }
});
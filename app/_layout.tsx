import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { AppBackground } from '@/components/AppBackground';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppBackground>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(public)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="emotion-log"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="support/breathing" />
            <Stack.Screen name="support/grounding" />
            <Stack.Screen name="support/emergency" />
            <Stack.Screen name="support/emergency-video" />
            <Stack.Screen name="support/recovery-videos" />
            <Stack.Screen name="support/recovery-mode" />
            <Stack.Screen name="support/craving-log" />
            <Stack.Screen name="support/check-in" />
            <Stack.Screen name="support/streak" />
            <Stack.Screen name="support/achievements" />
            <Stack.Screen name="support/history" />
            <Stack.Screen name="support/profile" />
            <Stack.Screen name="support/hardware-sync" />
            <Stack.Screen name="support/vitals" />
          </Stack>
        </AppBackground>
      </AppProvider>
    </SafeAreaProvider>
  );
}

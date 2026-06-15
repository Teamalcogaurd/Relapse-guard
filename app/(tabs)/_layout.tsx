import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 8,
          height: 72,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 30,
          backgroundColor: 'rgba(255,253,252,0.96)',
          borderTopWidth: 0,
          shadowColor: '#B88E81',
          shadowOpacity: 0.11,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        },
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.iconSoft,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: 'home-outline',
            journal: 'book-outline',
            support: 'sparkles-outline',
            progress: 'bar-chart-outline',
            settings: 'settings-outline',
          };

          return (
            <Ionicons
              name={map[route.name] ?? 'ellipse-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
      <Tabs.Screen name="support" options={{ title: 'Support' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
} 
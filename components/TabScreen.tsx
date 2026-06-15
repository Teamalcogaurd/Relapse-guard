import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#F8EFEB',
  card: '#FFFDFC',
  border: '#E8D8CF',
  heading: '#3E2420',
  text: '#6E5751',
};

export function TabScreen({
  title,
  subtitle,
  children,
  contentStyle,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}) {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, contentStyle]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function AppCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.heading,
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: COLORS.text,
    fontWeight: '600',
    maxWidth: '92%',
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#B78F84',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});

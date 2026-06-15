import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const UI = {
  colors: {
    bg: '#F8EFEB',
    bg2: '#F5EAE5',
    bg3: '#F2E7F4',

    card: '#FFFDFC',
    cardSoft: '#FBF5F1',
    cardLavender: '#F3EDFB',
    cardPeach: '#FAEEE7',

    border: '#E7D7CF',
    borderSoft: '#EFE3DD',

    heading: '#3E2420',
    text: '#3E2420',
    textSoft: '#6E5751',
    textMuted: '#9E8780',

    brown: '#6D4338',
    coral: '#E48677',
    peach: '#F2DFD4',
    lavender: '#DDD1F3',
    lavenderStrong: '#A185E8',
    blueSoft: '#DDE5FF',
    blueStrong: '#5E7FE6',
    sage: '#D7E7D7',
    sageStrong: '#4E9B62',
    amber: '#F3E3C3',
    amberStrong: '#D58A23',
    rose: '#F2D7DD',
    roseStrong: '#D86D7C',

    white: '#FFFFFF',
  },

  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  radii: {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 30,
    pill: 999,
  },
};

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={bgStyles.root}>
      <View style={bgStyles.content}>{children}</View>
    </View>
  );
}

const bgStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UI.colors.bg,
  },
  content: {
    flex: 1,
  },
});

export function Screen({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <SafeAreaView style={screenStyles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={screenStyles.safe}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            screenStyles.content,
            padded && { padding: UI.spacing.md },
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingBottom: 42,
  },
});

export function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return <View style={[cardStyles.card, style]}>{children}</View>;
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: UI.colors.card,
    borderRadius: UI.radii.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: UI.colors.border,
    shadowColor: '#B78F84',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles.base,
        variant === 'primary' && buttonStyles.primary,
        variant === 'secondary' && buttonStyles.secondary,
        variant === 'ghost' && buttonStyles.ghost,
        pressed && buttonStyles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          buttonStyles.text,
          variant === 'primary' && buttonStyles.primaryText,
          variant === 'secondary' && buttonStyles.secondaryText,
          variant === 'ghost' && buttonStyles.ghostText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: 18,
    paddingHorizontal: UI.spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: UI.colors.brown,
  },
  secondary: {
    backgroundColor: UI.colors.cardSoft,
    borderWidth: 1.5,
    borderColor: UI.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },
  text: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  primaryText: {
    color: UI.colors.white,
  },
  secondaryText: {
    color: UI.colors.heading,
  },
  ghostText: {
    color: UI.colors.brown,
  },
});

export function AppTextInput({
  label,
  multiline,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={UI.colors.textMuted}
        multiline={multiline}
        style={[inputStyles.input, multiline && inputStyles.multiline]}
        {...props}
      />
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    color: UI.colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF9F6',
    color: UI.colors.text,
    borderRadius: UI.radii.lg,
    borderWidth: 1.5,
    borderColor: UI.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    fontWeight: '600',
  },
  multiline: {
    minHeight: 130,
    textAlignVertical: 'top',
  },
});

export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[chipStyles.chip, active && chipStyles.active]}>
      <Text style={[chipStyles.text, active && chipStyles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: UI.radii.pill,
    backgroundColor: '#F4ECE8',
    borderWidth: 1.2,
    borderColor: UI.colors.borderSoft,
    marginRight: 8,
    marginBottom: 8,
  },
  active: {
    backgroundColor: UI.colors.lavender,
    borderColor: '#C5B0F0',
  },
  text: {
    color: UI.colors.textSoft,
    fontSize: 14,
    fontWeight: '800',
  },
  activeText: {
    color: UI.colors.lavenderStrong,
  },
});

export function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={headerStyles.row}>
      <View style={{ flex: 1 }}>
        <Text style={headerStyles.title}>{title}</Text>
        {subtitle ? <Text style={headerStyles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: UI.colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: UI.colors.textSoft,
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
});

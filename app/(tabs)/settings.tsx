import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { GlassCard } from '@/components/GlassCard';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const app = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activityTracking, setActivityTracking] = useState(true);

  const user = app?.user ?? null;
  const isLoggedIn = app?.isLoggedIn ?? false;
  const displayName = user?.name || user?.fullName || user?.username || 'RelapseGaurd User';
  const userEmail = user?.email || 'user@relapsegaurd.app';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (app?.logout) {
      await app.logout();
      router.replace('/(public)/login');
    }
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Settings</Text>
          <Text style={styles.title}>Your account</Text>
        </View>

        {/* Account Card */}
        <GlassCard style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.cardLavender }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{displayName}</Text>
              <Text style={styles.accountEmail}>{userEmail}</Text>
              {isLoggedIn && (
                <View style={styles.accountStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              )}
            </View>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => router.push('/support/profile')}
          >
            <Ionicons name="pencil" size={16} color={colors.lavenderStrong} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </GlassCard>

        {/* Preferences Section */}
        <SectionTitle title="Preferences" icon="settings" />
        <GlassCard>
          <SettingToggleRow
            icon="notifications"
            iconColor={colors.amberStrong}
            iconTint={colors.amber}
            title="Notifications"
            subtitle="Daily check-ins and reminders"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
          <Divider />
          <SettingToggleRow
            icon="bar-chart"
            iconColor={colors.sageStrong}
            iconTint={colors.sage}
            title="Activity tracking"
            subtitle="Analytics and insights"
            value={activityTracking}
            onChange={setActivityTracking}
          />
        </GlassCard>

        {/* Progress & Data Section */}
        <SectionTitle title="Your data" icon="trending-up" />
        <GlassCard>
          <SettingRow
            icon="pulse"
            iconColor={colors.lavenderStrong}
            iconTint={colors.cardLavender}
            title="Streaks & milestones"
            subtitle="View your recovery timeline"
            onPress={() => router.push('/(tabs)/progress')}
          />
          <Divider />
          <SettingRow
            icon="ribbon"
            iconColor={colors.amberStrong}
            iconTint={colors.amber}
            title="Achievements"
            subtitle="Earned badges"
            onPress={() => router.push('/support/achievements')}
          />
          <Divider />
          <SettingRow
            icon="time"
            iconColor={colors.brown}
            iconTint={colors.cardPeach}
            title="History"
            subtitle="Activity log"
            onPress={() => router.push('/support/history')}
          />
        </GlassCard>

        {/* Privacy & Data Section */}
        <SectionTitle title="Privacy" icon="shield-checkmark" />
        <GlassCard>
          <SettingRow
            icon="lock-closed"
            iconColor={colors.brown}
            iconTint={colors.cardPeach}
            title="Privacy policy"
            subtitle="Data protection"
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="document-text"
            iconColor={colors.blueStrong}
            iconTint={colors.blueSoft}
            title="Terms"
            subtitle="Legal agreements"
            onPress={() => {}}
          />
        </GlassCard>

        {/* Account Management Section */}
        {isLoggedIn && (
          <View style={styles.accountActions}>
            <Pressable
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.roseStrong} />
              <Text style={styles.logoutButtonText}>Sign out</Text>
            </Pressable>
          </View>
        )}

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your data is encrypted and stays private.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SectionTitle({ 
  title, 
  icon 
}: { 
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={colors.lavenderStrong} 
          style={styles.sectionTitleIcon}
        />
      )}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function SettingRow({
  icon,
  iconTint,
  iconColor,
  title,
  subtitle,
  onPress,
  trailingLabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconTint: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  trailingLabel?: string;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed
      ]}
      onPress={onPress}
    >
      <View style={[styles.rowIconWrap, { backgroundColor: iconTint }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.rowRight}>
        {trailingLabel && (
          <Text style={styles.trailingLabel}>{trailingLabel}</Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

function SettingToggleRow({
  icon,
  iconTint,
  iconColor,
  title,
  subtitle,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconTint: string;
  iconColor: string;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.rowIconWrap, { backgroundColor: iconTint }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.borderSoft, true: colors.cardLavender }}
        thumbColor={value ? colors.lavenderStrong : '#f4f3f4'}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F7EFEA',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  /* Header */
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.heading,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  /* Account Card */
  accountCard: {
    marginBottom: 28,
    padding: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: colors.lavenderStrong,
    fontSize: 26,
    fontWeight: '900',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  accountEmail: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  accountStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sageStrong,
  },
  statusText: {
    color: colors.sageStrong,
    fontSize: 12,
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.cardLavender,
    borderRadius: 10,
  },
  editButtonText: {
    color: colors.lavenderStrong,
    fontSize: 14,
    fontWeight: '800',
  },

  /* Section Title */
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitleIcon: {
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  /* Row Items */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowPressed: {
    opacity: 0.7,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: colors.heading,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  rowSubtitle: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trailingLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.borderSoft,
    borderRadius: 6,
  },
  switch: {
    marginLeft: 8,
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 10,
  },

  /* Account Actions */
  accountActions: {
    marginTop: 28,
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.rose,
    backgroundColor: 'rgba(216, 109, 124, 0.08)',
  },
  logoutButtonText: {
    color: colors.roseStrong,
    fontSize: 15,
    fontWeight: '800',
  },

  /* Footer */
  footer: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
});

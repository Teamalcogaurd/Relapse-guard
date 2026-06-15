import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { colors } from '@/constants/theme';
import { RecoveryVideo } from '@/types';

export function VideoRecommendationCard({
  video,
  onWatch,
  onSkip,
}: {
  video: RecoveryVideo;
  onWatch: (video: RecoveryVideo) => void;
  onSkip: (videoId: string) => void;
}) {
  const accent = video.emergency ? colors.roseStrong : colors.blueStrong;

  return (
    <View style={[styles.card, video.emergency && styles.emergencyCard]}>
      <View style={styles.mediaWrap}>
        {video.thumbnailUrl ? (
          <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Text style={styles.placeholderText}>Video</Text>
          </View>
        )}
        <View style={[styles.tag, { backgroundColor: accent + '18' }]}> 
          <Text style={[styles.tagText, { color: accent }]}> 
            {video.emergency ? 'Emergency' : video.category.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{video.title}</Text>
      <Text style={styles.description}>{video.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{video.duration} min</Text>
        <Text style={styles.metaText}>Score {video.moodBoostScore.toFixed(1)}</Text>
      </View>

      <View style={styles.actionsRow}>
        <AppButton label="Watch" onPress={() => onWatch(video)} />
        <Pressable onPress={() => onSkip(video.id)} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: colors.border,
    marginBottom: 14,
  },
  emergencyCard: {
    borderColor: colors.roseStrong,
    backgroundColor: '#FFF5F7',
  },
  mediaWrap: {
    position: 'relative',
    marginBottom: 14,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    backgroundColor: colors.cardSoft,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  tag: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.heading,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  description: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  skipButton: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: colors.cardSoft,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '800',
  },
});

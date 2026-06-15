import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecoveryVideo, SensorState, VideoContext, VideoInteraction } from '@/types';

const VIDEO_CACHE_KEY = 'rg_recovery_video_library';
const VIDEO_HISTORY_KEY = 'rg_recovery_video_history';
const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIRESTORE_BASE = FIREBASE_PROJECT_ID
  ? `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`
  : '';

const STATIC_RECOVERY_VIDEOS: RecoveryVideo[] = [
  {
    id: 'stress-breathing-01',
    title: 'Calm Breathing Reset',
    description: 'A short guided breathing practice to ease stress and lower tension.',
    category: 'stress',
    duration: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    moodBoostScore: 4.8,
  },
  {
    id: 'anxiety-grounding-01',
    title: 'Grounding with Nature',
    description: 'A calming anchor practice to bring your attention back to the present.',
    category: 'anxiety',
    duration: 5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    moodBoostScore: 4.7,
  },
  {
    id: 'anger-control-01',
    title: 'Anger Release Movement',
    description: 'A gentle movement and breathing routine to calm angry energy safely.',
    category: 'anger',
    duration: 7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526401485004-0f07558a7f6a?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    moodBoostScore: 4.4,
  },
  {
    id: 'loneliness-support-01',
    title: 'Supportive Recovery Talk',
    description: 'A compassionate short talk to help you feel less alone right now.',
    category: 'loneliness',
    duration: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    moodBoostScore: 4.6,
  },
  {
    id: 'sadness-recovery-01',
    title: 'Soft Self-Compassion',
    description: 'A gentle recovery clip for soothing sadness and building emotional safety.',
    category: 'sadness',
    duration: 5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    moodBoostScore: 4.5,
  },
  {
    id: 'high-craving-emergency-01',
    title: 'Emergency Urge Support',
    description: 'A rapid intervention guide to help you hold the urge and stay safe.',
    category: 'high_craving',
    duration: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    emergency: true,
    moodBoostScore: 5.0,
  },
  {
    id: 'general-reset-01',
    title: 'Quick Calm Reset',
    description: 'A versatile recovery video for moments when you need a fast reset.',
    category: 'general',
    duration: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=nqye02H_H6I',
    moodBoostScore: 4.2,
  },
];

type FirestoreVideoList = {
  documents?: Array<{
    name?: string;
    fields?: Record<string, any>;
  }>;
};

function parseArrayField(field: any): string[] {
  if (!field) return [];
  if (field.stringValue) {
    try {
      return JSON.parse(field.stringValue);
    } catch {
      return [field.stringValue];
    }
  }
  if (field.arrayValue?.values) {
    return field.arrayValue.values.map((item: any) => item.stringValue || '');
  }
  return [];
}

function parseFirestoreVideo(doc: any): RecoveryVideo | null {
  if (!doc?.fields) return null;
  return {
    id: doc.fields.id?.stringValue || 'unknown-video',
    title: doc.fields.title?.stringValue || 'Recovery video',
    description: doc.fields.description?.stringValue || '',
    category: (doc.fields.category?.stringValue || 'general') as RecoveryVideo['category'],
    duration: Number(doc.fields.duration?.integerValue || doc.fields.duration?.doubleValue || 5),
    thumbnailUrl:
      doc.fields.thumbnailUrl?.stringValue ||
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=60',
    videoUrl: doc.fields.videoUrl?.stringValue || 'https://www.youtube.com',
    emergency: doc.fields.emergency?.booleanValue || false,
    moodBoostScore: Number(doc.fields.moodBoostScore?.doubleValue || doc.fields.moodBoostScore?.integerValue || 4.0),
  };
}

async function getRemoteVideoLibrary(): Promise<RecoveryVideo[] | null> {
  if (!FIRESTORE_BASE || !FIREBASE_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${FIRESTORE_BASE}/recoveryVideos?key=${FIREBASE_API_KEY}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as FirestoreVideoList;
    return (
      data.documents ?? []
    )
      .map((doc) => parseFirestoreVideo(doc))
      .filter((video): video is RecoveryVideo => Boolean(video));
  } catch (error) {
    console.warn('Remote video library fetch failed', error);
    return null;
  }
}

async function getCachedVideoLibrary(): Promise<RecoveryVideo[]> {
  try {
    const cached = await AsyncStorage.getItem(VIDEO_CACHE_KEY);
    if (!cached) return [];
    return JSON.parse(cached) as RecoveryVideo[];
  } catch {
    return [];
  }
}

async function cacheVideoLibrary(videos: RecoveryVideo[]) {
  try {
    await AsyncStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(videos));
  } catch {
    // ignore cache failures
  }
}

async function getOfflineVideoLibrary(): Promise<RecoveryVideo[]> {
  const remote = await getRemoteVideoLibrary();
  if (remote && remote.length > 0) {
    await cacheVideoLibrary(remote);
    return remote;
  }

  const cached = await getCachedVideoLibrary();
  if (cached.length > 0) {
    return cached;
  }

  return STATIC_RECOVERY_VIDEOS;
}

async function getVideoHistory(): Promise<VideoInteraction[]> {
  try {
    const cached = await AsyncStorage.getItem(VIDEO_HISTORY_KEY);
    if (!cached) return [];
    return JSON.parse(cached) as VideoInteraction[];
  } catch {
    return [];
  }
}

async function saveVideoHistory(events: VideoInteraction[]) {
  try {
    await AsyncStorage.setItem(VIDEO_HISTORY_KEY, JSON.stringify(events));
  } catch {
    // ignore failure
  }
}

async function syncVideoEventToFirestore(event: VideoInteraction) {
  if (!FIRESTORE_BASE || !FIREBASE_API_KEY) {
    return;
  }

  const payload = {
    fields: {
      videoId: { stringValue: event.videoId },
      action: { stringValue: event.action },
      timestamp: { timestampValue: event.timestamp },
      improvedMood: { booleanValue: event.improvedMood ?? false },
    },
  };

  try {
    await fetch(
      `${FIRESTORE_BASE}/recoveryVideoEvents?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  } catch {
    // best-effort only
  }
}

function normalizeText(value?: string): string {
  return (value || '').toLowerCase().trim();
}

function detectRecoveryCategories(context: VideoContext): RecoveryVideo['category'][] {
  const categories: Set<RecoveryVideo['category']> = new Set();
  if (context.cravingIntensity >= 8) {
    categories.add('high_craving');
  }

  const mood = normalizeText(context.mood);
  if (mood.includes('stressed') || mood.includes('stress') || mood.includes('overwhelmed')) {
    categories.add('stress');
  }

  if (mood.includes('anxious') || mood.includes('anxiety') || mood.includes('nervous')) {
    categories.add('anxiety');
  }

  if (mood.includes('angry') || mood.includes('angry') || mood.includes('frustrated')) {
    categories.add('anger');
  }

  if (mood.includes('lonely') || mood.includes('alone') || mood.includes('sad')) {
    categories.add('loneliness');
  }

  if (context.trigger) {
    const trigger = normalizeText(context.trigger);
    if (trigger.includes('stress') || trigger.includes('work') || trigger.includes('deadline')) {
      categories.add('stress');
    }
    if (trigger.includes('conflict') || trigger.includes('angry') || trigger.includes('hurt')) {
      categories.add('anger');
    }
    if (trigger.includes('boredom') || trigger.includes('lonely') || trigger.includes('missing')) {
      categories.add('loneliness');
    }
    if (trigger.includes('craving') || trigger.includes('urge')) {
      categories.add('high_craving');
    }
    if (trigger.includes('anxious') || trigger.includes('anxiety') || trigger.includes('nervous')) {
      categories.add('anxiety');
    }
  }

  (context.states || []).forEach((state) => {
    const normalized = normalizeText(state);
    if (normalized.includes('stress') || normalized.includes('tense') || normalized.includes('overwhelmed')) {
      categories.add('stress');
    }
    if (normalized.includes('anxious') || normalized.includes('nervous')) {
      categories.add('anxiety');
    }
    if (normalized.includes('angry') || normalized.includes('triggered')) {
      categories.add('anger');
    }
    if (normalized.includes('lonely') || normalized.includes('numb') || normalized.includes('sad')) {
      categories.add('loneliness');
    }
  });

  if (categories.size === 0) {
    categories.add('general');
  }

  return Array.from(categories);
}

function rankVideo(video: RecoveryVideo, categories: RecoveryVideo['category'][], history: VideoInteraction[]) {
  const base = video.moodBoostScore;
  const categoryMatch = categories.includes(video.category) ? 20 : categories.includes('general') ? 5 : 0;
  const emergencyBoost = video.emergency ? 15 : 0;
  const historyScore = history.reduce((score, event) => {
    if (event.videoId !== video.id) return score;
    if (event.action === 'watched') return score + 3;
    if (event.action === 'completed' && event.improvedMood) return score + 7;
    if (event.action === 'skipped') return score - 4;
    return score;
  }, 0);
  const sensorBonus = video.category === 'high_craving' ? 5 : 0;

  return base * 10 + categoryMatch + emergencyBoost + historyScore + sensorBonus;
}

export async function getVideoRecommendations(context: VideoContext): Promise<RecoveryVideo[]> {
  const library = await getOfflineVideoLibrary();
  const history = await getVideoHistory();
  const categories = detectRecoveryCategories(context);

  const sorted = [...library].sort((a, b) => {
    const aScore = rankVideo(a, categories, history);
    const bScore = rankVideo(b, categories, history);
    return bScore - aScore;
  });

  return sorted;
}

export async function getEmergencyVideo(context: VideoContext): Promise<RecoveryVideo | null> {
  const videos = await getVideoRecommendations(context);
  return videos.find((video) => video.emergency) ?? videos[0] ?? null;
}

export async function logVideoInteraction(
  videoId: string,
  action: VideoInteraction['action'],
  improvedMood?: boolean
) {
  const event: VideoInteraction = {
    videoId,
    action,
    timestamp: new Date().toISOString(),
    improvedMood,
  };

  const history = await getVideoHistory();
  await saveVideoHistory([event, ...history]);
  await syncVideoEventToFirestore(event);
}

export function isEmergencyContext(context: VideoContext): boolean {
  const highCraving = context.cravingIntensity >= 8;
  const heartRate = context.sensorData?.heartRate ?? 0;
  const gsr = context.sensorData?.gsr ?? 0;
  const highBiometrics = heartRate >= 105 && gsr >= 50;
  return highCraving && highBiometrics;
}

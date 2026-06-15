export type MoodValence =
  | 'very_unpleasant'
  | 'unpleasant'
  | 'neutral'
  | 'pleasant'
  | 'very_pleasant';

export type MoodLog = {
  title: string;
  subtitle: string;
  contexts: string[];
  labels: string[];
  valence: MoodValence;
  createdAt: string;
};

export type CravingEntry = {
  id: string;
  intensity: number;
  states: string[];
  triggers: string[];
  supports: string[];
  note: string;
  date: string;
};

export type RecoveryOutcome = 'Yes' | 'No' | 'Skip';

export type RecoveryEvent = {
  id: string;
  source: 'manual_recovery' | 'unknown';
  outcome: RecoveryOutcome;
  trigger: string;
  helped: string[];
  note: string;
  durationSeconds: number;
  createdAt: string;
};

export type SensorState = {
  heartRate?: number | null;
  gsr?: number | null;
  bodyTemp?: number | null;
};

export type RecoveryVideoCategory =
  | 'stress'
  | 'anxiety'
  | 'anger'
  | 'loneliness'
  | 'sadness'
  | 'high_craving'
  | 'general';

export type RecoveryVideo = {
  id: string;
  title: string;
  description: string;
  category: RecoveryVideoCategory;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  emergency?: boolean;
  moodBoostScore: number;
};

export type VideoInteractionAction = 'watched' | 'skipped' | 'completed';

export type VideoInteraction = {
  videoId: string;
  action: VideoInteractionAction;
  timestamp: string;
  improvedMood?: boolean;
};

export type VideoContext = {
  cravingIntensity: number;
  mood?: string;
  trigger?: string;
  states?: string[];
  supports?: string[];
  note?: string;
  sensorData?: SensorState;
};

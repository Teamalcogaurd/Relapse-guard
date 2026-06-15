import { Achievement, CheckIn, CravingEntry, DailyJournalEntry, SessionStat, Trigger } from '@/types';

export const triggerOptions: Trigger[] = ['Stress', 'Loneliness', 'Boredom', 'Social pressure', 'Anger', 'Sadness', 'Habit'];

export const moodOptions = ['Calm', 'Uneasy', 'Triggered', 'Craving', 'Overwhelmed', 'Proud'] as const;

export const supportToolOptions = ['Breathing', 'Journaling', 'Grounding', 'Call someone', 'Affirmations'] as const;

export const reflectivePrompts = [
  'What helped you feel a little steadier today?',
  'What do you want to protect tonight?',
  'What felt hard, and what helped anyway?',
  'What are you proud of from today?'
];

export const initialCravings: CravingEntry[] = [
  {
    id: 'c1',
    date: 'Today · 6:30 PM',
    intensity: 7,
    duration: '15 min',
    trigger: 'Stress',
    activity: 'Finishing work',
    feelings: ['restless', 'tense'],
    helped: '3-minute breathing and texting a friend',
    gotThroughIt: true,
    notes: 'The urge passed after stepping away.'
  },
  {
    id: 'c2',
    date: 'Yesterday · 10:10 PM',
    intensity: 5,
    duration: '10 min',
    trigger: 'Habit',
    activity: 'Scrolling alone',
    feelings: ['empty'],
    helped: 'Grounding tool',
    gotThroughIt: true
  }
];

export const initialJournalEntries: DailyJournalEntry[] = [
  {
    id: 'j1',
    date: 'Today',
    title: 'Small win',
    body: 'I paused before reacting and used a breathing session instead.',
    mood: 'Proud',
    tags: ['reflection', 'progress']
  },
  {
    id: 'j2',
    date: 'Yesterday',
    title: 'Evening note',
    body: 'Late nights still feel vulnerable, but naming it helped.',
    mood: 'Uneasy',
    tags: ['late night']
  }
];

export const initialCheckIns: CheckIn[] = [
  {
    id: 'd1',
    date: 'Today',
    mood: 'Calm',
    cravingLevel: 3,
    stress: 4,
    energy: 6,
    confidence: 7,
    reflection: 'steady'
  },
  {
    id: 'd2',
    date: 'Yesterday',
    mood: 'Uneasy',
    cravingLevel: 5,
    stress: 6,
    energy: 4,
    confidence: 5,
    reflection: 'tired'
  }
];

export const initialAchievements: Achievement[] = [
  { id: 'a1', title: 'First Day Logged', description: 'You showed up and tracked your day.', unlocked: true, unlockedOn: 'Apr 10' },
  { id: 'a2', title: 'First Journal Entry', description: 'You chose reflection over avoidance.', unlocked: true, unlockedOn: 'Apr 11' },
  { id: 'a3', title: 'First Craving Logged', description: 'Awareness became action.', unlocked: true, unlockedOn: 'Apr 12' },
  { id: 'a4', title: '3 Day Streak', description: 'Three days of staying with your goal.', unlocked: true, unlockedOn: 'Apr 13' },
  { id: 'a5', title: '7 Day Streak', description: 'A full week protected.', unlocked: false },
  { id: 'a6', title: '14 Day Streak', description: 'Two steady weeks.', unlocked: false },
  { id: 'a7', title: '30 Day Streak', description: 'A meaningful milestone.', unlocked: false },
  { id: 'a8', title: '5 Calm Sessions', description: 'You practiced regulation consistently.', unlocked: false },
  { id: 'a9', title: '10 Honest Check-Ins', description: 'Consistency is building.', unlocked: false }
];

export const progressStats: SessionStat[] = [
  { id: 's1', label: 'Current streak', value: '4 days' },
  { id: 's2', label: 'Calm sessions', value: '3' },
  { id: 's3', label: 'Cravings logged', value: '2' },
  { id: 's4', label: 'Check-ins', value: '6' }
];

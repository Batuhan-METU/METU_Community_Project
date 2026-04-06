import type { Ionicons } from '@expo/vector-icons';

export type NotificationType =
  | 'message'
  | 'event_reminder'
  | 'club_update'
  | 'mention'
  | 'system';

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  /** Club ID to navigate to, if applicable */
  clubId?: string;
  /** Event ID to navigate to, if applicable */
  eventId?: string;
};

export const NOTIFICATION_META: Record<
  NotificationType,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  message:        { icon: 'chatbubble',        color: '#3b82f6' },
  event_reminder: { icon: 'calendar',          color: '#f59e0b' },
  club_update:    { icon: 'people',            color: '#8b5cf6' },
  mention:        { icon: 'at',                color: '#06b6d4' },
  system:         { icon: 'information-circle', color: '#6b7280' },
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'message',
    title: 'New message in AI Builders Club',
    description: 'Elif Kaya: Looks like LLMs win. I\'ll start prepping the notebook. See you all Wednesday!',
    time: '2m ago',
    isRead: false,
    clubId: '2',
  },
  {
    id: 'n2',
    type: 'event_reminder',
    title: 'Campus Acoustic Night — Tomorrow',
    description: 'Doors open at 19:00. Don\'t forget to bring your student ID for check-in.',
    time: '15m ago',
    isRead: false,
    eventId: 'mock-web-acoustic-night',
  },
  {
    id: 'n3',
    type: 'mention',
    title: 'Deniz Yılmaz mentioned you',
    description: '@Eren, can you confirm you\'re bringing the extra mic for acoustic night?',
    time: '1h ago',
    isRead: false,
    clubId: '1',
  },
  {
    id: 'n4',
    type: 'club_update',
    title: 'Astronomy Society posted an update',
    description: 'Observation night rescheduled to Friday due to weather. New time: 21:00.',
    time: '3h ago',
    isRead: true,
    clubId: '6',
  },
  {
    id: 'n5',
    type: 'event_reminder',
    title: 'AI & ML Workshop — This Wednesday',
    description: 'Reminder: bring your laptop with PyTorch installed. Lab GPUs are unavailable.',
    time: '5h ago',
    isRead: true,
    eventId: 'mock-web-ai-ml-workshop',
  },
  {
    id: 'n6',
    type: 'message',
    title: 'New messages in Campus Music Night',
    description: 'Mert Aksoy: I can shoot some reels! 🎥',
    time: '6h ago',
    isRead: true,
    clubId: '1',
  },
  {
    id: 'n7',
    type: 'system',
    title: 'Welcome to METUCom!',
    description: 'Set up your profile and join communities to get personalized event recommendations.',
    time: '2d ago',
    isRead: true,
  },
];

export type HypeEvent = {
  rank: number;
  title: string;
  club: string;
  hypeScore: number;
  change: number;
  rating?: number;
  aiInsights?: string[];
  attendees?: number;
  capacity?: number;
};

export type HypeClub = {
  name: string;
  totalPoints: number;
  eventsThisWeek: number;
  avgRating: number;
  change: number;
};

export const HYPE_TOP_EVENT: HypeEvent = {
  rank: 1,
  title: 'Open Air Movie Night',
  club: 'Cinema Society',
  hypeScore: 635.2,
  change: 12,
  rating: 4.4,
  attendees: 342,
  capacity: 400,
  aiInsights: [
    'Outdoor seating nearly full — 86% capacity reached',
    'Snack pre-orders created buzz before doors opened',
    'Surprise short film teased via Stories drove late sign-ups',
    'Chat volume 3.2× higher than avg campus event',
  ],
};

export const HYPE_RUNNER_UPS: HypeEvent[] = [
  {
    rank: 2,
    title: 'Startup Networking Meetup',
    club: 'METU Entrepreneurship Society',
    hypeScore: 553.4,
    change: 8,
    rating: 4.2,
  },
  {
    rank: 3,
    title: 'AI & Machine Learning Workshop',
    club: 'AI Builders Club',
    hypeScore: 487.1,
    change: 15,
    rating: 4.6,
  },
  {
    rank: 4,
    title: 'Campus Acoustic Night',
    club: 'Campus Music Night',
    hypeScore: 421.8,
    change: -3,
    rating: 4.3,
  },
  {
    rank: 5,
    title: 'Spring Hiking Expedition',
    club: 'ODTÜ DKSK',
    hypeScore: 389.5,
    change: 6,
    rating: 4.1,
  },
];

export const HYPE_TOP_CLUB: HypeClub = {
  name: 'Cinema Society',
  totalPoints: 635.2,
  eventsThisWeek: 3,
  avgRating: 4.4,
  change: 22,
};

export const HYPE_GLOBAL_STATS = {
  totalEvents: 24,
  totalAttendees: 2847,
  avgHypeScore: 412.6,
  weeklyGrowth: 18,
};

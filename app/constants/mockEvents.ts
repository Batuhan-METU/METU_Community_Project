import type { CommunityEvent } from '@/lib/types';

/**
 * Web-aligned demo rows for the Events tab (used when API returns nothing or fails).
 * communityId links to MOCK_CLUBS ids in mockClubs.ts.
 */
export type EventsScreenEvent = CommunityEvent & {
  category: string;
  community: string;
  communityId?: string;
};

export const MOCK_EVENTS_FOR_SCREEN: EventsScreenEvent[] = [
  {
    id: 'mock-web-ai-ml-workshop',
    title: 'AI & Machine Learning Workshop',
    starts_at: '2026-03-18T17:30:00',
    location: 'METU Informatics Institute',
    description: 'Hands-on ML session. Capacity: 42/80 seats. Free entry.',
    is_paid: false,
    ticket_price: null,
    community: 'AI Builders Club',
    communityId: '2',
    category: 'Technology',
  },
  {
    id: 'mock-web-astro-night',
    title: 'Astronomy Observation Night',
    starts_at: '2026-03-20T20:00:00',
    location: 'Physics Department Roof',
    description: 'Stargazing on campus. Capacity: 30/80 seats. Free entry.',
    is_paid: false,
    ticket_price: null,
    community: 'Astronomy Society',
    communityId: '6',
    category: 'Science',
  },
  {
    id: 'mock-web-startup-networking',
    title: 'Startup Networking Meetup',
    starts_at: '2026-03-22T18:00:00',
    location: 'METU Technopolis',
    description: 'Meet founders and mentors. Capacity: 55/100 seats.',
    is_paid: true,
    ticket_price: 50,
    community: 'METU Entrepreneurship Society',
    category: 'Business',
  },
  {
    id: 'mock-web-ux-bootcamp',
    title: 'UI/UX Design Bootcamp',
    starts_at: '2026-03-24T10:00:00',
    location: 'Architecture Faculty, Studio 1',
    description: 'Design sprint & portfolio tips. Capacity: 20/40 seats. Free entry.',
    is_paid: false,
    ticket_price: null,
    community: 'Visual Arts Collective',
    communityId: '4',
    category: 'Art',
  },
  {
    id: 'mock-web-acoustic-night',
    title: 'Campus Acoustic Night',
    starts_at: '2026-03-27T19:30:00',
    location: 'Devrim Stadium',
    description: 'Open-air acoustic sets. Capacity: 150/500 seats. Free entry.',
    is_paid: false,
    ticket_price: null,
    community: 'Campus Music Night',
    communityId: '1',
    category: 'Entertainment',
  },
  {
    id: 'mock-web-spring-hiking',
    title: 'Spring Hiking Expedition',
    starts_at: '2026-03-28T08:00:00',
    location: 'Eymir Lake',
    description: 'Guided hike around the lake. Capacity: 45/50 seats.',
    is_paid: true,
    ticket_price: 100,
    community: 'ODTÜ DKSK',
    category: 'Sports',
  },
];

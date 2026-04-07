import { create } from 'zustand';
import { MOCK_EVENTS_FOR_SCREEN, type EventsScreenEvent } from '@/constants/mockEvents';

/* ─── Seat data keyed by event ID ─── */
type SeatInfo = { totalSeats: number; currentParticipants: number };

const INITIAL_SEATS: Record<string, SeatInfo> = {
  'mock-web-ai-ml-workshop':    { totalSeats: 80,  currentParticipants: 42 },
  'mock-web-astro-night':       { totalSeats: 80,  currentParticipants: 30 },
  'mock-web-startup-networking': { totalSeats: 100, currentParticipants: 55 },
  'mock-web-ux-bootcamp':       { totalSeats: 40,  currentParticipants: 20 },
  'mock-web-acoustic-night':    { totalSeats: 500, currentParticipants: 150 },
  'mock-web-spring-hiking':     { totalSeats: 50,  currentParticipants: 45 },
};

/* ─── Role data (keyed by clubId) used by the Profile screen ─── */
export type ClubRole = {
  role: string;
  isHighLevel: boolean;
};

const ROLE_MAP: Record<string, ClubRole> = {
  '2': { role: 'Project Lead',  isHighLevel: true },
  '1': { role: 'Member',        isHighLevel: false },
  '6': { role: 'Member',        isHighLevel: false },
};

/* ─── Base like counts (simulated "other users" likes) ─── */
const BASE_LIKES: Record<string, number> = {
  'mock-edt': 48,
  'mock-vt': 23,
  'mock-most': 37,
  'mock-web-ai-ml-workshop': 64,
  'mock-web-astro-night': 19,
  'mock-web-startup-networking': 55,
  'mock-web-ux-bootcamp': 31,
  'mock-web-acoustic-night': 112,
  'mock-web-spring-hiking': 42,
};

/* ─── User profile ─── */
export type UserProfile = {
  name: string;
  avatar: string | null;
  department: string;
  bio: string;
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Eren',
  avatar: null,
  department: 'Computer Engineering',
  bio: 'METU student, passionate about building impactful products and connecting people through technology.',
};

/* ─── Admin roles ─── */
export type AdminRole = 'ADMIN' | 'EDITOR' | 'MEMBER';
export type UserRole = { clubId: string; role: AdminRole };

const INITIAL_USER_ROLES: UserRole[] = [
  { clubId: '2', role: 'ADMIN' },
  { clubId: '1', role: 'EDITOR' },
  { clubId: '6', role: 'MEMBER' },
];

/* ─── Club overrides (mutable layer on top of MOCK_CLUBS) ─── */
export type ClubOverride = {
  name?: string;
  desc?: string;
  category?: string;
  aboutUs?: string;
  socialLinks?: { instagram?: string; twitter?: string; website?: string };
};

/* ─── Store shape ─── */
type AppState = {
  joinedClubIds: string[];
  registeredEventIds: string[];
  likedEventIds: string[];
  bookmarkedEventIds: string[];
  seatMap: Record<string, SeatInfo>;
  roleMap: Record<string, ClubRole>;
  baseLikes: Record<string, number>;
  userProfile: UserProfile;
  userRoles: UserRole[];
  clubOverrides: Record<string, ClubOverride>;
  customEvents: EventsScreenEvent[];
  colorSchemeSetting: 'system' | 'light' | 'dark';

  setColorSchemeSetting: (s: 'system' | 'light' | 'dark') => void;
  joinClub: (id: string) => void;
  leaveClub: (id: string) => void;
  registerEvent: (id: string) => void;
  unregisterEvent: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleBookmark: (id: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateClub: (clubId: string, data: ClubOverride) => void;
  createEvent: (event: EventsScreenEvent) => void;

  /* Derived helpers */
  isClubJoined: (id: string) => boolean;
  isEventRegistered: (id: string) => boolean;
  isEventLiked: (id: string) => boolean;
  isEventBookmarked: (id: string) => boolean;
  getLikesCount: (id: string) => number;
  getSeats: (id: string) => SeatInfo | undefined;
  getRegisteredEvents: () => EventsScreenEvent[];
  getBookmarkedEvents: () => EventsScreenEvent[];
  canEditClub: (clubId: string) => boolean;
  getUserRoleForClub: (clubId: string) => AdminRole | null;
  getEditableClubIds: () => string[];
  getAllEvents: () => EventsScreenEvent[];
};

export const useStore = create<AppState>((set, get) => ({
  joinedClubIds: ['1', '2', '6'],
  registeredEventIds: ['mock-web-ai-ml-workshop', 'mock-web-acoustic-night'],
  likedEventIds: [],
  bookmarkedEventIds: [],
  seatMap: { ...INITIAL_SEATS },
  roleMap: { ...ROLE_MAP },
  baseLikes: { ...BASE_LIKES },
  userProfile: { ...DEFAULT_PROFILE },
  userRoles: [...INITIAL_USER_ROLES],
  clubOverrides: {},
  customEvents: [],
  colorSchemeSetting: 'system',

  setColorSchemeSetting: (s) => set({ colorSchemeSetting: s }),
  joinClub: (id) =>
    set((s) => {
      if (s.joinedClubIds.includes(id)) return s;
      return {
        joinedClubIds: [...s.joinedClubIds, id],
        roleMap: { ...s.roleMap, [id]: { role: 'Member', isHighLevel: false } },
      };
    }),

  leaveClub: (id) =>
    set((s) => {
      const next = s.joinedClubIds.filter((cid) => cid !== id);
      const roles = { ...s.roleMap };
      delete roles[id];
      return { joinedClubIds: next, roleMap: roles };
    }),

  registerEvent: (id) =>
    set((s) => {
      if (s.registeredEventIds.includes(id)) return s;
      const seats = { ...s.seatMap };
      if (seats[id]) {
        seats[id] = { ...seats[id], currentParticipants: seats[id].currentParticipants + 1 };
      }
      return { registeredEventIds: [...s.registeredEventIds, id], seatMap: seats };
    }),

  unregisterEvent: (id) =>
    set((s) => {
      const seats = { ...s.seatMap };
      if (seats[id] && seats[id].currentParticipants > 0) {
        seats[id] = { ...seats[id], currentParticipants: seats[id].currentParticipants - 1 };
      }
      return { registeredEventIds: s.registeredEventIds.filter((eid) => eid !== id), seatMap: seats };
    }),

  toggleLike: (id) =>
    set((s) => {
      const already = s.likedEventIds.includes(id);
      return {
        likedEventIds: already
          ? s.likedEventIds.filter((eid) => eid !== id)
          : [...s.likedEventIds, id],
      };
    }),

  toggleBookmark: (id) =>
    set((s) => {
      const already = s.bookmarkedEventIds.includes(id);
      return {
        bookmarkedEventIds: already
          ? s.bookmarkedEventIds.filter((eid) => eid !== id)
          : [...s.bookmarkedEventIds, id],
      };
    }),

  updateProfile: (data) =>
    set((s) => ({ userProfile: { ...s.userProfile, ...data } })),

  updateClub: (clubId, data) =>
    set((s) => ({
      clubOverrides: {
        ...s.clubOverrides,
        [clubId]: { ...(s.clubOverrides[clubId] ?? {}), ...data },
      },
    })),

  createEvent: (event) =>
    set((s) => ({ customEvents: [event, ...s.customEvents] })),

  isClubJoined: (id) => get().joinedClubIds.includes(id),
  isEventRegistered: (id) => get().registeredEventIds.includes(id),
  isEventLiked: (id) => get().likedEventIds.includes(id),
  isEventBookmarked: (id) => get().bookmarkedEventIds.includes(id),
  getLikesCount: (id) => {
    const base = get().baseLikes[id] ?? 0;
    const liked = get().likedEventIds.includes(id);
    return base + (liked ? 1 : 0);
  },
  getSeats: (id) => get().seatMap[id],
  getRegisteredEvents: () => {
    const ids = get().registeredEventIds;
    return MOCK_EVENTS_FOR_SCREEN.filter((e) => ids.includes(e.id));
  },
  getBookmarkedEvents: () => {
    const ids = get().bookmarkedEventIds;
    return MOCK_EVENTS_FOR_SCREEN.filter((e) => ids.includes(e.id));
  },
  canEditClub: (clubId) => {
    const r = get().userRoles.find((ur) => ur.clubId === clubId);
    return r?.role === 'ADMIN' || r?.role === 'EDITOR';
  },
  getUserRoleForClub: (clubId) => {
    const r = get().userRoles.find((ur) => ur.clubId === clubId);
    return r?.role ?? null;
  },
  getEditableClubIds: () => {
    return get().userRoles
      .filter((ur) => ur.role === 'ADMIN' || ur.role === 'EDITOR')
      .map((ur) => ur.clubId);
  },
  getAllEvents: () => {
    return [...get().customEvents, ...MOCK_EVENTS_FOR_SCREEN];
  },
}));

export type MockEventReview = {
  author: string;
  comment: string;
  /** 1–5 */
  rating: number;
};

export type MockEventSatisfaction = {
  averageRating: number;
  reviewCount: number;
  reviews: MockEventReview[];
};

const SAMPLE_REVIEWS_A: MockEventReview[] = [
  {
    author: "Elif K.",
    comment:
      "Really well organized—clear schedule and helpful hosts. Would definitely come again.",
    rating: 5,
  },
  {
    author: "Can M.",
    comment: "Great energy and good crowd. Venue was a bit tight at peak time.",
    rating: 4,
  },
  {
    author: "Zeynep A.",
    comment: "Learned a lot in a short time. Snacks could be improved next time.",
    rating: 4,
  },
];

const SAMPLE_REVIEWS_B: MockEventReview[] = [
  {
    author: "Burak T.",
    comment: "Speakers were excellent. The Q&A at the end was the highlight for me.",
    rating: 5,
  },
  {
    author: "Deniz Y.",
    comment: "Solid event overall. Registration line moved slowly.",
    rating: 4,
  },
  {
    author: "Ayşe L.",
    comment: "Nice community vibe. Met people from other departments too.",
    rating: 5,
  },
];

/** Per-event mock satisfaction (average, count, and 3 sample reviews). */
const BY_EVENT_ID: Record<number, MockEventSatisfaction> = {
  1: {
    averageRating: 4.5,
    reviewCount: 120,
    reviews: SAMPLE_REVIEWS_A,
  },
  2: {
    averageRating: 4.7,
    reviewCount: 86,
    reviews: SAMPLE_REVIEWS_B,
  },
  3: {
    averageRating: 4.3,
    reviewCount: 204,
    reviews: [
      {
        author: "Kerem S.",
        comment: "Networking was the best part—met two founders in one evening.",
        rating: 5,
      },
      {
        author: "Melis R.",
        comment: "Good talks, wish it had lasted longer.",
        rating: 4,
      },
      {
        author: "Ozan D.",
        comment: "Professional setup. Parking was tricky.",
        rating: 4,
      },
    ],
  },
  4: {
    averageRating: 4.6,
    reviewCount: 58,
    reviews: SAMPLE_REVIEWS_A,
  },
  5: {
    averageRating: 4.4,
    reviewCount: 312,
    reviews: SAMPLE_REVIEWS_B,
  },
  6: {
    averageRating: 4.2,
    reviewCount: 45,
    reviews: [
      {
        author: "Emre V.",
        comment: "Fun intro session—now I want to join the club projects.",
        rating: 5,
      },
      {
        author: "Selin P.",
        comment: "Demos were cool; room was slightly cold.",
        rating: 4,
      },
      {
        author: "Hakan G.",
        comment: "Clear explanations for beginners. Thanks to the team.",
        rating: 4,
      },
    ],
  },
  7: {
    averageRating: 4.8,
    reviewCount: 72,
    reviews: SAMPLE_REVIEWS_A,
  },
  8: {
    averageRating: 4.4,
    reviewCount: 95,
    reviews: SAMPLE_REVIEWS_B,
  },
  9: {
    averageRating: 4.1,
    reviewCount: 63,
    reviews: SAMPLE_REVIEWS_A,
  },
  10: {
    averageRating: 4.6,
    reviewCount: 178,
    reviews: [
      {
        author: "İpek N.",
        comment: "Inspiring talk and honest career advice. Slides were shared after—big plus.",
        rating: 5,
      },
      {
        author: "Arda F.",
        comment: "Hall was full; arrived early to get a seat. Worth it.",
        rating: 4,
      },
      {
        author: "Ceren B.",
        comment: "Liked the format. Would love a follow-up session.",
        rating: 5,
      },
    ],
  },
};

const FALLBACK: MockEventSatisfaction = {
  averageRating: 4.5,
  reviewCount: 120,
  reviews: SAMPLE_REVIEWS_A,
};

export function getMockEventSatisfaction(eventId: number): MockEventSatisfaction {
  return BY_EVENT_ID[eventId] ?? FALLBACK;
}

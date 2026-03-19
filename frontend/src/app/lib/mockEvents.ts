export type EventCategory =
  | "Engineering"
  | "Business"
  | "Art"
  | "Music"
  | "Science";

export type MockEvent = {
  id: string | number;
  title: string;
  community: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  description: string;
  category?: EventCategory;
  filledSeats: number;
  totalSeats: number;
};

export const mockEvents: MockEvent[] = [
  {
    id: 1,
    title: "Spring Coding Challenge Kickoff",
    community: "METU Computer Society",
    date: "2026-03-12T17:30:00",
    location: "Informatics Institute Auditorium",
    description: "Semester kickoff challenge for student teams.",
    category: "Engineering",
    filledSeats: 78,
    totalSeats: 100,
  },
  {
    id: 2,
    title: "Astronomy Night Observation",
    community: "METU Astronomy Community",
    date: "2026-03-18T20:00:00",
    location: "Physics Department Roof Terrace",
    description: "Night sky observation session with telescopes.",
    category: "Science",
    filledSeats: 42,
    totalSeats: 60,
  },
  {
    id: 3,
    title: "Sustainable Campus Workshop",
    community: "METU Environmental Society",
    date: "2026-03-22T14:00:00",
    location: "CCC Hall B",
    description: "Hands-on sustainability workshop.",
    category: "Business",
    filledSeats: 35,
    totalSeats: 50,
  },
];


export type EventCategory =
  | "Engineering"
  | "Business"
  | "Art"
  | "Music"
  | "Science";

export type MockEvent = {
  id: number;
  title: string;
  community: string;
  date: string;
  location: string;
  description: string;
  category: EventCategory;
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
    description:
      "Join our semester kickoff challenge, meet fellow developers, and form teams for a 48-hour coding sprint focused on campus-life solutions.",
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
    description:
      "An evening under the stars with guided telescope sessions, constellation spotting, and a short intro to astrophotography for beginners.",
    category: "Science",
    filledSeats: 42,
    totalSeats: 60,
  },
  {
    id: 3,
    title: "Sustainable Campus Workshop",
    community: "METU Environmental Society",
    date: "2026-03-22T14:00:00",
    location: "Cultural and Convention Center, Hall B",
    description:
      "A hands-on workshop on reducing campus waste, improving recycling habits, and designing student-led sustainability initiatives.",
    category: "Business",
    filledSeats: 35,
    totalSeats: 50,
  },
  {
    id: 4,
    title: "Beginner Salsa Social",
    community: "METU Dance Community",
    date: "2026-03-26T19:00:00",
    location: "Student Activities Center Studio 2",
    description:
      "A friendly social dance night with beginner salsa lessons, partner rotations, and open practice for all skill levels.",
    category: "Music",
    filledSeats: 66,
    totalSeats: 80,
  },
  {
    id: 5,
    title: "Indie Game Development Meetup",
    community: "METU Game Development Community",
    date: "2026-03-30T18:30:00",
    location: "Engineering Faculty, Room E-105",
    description:
      "Present your indie prototypes, get peer feedback on gameplay loops, and connect with students interested in design, art, and code.",
    category: "Art",
    filledSeats: 28,
    totalSeats: 40,
  },
];

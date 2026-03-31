export type EventCategory =
  | "Technology"
  | "Science"
  | "Business"
  | "Art"
  | "Entertainment"
  | "Engineering"
  | "Music & Dance"
  | "Environment"
  | "Career";

export type MockEvent = {
  id: number;
  title: string;
  club: string;
  date: string;
  location: string;
  description: string;
  category: EventCategory;
  filledSeats: number;
  totalSeats: number;
  image: string;
};

export const mockEvents: MockEvent[] = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    club: "METU Computer Society",
    date: "2026-03-05T17:30:00",
    location: "METU Informatics Institute",
    category: "Technology",
    image: "/images/event-images/ai.jpg",
    description: "Hands-on workshop about machine learning basics.",
    filledSeats: 42,
    totalSeats: 80,
  },
  {
    id: 2,
    title: "Astronomy Observation Night",
    club: "METU Astronomy Club",
    date: "2026-03-12T20:00:00",
    location: "Physics Department Roof",
    category: "Science",
    image: "/images/event-images/astronomy.jpg",
    description: "Observe planets and stars with telescopes.",
    filledSeats: 30,
    totalSeats: 60,
  },
  {
    id: 3,
    title: "Startup Networking Meetup",
    club: "METU Entrepreneurship Society",
    date: "2026-03-18T18:00:00",
    location: "METU Technopolis",
    category: "Business",
    image: "/images/event-images/startup.jpg",
    description: "Meet startup founders and entrepreneurs.",
    filledSeats: 55,
    totalSeats: 100,
  },
  {
    id: 4,
    title: "Photography Walk Around Campus",
    club: "METU Photography Club",
    date: "2026-03-22T16:00:00",
    location: "METU Main Gate",
    category: "Art",
    image: "/images/event-images/photography.jpg",
    description: "Campus photography tour with professionals.",
    filledSeats: 22,
    totalSeats: 40,
  },
  {
    id: 5,
    title: "Open Air Movie Night",
    club: "Cinema Society",
    date: "2026-03-25T21:00:00",
    location: "Culture & Convention Center Garden",
    category: "Entertainment",
    image: "/images/event-images/cinema.jpg",
    description: "Outdoor cinema experience for students.",
    filledSeats: 120,
    totalSeats: 160,
  },
  {
    id: 6,
    title: "Robotics Club Intro Session",
    club: "METU Robotics Club",
    date: "2026-07-12T17:00:00",
    location: "Engineering Building E-105",
    category: "Engineering",
    image: "/images/event-images/robotics.jpg",
    description: "Introduction to robotics club projects.",
    filledSeats: 48,
    totalSeats: 80,
  },
  {
    id: 7,
    title: "Beginner Salsa Workshop",
    club: "METU Dance Club",
    date: "2026-07-19T19:00:00",
    location: "Student Activities Center",
    category: "Music & Dance",
    image: "/images/event-images/salsa.jpg",
    description: "Learn salsa basics with instructors.",
    filledSeats: 36,
    totalSeats: 60,
  },
  {
    id: 8,
    title: "Game Development Meetup",
    club: "Game Development Community",
    date: "2026-07-26T18:30:00",
    location: "Engineering Faculty",
    category: "Technology",
    image: "/images/event-images/gamedev.jpg",
    description: "Indie game developers meetup.",
    filledSeats: 40,
    totalSeats: 70,
  },
  {
    id: 9,
    title: "Sustainable Campus Seminar",
    club: "Environmental Society",
    date: "2026-08-02T14:00:00",
    location: "CCC Hall B",
    category: "Environment",
    image: "/images/event-images/sustainability.jpg",
    description: "Ideas for a greener METU campus.",
    filledSeats: 64,
    totalSeats: 120,
  },
  {
    id: 10,
    title: "Career Talk with Google Engineer",
    club: "IEEE METU Student Branch",
    date: "2026-08-15T15:00:00",
    location: "METU Library Conference Hall",
    category: "Career",
    image: "/images/event-images/google.jpg",
    description: "Career insights from a Google engineer.",
    filledSeats: 90,
    totalSeats: 150,
  },
];


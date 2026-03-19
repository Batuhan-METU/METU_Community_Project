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
    date: "2026-03-18T17:30:00",
    location: "METU Informatics Institute",
    category: "Technology",
    image: "/events/ai-workshop.jpg",
    description: "Hands-on workshop about machine learning basics.",
    filledSeats: 42,
    totalSeats: 80,
  },
  {
    id: 2,
    title: "Astronomy Observation Night",
    club: "METU Astronomy Club",
    date: "2026-03-20T20:00:00",
    location: "Physics Department Roof",
    category: "Science",
    image: "/events/astronomy.jpg",
    description: "Observe planets and stars with telescopes.",
    filledSeats: 30,
    totalSeats: 60,
  },
  {
    id: 3,
    title: "Startup Networking Meetup",
    club: "METU Entrepreneurship Society",
    date: "2026-03-22T18:00:00",
    location: "METU Technopolis",
    category: "Business",
    image: "/events/startup.jpg",
    description: "Meet startup founders and entrepreneurs.",
    filledSeats: 55,
    totalSeats: 100,
  },
  {
    id: 4,
    title: "Photography Walk Around Campus",
    club: "METU Photography Club",
    date: "2026-03-24T16:00:00",
    location: "METU Main Gate",
    category: "Art",
    image: "/events/photography.jpg",
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
    image: "/events/movie-night.jpg",
    description: "Outdoor cinema experience for students.",
    filledSeats: 120,
    totalSeats: 160,
  },
  {
    id: 6,
    title: "Robotics Club Intro Session",
    club: "METU Robotics Club",
    date: "2026-03-27T17:00:00",
    location: "Engineering Building E-105",
    category: "Engineering",
    image: "/events/robotics.jpg",
    description: "Introduction to robotics club projects.",
    filledSeats: 48,
    totalSeats: 80,
  },
  {
    id: 7,
    title: "Beginner Salsa Workshop",
    club: "METU Dance Club",
    date: "2026-03-29T19:00:00",
    location: "Student Activities Center",
    category: "Music & Dance",
    image: "/events/salsa.jpg",
    description: "Learn salsa basics with instructors.",
    filledSeats: 36,
    totalSeats: 60,
  },
  {
    id: 8,
    title: "Game Development Meetup",
    club: "Game Development Community",
    date: "2026-03-31T18:30:00",
    location: "Engineering Faculty",
    category: "Technology",
    image: "/events/game-dev.jpg",
    description: "Indie game developers meetup.",
    filledSeats: 40,
    totalSeats: 70,
  },
  {
    id: 9,
    title: "Sustainable Campus Seminar",
    club: "Environmental Society",
    date: "2026-04-02T14:00:00",
    location: "CCC Hall B",
    category: "Environment",
    image: "/events/sustainability.jpg",
    description: "Ideas for a greener METU campus.",
    filledSeats: 64,
    totalSeats: 120,
  },
  {
    id: 10,
    title: "Career Talk with Google Engineer",
    club: "IEEE METU Student Branch",
    date: "2026-04-05T15:00:00",
    location: "METU Library Conference Hall",
    category: "Career",
    image: "/events/career.jpg",
    description: "Career insights from a Google engineer.",
    filledSeats: 90,
    totalSeats: 150,
  },
];


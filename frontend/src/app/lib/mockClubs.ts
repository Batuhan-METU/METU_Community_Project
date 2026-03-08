export type ClubCategory =
  | "Engineering"
  | "Business"
  | "Art"
  | "Music"
  | "Science";

export type MockClub = {
  id: number;
  name: string;
  description: string;
  category: ClubCategory;
  numberOfEvents: number;
};

export const mockClubs: MockClub[] = [
  {
    id: 1,
    name: "METU Computer Society",
    description:
      "A student community focused on software development, hackathons, and peer learning through coding workshops.",
    category: "Engineering",
    numberOfEvents: 8,
  },
  {
    id: 2,
    name: "METU Entrepreneurship Club",
    description:
      "Brings students together around startups, product thinking, and networking sessions with founders and investors.",
    category: "Business",
    numberOfEvents: 6,
  },
  {
    id: 3,
    name: "METU Fine Arts Collective",
    description:
      "Organizes exhibitions, creative meetups, and collaborative projects in illustration, painting, and visual design.",
    category: "Art",
    numberOfEvents: 5,
  },
  {
    id: 4,
    name: "METU Music Society",
    description:
      "A space for musicians and listeners to rehearse, perform, and host open-mic nights across different genres.",
    category: "Music",
    numberOfEvents: 7,
  },
  {
    id: 5,
    name: "METU Astronomy Club",
    description:
      "Hosts sky observation nights, science talks, and beginner-friendly sessions on astrophysics and telescopes.",
    category: "Science",
    numberOfEvents: 4,
  },
];

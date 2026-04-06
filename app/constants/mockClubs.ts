import type { ClubItem } from '@/components/ClubCard';

export type MockClub = ClubItem & {
  followers: number;
  aboutUs: string;
};

export const MOCK_CLUBS: MockClub[] = [
  {
    id: '1',
    name: 'Campus Music Night',
    desc: 'Live performances, open mic sessions, and community-led jam circles.',
    category: 'music',
    followers: 312,
    aboutUs:
      'Campus Music Night is METU\'s premier music community, uniting students who share a passion for live performance. We run weekly open mic nights, monthly themed concerts, and collaborate with the university music department to offer free workshops and masterclasses. Whether you play an instrument, write songs, or simply love the atmosphere of live music, you\'ll find your home here.\n\nOur events are open to all skill levels — from seasoned performers to curious beginners. We believe music brings people together, and our community thrives on that shared energy.',
  },
  {
    id: '2',
    name: 'AI Builders Club',
    desc: 'Hands-on ML projects, model demos, and technical peer mentoring.',
    category: 'technology',
    followers: 487,
    aboutUs:
      'The AI Builders Club is a technically-driven community for students passionate about artificial intelligence and machine learning. We run weekly project sprints, paper reading groups, and connect members with industry mentors from leading tech companies.\n\nOur alumni have published research papers, won national hackathons, and landed roles at top AI labs and startups. Whether you\'re just discovering neural networks or already deploying models in production, this is your community.',
  },
  {
    id: '3',
    name: 'Robotics Club',
    desc: 'Build robots, compete in workshops, and learn embedded systems together.',
    category: 'technology',
    followers: 256,
    aboutUs:
      'METU Robotics Club brings together engineers, programmers, and designers to build autonomous systems from the ground up. We participate in national and international competitions including TUBITAK robotics challenges and run beginner-friendly workshops on Arduino, ROS, and sensor integration.\n\nOur lab is open to members throughout the week, equipped with 3D printers, soldering stations, and a full suite of development boards. No experience needed — just a curiosity for building things that move.',
  },
  {
    id: '4',
    name: 'Visual Arts Collective',
    desc: 'Weekly illustration sessions, gallery tours, and collaborative exhibitions.',
    category: 'art',
    followers: 198,
    aboutUs:
      'The Visual Arts Collective is a welcoming creative space for artists of all skill levels at METU. We hold weekly drawing and painting sessions, organize gallery visits across Ankara, and put together a semester-end exhibition showcasing member work.\n\nEvery medium is welcome — traditional sketching, watercolor, acrylic, digital illustration, and mixed media. Our goal is to build a supportive community where artists can grow, experiment, and share their vision with an appreciative audience.',
  },
  {
    id: '5',
    name: 'Photography Walk Crew',
    desc: 'Campus photo walks, editing labs, and friendly critique sessions.',
    category: 'art',
    followers: 143,
    aboutUs:
      'The Photography Walk Crew organizes weekly photo walks around METU\'s iconic campus and the surrounding Ankara neighborhoods. From the forest paths of the arboretum to the brutalist architecture of the faculty buildings, there\'s no shortage of compelling subjects.\n\nWe host hands-on editing workshops covering Lightroom and Photoshop, run friendly critique sessions to help members develop their eye, and publish a quarterly digital magazine featuring the best member photography each semester.',
  },
  {
    id: '6',
    name: 'Astronomy Society',
    desc: 'Night observations, telescope workshops, and science outreach.',
    category: 'science',
    followers: 221,
    aboutUs:
      'The Astronomy Society connects METU students with the wonders of the cosmos. We host monthly star-gazing evenings at the Physics Department observatory, run hands-on telescope operation workshops, and participate in international astronomy events like Messier Marathon and annual meteor shower observation nights.\n\nOur outreach program visits local schools to inspire the next generation of scientists. Membership is open to all — no prior knowledge required, just curiosity and a love of the night sky.',
  },
];

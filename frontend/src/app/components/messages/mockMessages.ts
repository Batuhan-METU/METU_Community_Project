import type { ChatMessage } from "./types";

const base = (id: string, clubSuffix: string): ChatMessage[] => [
  {
    id: `${id}-m1`,
    text: "Hey everyone — quick reminder about this week’s meetup.",
    timeLabel: "09:12",
    isOwn: false,
    senderName: "Ayşe K.",
  },
  {
    id: `${id}-m2`,
    text: "Thanks! Will the room stay the same as last time?",
    timeLabel: "09:18",
    isOwn: true,
  },
  {
    id: `${id}-m3`,
    text: `Yes, we’re in the usual spot. I’ll share the ${clubSuffix} agenda in a bit.`,
    timeLabel: "09:21",
    isOwn: false,
    senderName: "Can Y.",
    senderAvatarUrl: "/images/avatar-placeholder.svg",
  },
  {
    id: `${id}-m4`,
    text: "Perfect. I’m bringing two friends who want to join.",
    timeLabel: "09:24",
    isOwn: true,
  },
  {
    id: `${id}-m5`,
    text: "That’s great — we’ll do intros at the start so they feel welcome.",
    timeLabel: "09:27",
    isOwn: false,
    senderName: "Ayşe K.",
  },
];

const extra: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1-x1",
      text: "CI pipeline is green — merge when ready.",
      timeLabel: "Yesterday",
      isOwn: false,
      senderName: "Deniz T.",
    },
    ...base("1", "coding"),
  ],
  "2": base("2", "startup"),
  "3": [
    {
      id: "3-x1",
      text: "Who’s in for the studio session this weekend?",
      timeLabel: "08:55",
      isOwn: false,
      senderName: "Ece M.",
    },
    ...base("3", "exhibit"),
  ],
  "4": base("4", "open mic"),
  "5": base("5", "sky watch"),
};

export function getMockMessagesForClub(clubId: string): ChatMessage[] {
  return extra[clubId] ?? base(clubId, "club");
}

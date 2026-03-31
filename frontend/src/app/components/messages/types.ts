export type ClubThread = {
  id: string;
  name: string;
  lastMessage: string;
  /** If set, shown in circular avatar; otherwise initials are used. */
  avatarUrl?: string;
  unread?: number;
  /** Mock: members currently active in this club (drives online dot + header). */
  activeMembersCount?: number;
  /** Mock: relative time for recent chats / lists, e.g. "12m ago". */
  lastActivityTime?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  /** Short label, e.g. "10:42" */
  timeLabel: string;
  isOwn: boolean;
  /** When not own — for avatar initials / display */
  senderName?: string;
  senderAvatarUrl?: string;
};

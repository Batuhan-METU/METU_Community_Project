import { MOCK_CLUBS } from '@/constants/mockClubs';
import { getMessagesForClub } from '@/constants/mockMessages';

export type Conversation = {
  id: string;
  clubName: string;
  clubCategory?: string;
  lastMessage: string;
  lastSender: string;
  timestamp: number;
  unreadCount: number;
  memberCount: number;
};

/**
 * Build a conversation preview for every club the "user" has joined.
 * Pulls the latest message from each club's chat history.
 */
function buildConversations(): Conversation[] {
  const joined = MOCK_CLUBS;

  return joined
    .map((club): Conversation => {
      const msgs = getMessagesForClub(club.id);
      const sorted = [...msgs].sort((a, b) => b.timestamp - a.timestamp);
      const latest = sorted[0];
      const senders = new Set(msgs.map((m) => m.senderName));

      const unreadMap: Record<string, number> = {
        '1': 2,
        '2': 0,
        '3': 5,
        '4': 1,
        '5': 0,
        '6': 3,
      };

      return {
        id: club.id,
        clubName: club.name,
        clubCategory: club.category,
        lastMessage: latest?.text ?? '',
        lastSender: latest?.isMe ? 'You' : latest?.senderName ?? '',
        timestamp: latest?.timestamp ?? Date.now(),
        unreadCount: unreadMap[club.id] ?? 0,
        memberCount: senders.size,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}

export const MOCK_CONVERSATIONS: Conversation[] = buildConversations();

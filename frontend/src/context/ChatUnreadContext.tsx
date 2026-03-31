"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_CLUBS } from "../app/components/messages/mockClubs";

function seedUnread(): Record<string, number> {
  return Object.fromEntries(MOCK_CLUBS.map((c) => [c.id, c.unread ?? 0]));
}

function sumUnread(map: Record<string, number>): number {
  return Object.values(map).reduce((a, b) => a + (b > 0 ? b : 0), 0);
}

type ChatUnreadContextValue = {
  unreadByClub: Record<string, number>;
  totalUnread: number;
  setUnreadForClub: (clubId: string, count: number) => void;
  markClubRead: (clubId: string) => void;
};

const ChatUnreadContext = createContext<ChatUnreadContextValue | null>(null);

export function ChatUnreadProvider({ children }: { children: ReactNode }) {
  const [unreadByClub, setUnreadByClub] = useState<Record<string, number>>(
    seedUnread,
  );

  const totalUnread = useMemo(() => sumUnread(unreadByClub), [unreadByClub]);

  const setUnreadForClub = useCallback((clubId: string, count: number) => {
    setUnreadByClub((prev) => ({ ...prev, [clubId]: Math.max(0, count) }));
  }, []);

  const markClubRead = useCallback((clubId: string) => {
    setUnreadByClub((prev) => ({ ...prev, [clubId]: 0 }));
  }, []);

  const value = useMemo(
    () => ({
      unreadByClub,
      totalUnread,
      setUnreadForClub,
      markClubRead,
    }),
    [unreadByClub, totalUnread, setUnreadForClub, markClubRead],
  );

  return (
    <ChatUnreadContext.Provider value={value}>
      {children}
    </ChatUnreadContext.Provider>
  );
}

export function useChatUnread() {
  const ctx = useContext(ChatUnreadContext);
  if (!ctx) {
    throw new Error("useChatUnread must be used within ChatUnreadProvider");
  }
  return ctx;
}

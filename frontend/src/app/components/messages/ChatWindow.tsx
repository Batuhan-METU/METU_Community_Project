"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ClubAvatar } from "./ClubAvatar";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageList } from "./ChatMessageList";
import { getMockMessagesForClub } from "./mockMessages";
import { formatActiveMembersLine } from "./presenceUtils";
import { TypingIndicator } from "./TypingIndicator";
import { useSimulatedRemoteTyping } from "./useSimulatedRemoteTyping";
import type { ChatMessage, ClubThread } from "./types";

/** Messages keyed by club id; missing keys use mock seed until the user sends a message. */
type MessagesByClubId = Record<string, ChatMessage[]>;

type ChatWindowProps = {
  selectedClub: ClubThread | null;
};

function messagesForClub(
  byClub: MessagesByClubId,
  clubId: string,
): ChatMessage[] {
  return byClub[clubId] ?? getMockMessagesForClub(clubId);
}

export function ChatWindow({ selectedClub }: ChatWindowProps) {
  const [messagesByClub, setMessagesByClub] = useState<MessagesByClubId>({});
  const [draft, setDraft] = useState("");
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const highlightTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const remoteTyping = useSimulatedRemoteTyping(selectedClub?.id ?? null);

  useEffect(() => {
    setDraft("");
    setHighlightedIds([]);
    highlightTimers.current.forEach((t) => clearTimeout(t));
    highlightTimers.current.clear();
  }, [selectedClub?.id]);

  useEffect(() => {
    return () => {
      highlightTimers.current.forEach((t) => clearTimeout(t));
      highlightTimers.current.clear();
    };
  }, []);

  const messages = useMemo(() => {
    const id = selectedClub?.id;
    if (!id) return [];
    return messagesForClub(messagesByClub, id);
  }, [selectedClub?.id, messagesByClub]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !selectedClub) return;

    const timeLabel = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const id = `local-${Date.now()}`;
    const newMessage: ChatMessage = {
      id,
      text,
      timeLabel,
      isOwn: true,
    };

    setMessagesByClub((prev) => {
      const clubId = selectedClub.id;
      const current = messagesForClub(prev, clubId);
      return { ...prev, [clubId]: [...current, newMessage] };
    });

    setHighlightedIds((prev) => [...prev, id]);
    const t = setTimeout(() => {
      setHighlightedIds((prev) => prev.filter((x) => x !== id));
      highlightTimers.current.delete(id);
    }, 2600);
    highlightTimers.current.set(id, t);

    setDraft("");
  };

  if (!selectedClub) {
    return (
      <section className="chat-pane-enter flex h-full min-w-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/60 bg-white/50 px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-gray-200/30 backdrop-blur-md">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/90 shadow-inner ring-1 ring-gray-200/70"
            aria-hidden
          >
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold tracking-tight text-gray-600">
            Select a club to start chatting
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
            Pick a conversation from the sidebar to load messages.
          </p>
        </div>
      </section>
    );
  }

  const activeCount = selectedClub.activeMembersCount ?? 0;
  const headerOnline = activeCount > 0;

  return (
    <section className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/55 bg-white/65 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05),0_20px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-gray-200/45 backdrop-blur-xl">
      <div
        key={selectedClub.id}
        className="chat-pane-enter flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3.5 border-b border-white/45 bg-white/50 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/45 sm:px-6">
          <ClubAvatar
            club={selectedClub}
            size="lg"
            active
            online={headerOnline}
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-gray-900">
              {selectedClub.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
              {headerOnline ? (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                  aria-hidden
                />
              ) : null}
              <span>
                {formatActiveMembersLine(selectedClub.activeMembersCount)}
              </span>
            </p>
          </div>
        </header>

        <ChatMessageList
          messages={messages}
          highlightedIds={highlightedIds}
        />
        <TypingIndicator visible={remoteTyping} />
        <ChatComposer value={draft} onChange={setDraft} onSend={handleSend} />
      </div>
    </section>
  );
}

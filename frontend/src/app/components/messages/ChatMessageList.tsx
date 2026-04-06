"use client";

import { useEffect, useRef } from "react";
import { groupMessages } from "./messageGrouping";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "./types";

type ChatMessageListProps = {
  messages: ChatMessage[];
  highlightedIds: readonly string[];
};

export function ChatMessageList({
  messages,
  highlightedIds,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const groups = groupMessages(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-slate-50/40 via-white/70 to-indigo-50/[0.12]">
      <div className="mx-auto flex max-w-3xl flex-col px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        <ul className="flex flex-col gap-5">
          {groups.map((group) => {
            const first = group[0];
            const isOwnGroup = first.isOwn;

            if (isOwnGroup) {
              return (
                <li key={first.id} className="flex flex-col items-end gap-1">
                  {group.map((msg, i) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isHighlighted={highlightedIds.includes(msg.id)}
                      group={{
                        isFirst: i === 0,
                        isLast: i === group.length - 1,
                        showAvatar: false,
                        showSenderName: false,
                      }}
                    />
                  ))}
                </li>
              );
            }

            return (
              <li key={first.id} className="flex flex-col gap-1">
                {group.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isHighlighted={highlightedIds.includes(msg.id)}
                    group={{
                      isFirst: i === 0,
                      isLast: i === group.length - 1,
                      showAvatar: i === 0,
                      showSenderName: i === 0,
                    }}
                  />
                ))}
              </li>
            );
          })}
        </ul>
        <div ref={bottomRef} aria-hidden className="h-px shrink-0" />
      </div>
    </div>
  );
}

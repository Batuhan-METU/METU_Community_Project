"use client";

import Link from "next/link";
import { getRecentChats } from "../messages/recentChats";
import { useChatUnread } from "../../../context/ChatUnreadContext";
import { messagesHrefForClubThreadId } from "../../lib/chatNavigation";

export default function RecentChatsSection() {
  const chats = getRecentChats(5);
  const { unreadByClub } = useChatUnread();

  return (
    <section className="border-b border-gray-100 bg-gradient-to-b from-slate-50/80 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Recent chats
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pick up where you left off in your club conversations
            </p>
          </div>
          <Link
            href="/messages"
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            View all messages →
          </Link>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chats.map((club) => {
            const unread = unreadByClub[club.id] ?? 0;
            return (
              <li key={club.id}>
                <Link
                  href={messagesHrefForClubThreadId(club.id)}
                  className="group block rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm shadow-gray-900/[0.04] ring-1 ring-gray-100 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-900/[0.06]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-900 group-hover:text-indigo-950">
                      {club.name}
                    </h3>
                    <span className="shrink-0 text-[11px] font-medium tabular-nums text-gray-400">
                      {club.lastActivityTime ?? "—"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {club.lastMessage}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Club chat
                    </span>
                    {unread > 0 ? (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold leading-none text-white">
                        {unread > 99 ? "99+" : unread} new
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">Read</span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

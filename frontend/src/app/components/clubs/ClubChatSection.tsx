import Link from "next/link";
import { getMockMessagesForClub } from "../messages/mockMessages";
import { MOCK_CLUBS } from "../messages/mockClubs";
import { messagesHrefForClubThreadId } from "../../lib/chatNavigation";

type ClubChatSectionProps = {
  clubId: number;
};

export function ClubChatSection({ clubId }: ClubChatSectionProps) {
  const threadId = String(clubId);
  const thread = MOCK_CLUBS.find((c) => c.id === threadId);
  if (!thread) return null;

  const messages = getMockMessagesForClub(threadId);
  const lastTwo = messages.slice(-2);

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur animate-fade-in-up">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Club chat
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Message this community on METUCom
      </p>

      {lastTwo.length > 0 ? (
        <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          {lastTwo.map((m) => (
            <li key={m.id} className="text-sm">
              <p className="line-clamp-2 text-slate-700">{m.text}</p>
              <p className="mt-1 text-[11px] font-medium tabular-nums text-slate-400">
                {m.timeLabel}
                {m.senderName && !m.isOwn ? (
                  <span className="text-slate-400"> · {m.senderName}</span>
                ) : null}
                {m.isOwn ? (
                  <span className="text-slate-400"> · You</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        href={messagesHrefForClubThreadId(threadId)}
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/35"
      >
        Open Chat
      </Link>
    </section>
  );
}

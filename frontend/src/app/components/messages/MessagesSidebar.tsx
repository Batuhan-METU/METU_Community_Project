import { ClubListItem } from "./ClubListItem";
import type { ClubThread } from "./types";

type MessagesSidebarProps = {
  clubs: ClubThread[];
  selectedClub: ClubThread | null;
  unreadByClub: Record<string, number>;
  onSelectClub: (club: ClubThread) => void;
};

export function MessagesSidebar({
  clubs,
  selectedClub,
  unreadByClub,
  onSelectClub,
}: MessagesSidebarProps) {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/55 bg-white/60 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05),0_20px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-gray-200/35 backdrop-blur-2xl">
      <div className="border-b border-white/45 bg-white/45 px-5 py-5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          Messages
        </h1>
        <p className="mt-1 text-[13px] leading-snug text-gray-500">
          Club conversations
        </p>
      </div>
      <nav
        className="flex-1 overflow-y-auto px-4 py-4"
        aria-label="Club messages"
      >
        <ul className="flex flex-col gap-2.5">
          {clubs.map((club) => (
            <li key={club.id}>
              <ClubListItem
                club={club}
                unreadCount={unreadByClub[club.id] ?? 0}
                selected={
                  selectedClub !== null && selectedClub.id === club.id
                }
                onSelect={onSelectClub}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

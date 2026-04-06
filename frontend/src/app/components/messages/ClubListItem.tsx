import { ClubAvatar } from "./ClubAvatar";
import { UnreadBadge } from "./UnreadBadge";
import type { ClubThread } from "./types";

type ClubListItemProps = {
  club: ClubThread;
  unreadCount: number;
  selected: boolean;
  onSelect: (club: ClubThread) => void;
};

export function ClubListItem({
  club,
  unreadCount,
  selected,
  onSelect,
}: ClubListItemProps) {
  const online = (club.activeMembersCount ?? 0) > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(club)}
      className={[
        "group flex w-full gap-3.5 rounded-xl p-3.5 text-left",
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-px hover:bg-white/70 hover:shadow-md hover:shadow-gray-900/[0.05]",
        "active:translate-y-0 active:scale-[0.995] active:duration-150",
        selected
          ? "bg-white/90 shadow-[0_0_0_1px_rgba(99,102,241,0.22),0_0_28px_-6px_rgba(99,102,241,0.45),0_8px_16px_-6px_rgba(15,23,42,0.08)] ring-1 ring-indigo-200/60"
          : "bg-transparent",
      ].join(" ")}
    >
      <ClubAvatar club={club} size="md" active={selected} online={online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`truncate text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-200 ${
              selected ? "text-indigo-950" : "text-gray-900"
            }`}
          >
            {club.name}
          </span>
          <UnreadBadge count={unreadCount} />
        </div>
        <p
          className={`mt-1 line-clamp-2 text-[13px] leading-relaxed transition-colors duration-200 ${
            selected
              ? "text-gray-600"
              : "text-gray-500 group-hover:text-gray-600"
          }`}
        >
          {club.lastMessage}
        </p>
      </div>
    </button>
  );
}

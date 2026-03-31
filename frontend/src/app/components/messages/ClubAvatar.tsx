import Image from "next/image";
import { getClubInitials } from "./clubInitials";
import type { ClubThread } from "./types";

const frame = {
  sm: "h-9 w-9 min-h-9 min-w-9 text-[11px]",
  md: "h-11 w-11 min-h-11 min-w-11 text-sm",
  lg: "h-12 w-12 min-h-12 min-w-12 text-sm",
} as const;

const imageSizes = {
  sm: "36px",
  md: "44px",
  lg: "48px",
} as const;

type ClubAvatarProps = {
  club: Pick<ClubThread, "name" | "avatarUrl">;
  size?: keyof typeof frame;
  active?: boolean;
  /** Mock presence: show green dot when members are active. */
  online?: boolean;
};

export function ClubAvatar({
  club,
  size = "md",
  active = false,
  online = false,
}: ClubAvatarProps) {
  const initials = getClubInitials(club);
  const src = club.avatarUrl?.trim();

  const ringClass = active
    ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-white"
    : "ring-2 ring-transparent ring-offset-0";

  const inner = src ? (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-gray-100 shadow-sm transition-all duration-200 ease-out ${frame[size]} ${ringClass}`}
    >
      <Image
        src={src}
        alt={club.name}
        fill
        sizes={imageSizes[size]}
        className="object-cover"
      />
    </div>
  ) : (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold shadow-md transition-all duration-200 ease-out ${frame[size]} ${ringClass} ${
        active
          ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-900/25"
          : "bg-gradient-to-br from-gray-100 to-gray-200/90 text-gray-700"
      }`}
      aria-hidden
    >
      {initials}
    </div>
  );

  return (
    <div className="relative inline-flex shrink-0">
      {inner}
      {online ? (
        <span
          className="absolute -bottom-px -right-px z-10 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-[2.5px] ring-white"
          title="Active"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

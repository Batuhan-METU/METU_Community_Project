type UnreadBadgeProps = {
  count: number;
};

export function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count <= 0) return null;
  return (
    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 px-1.5 text-[11px] font-semibold tabular-nums text-white shadow-md shadow-indigo-900/25 ring-2 ring-white transition-transform duration-200 ease-out">
      {count > 99 ? "99+" : count}
    </span>
  );
}

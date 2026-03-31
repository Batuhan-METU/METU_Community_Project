/** Subtitle for chat header from mock active member count. */
export function formatActiveMembersLine(count: number | undefined): string {
  const n = count ?? 0;
  if (n <= 0) return "No members online";
  if (n === 1) return "Online";
  return `${n} members active`;
}

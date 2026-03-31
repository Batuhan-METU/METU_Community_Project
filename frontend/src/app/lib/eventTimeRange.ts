/** Default assumed duration for catalog events that only store a single start `date`. */
const DEFAULT_EVENT_DURATION_HOURS = 2.5;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Format local datetime as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). */
export function formatLocalIso(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * Infer end time from a mock event start string for scheduling checks.
 */
export function inferMockEventEndTime(
  startTimeIso: string,
  durationHours: number = DEFAULT_EVENT_DURATION_HOURS,
): string {
  const start = new Date(startTimeIso);
  if (Number.isNaN(start.getTime())) {
    return startTimeIso;
  }
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return formatLocalIso(end);
}

/** True when the event’s end is strictly before “now” (catalog / mock end times). */
export function isEventEnded(endTimeIso: string): boolean {
  return new Date(endTimeIso) < new Date();
}

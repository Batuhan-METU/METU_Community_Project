"use client";

import { useEffect } from "react";
import type { OccupiedSlotInfo } from "../lib/resolveEventTimeRange";

function formatRangeLabel(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startTime} – ${endTime}`;
  }
  const datePart = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const t0 = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const t1 = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} · ${t0} – ${t1}`;
}

type ScheduleConflictModalProps = {
  conflictingEvent: OccupiedSlotInfo;
  onContinueAnyway: () => void;
  onCancel: () => void;
};

export function ScheduleConflictModal({
  conflictingEvent,
  onContinueAnyway,
  onCancel,
}: ScheduleConflictModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-conflict-title"
      aria-describedby="schedule-conflict-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[3px] transition-opacity"
        aria-label="Dismiss"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-amber-100/80 bg-white shadow-2xl shadow-amber-900/10 ring-1 ring-amber-200/40">
        <div className="border-b border-amber-50/90 bg-gradient-to-r from-amber-50/90 to-orange-50/50 px-6 py-5">
          <h2
            id="schedule-conflict-title"
            className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
          >
            ⚠️ Schedule Conflict
          </h2>
        </div>
        <div className="px-6 py-5">
          <p
            id="schedule-conflict-desc"
            className="text-[15px] leading-relaxed text-gray-600"
          >
            You already joined another event at this time.
          </p>
          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Conflicting event
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {conflictingEvent.name}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {formatRangeLabel(
                conflictingEvent.startTime,
                conflictingEvent.endTime,
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinueAnyway}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-900/20 transition hover:from-amber-400 hover:to-orange-400"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

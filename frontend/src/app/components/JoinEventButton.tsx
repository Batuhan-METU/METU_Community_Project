"use client";

import { useState } from "react";

export default function JoinEventButton() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setJoined(true)}
        disabled={joined}
        className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
          joined
            ? "cursor-default bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
            : "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30"
        }`}
      >
        {joined && (
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.267a1 1 0 0 1-1.42 0L3.29 9.171a1 1 0 1 1 1.414-1.414l4.096 4.096 6.49-6.556a1 1 0 0 1 1.414-.006Z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span>{joined ? "Joined" : "Join Event"}</span>
      </button>

      <div
        role="status"
        aria-live="polite"
        className={`overflow-hidden transition-all duration-300 ${
          joined ? "mt-3 max-h-16 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.267a1 1 0 0 1-1.42 0L3.29 9.171a1 1 0 1 1 1.414-1.414l4.096 4.096 6.49-6.556a1 1 0 0 1 1.414-.006Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Successfully joined the event</span>
        </div>
      </div>
    </div>
  );
}

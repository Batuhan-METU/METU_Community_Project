"use client";

import { useCallback, useState } from "react";
import { hasRatedEvent, saveEventRating } from "../lib/eventRatingsStorage";
import { mockEvents } from "../lib/mockEvents";

const STAR_PATH =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

function StarButton({
  index,
  active,
  onPick,
}: {
  index: number;
  active: boolean;
  onPick: (n: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(index)}
      className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      aria-label={`${index} stars`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-10 w-10 sm:h-11 sm:w-11 ${active ? "text-amber-400" : "text-gray-200"}`}
        fill="currentColor"
        aria-hidden
      >
        <path d={STAR_PATH} />
      </svg>
    </button>
  );
}

type RateEventModalProps = {
  eventId: number;
  onClose: () => void;
};

export function RateEventModal({ eventId, onClose }: RateEventModalProps) {
  const event = mockEvents.find((e) => e.id === eventId);
  const already = hasRatedEvent(eventId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = useCallback(() => {
    if (rating < 1 || rating > 5) return;
    saveEventRating(eventId, rating, comment);
    setSubmitted(true);
    window.setTimeout(() => onClose(), 1200);
  }, [eventId, rating, comment, onClose]);

  if (!event) {
    return null;
  }

  if (already && !submitted) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rate-event-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          aria-label="Close"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
          <h2
            id="rate-event-title"
            className="text-lg font-semibold text-gray-900"
          >
            Already rated
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You already submitted a rating for this event.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rate-event-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-900/15">
        <h2
          id="rate-event-title"
          className="text-lg font-semibold text-gray-900 sm:text-xl"
        >
          Rate event
        </h2>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{event.title}</p>

        {submitted ? (
          <p className="mt-6 text-center text-sm font-medium text-emerald-700">
            Thanks — your rating was saved.
          </p>
        ) : (
          <>
            <div className="mt-6 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <StarButton
                  key={n}
                  index={n}
                  active={rating >= n}
                  onPick={setRating}
                />
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-xs font-medium text-gray-500">
                Comment (optional)
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder="Share what stood out…"
              />
            </label>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={rating < 1}
                className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

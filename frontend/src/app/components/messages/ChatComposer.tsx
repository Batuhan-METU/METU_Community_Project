"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
}: ChatComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trySend = () => {
    if (disabled || !value.trim()) return;
    onSend();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    trySend();
  };

  return (
    <div className="sticky bottom-0 z-30 shrink-0 border-t border-white/50 bg-white/55 px-4 py-4 shadow-[0_-8px_32px_-12px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/45 sm:px-5">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-3"
      >
        <label htmlFor="chat-message-input" className="sr-only">
          Message
        </label>
        <textarea
          ref={inputRef}
          id="chat-message-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              trySend();
            }
          }}
          placeholder="Write a message…"
          disabled={disabled}
          className="max-h-32 min-h-[46px] flex-1 resize-none rounded-2xl border border-gray-200/70 bg-white/85 px-4 py-3 text-[15px] leading-relaxed text-gray-900 shadow-inner shadow-gray-900/[0.02] outline-none ring-indigo-500/0 transition-[box-shadow,border-color,background-color] duration-200 placeholder:text-gray-400 focus:border-indigo-300/80 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 text-[15px] font-semibold text-white shadow-lg shadow-indigo-900/20 ring-1 ring-white/15 transition duration-200 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-900/25 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

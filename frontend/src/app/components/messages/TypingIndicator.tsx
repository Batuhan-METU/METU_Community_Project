type TypingIndicatorProps = {
  visible: boolean;
};

export function TypingIndicator({ visible }: TypingIndicatorProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden border-t border-white/45 bg-white/45 transition-[max-height,opacity] duration-200 ease-out backdrop-blur-md supports-[backdrop-filter]:bg-white/40 ${
        visible ? "max-h-12 opacity-100" : "max-h-0 border-transparent opacity-0"
      }`}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="flex px-5 py-2 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
          <span className="text-[12px] font-medium text-gray-400">
            Someone is typing
          </span>
          <span className="typing-dots flex items-center gap-0.5" aria-hidden>
            <span className="typing-dot inline-block h-1 w-1 rounded-full bg-gray-400" />
            <span className="typing-dot typing-dot-delay-1 inline-block h-1 w-1 rounded-full bg-gray-400" />
            <span className="typing-dot typing-dot-delay-2 inline-block h-1 w-1 rounded-full bg-gray-400" />
          </span>
        </div>
      </div>
    </div>
  );
}

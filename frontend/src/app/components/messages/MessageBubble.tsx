import { ClubAvatar } from "./ClubAvatar";
import type { ChatMessage } from "./types";

type MessageGroupMeta = {
  isFirst: boolean;
  isLast: boolean;
  /** Only first row in an others-group shows avatar + name */
  showAvatar: boolean;
  showSenderName: boolean;
};

type MessageBubbleProps = {
  message: ChatMessage;
  isHighlighted?: boolean;
  group: MessageGroupMeta;
};

export function MessageBubble({
  message,
  isHighlighted = false,
  group,
}: MessageBubbleProps) {
  const showTime = group.isLast;
  const compact = !group.isFirst;

  if (message.isOwn) {
    return (
      <div
        className={`message-bubble-enter flex justify-end transition-[filter] duration-300 ease-out ${
          isHighlighted ? "drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]" : ""
        }`}
      >
        <div className="max-w-[min(85%,28rem)]">
          <div
            className={`rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500 via-violet-600 to-indigo-700 text-[15px] font-normal leading-relaxed text-white shadow-lg shadow-indigo-900/20 ring-1 transition-[box-shadow,ring-color,padding] duration-300 ease-out ${
              compact ? "px-4 py-2" : "px-4 py-3"
            } ${
              isHighlighted
                ? "ring-2 ring-indigo-300/60 ring-offset-2 ring-offset-transparent"
                : "ring-white/10"
            }`}
          >
            {message.text}
          </div>
          {showTime ? (
            <p className="mt-1.5 pr-1 text-right text-[11px] font-medium tabular-nums tracking-wide text-gray-400">
              {message.timeLabel}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  const displayName = message.senderName?.trim() || "Member";

  return (
    <div
      className={`message-bubble-enter flex justify-start gap-3 transition-colors duration-300 ease-out ${
        isHighlighted ? "rounded-2xl bg-indigo-50/40 py-2 pl-2 pr-2 -mx-2" : ""
      }`}
    >
      <div
        className={`flex w-9 shrink-0 flex-col ${group.showAvatar ? "justify-end pb-1" : ""}`}
      >
        {group.showAvatar ? (
          <ClubAvatar
            club={{
              name: displayName,
              avatarUrl: message.senderAvatarUrl,
            }}
            size="sm"
          />
        ) : (
          <span className="w-9 shrink-0" aria-hidden />
        )}
      </div>
      <div className="min-w-0 max-w-[min(85%,28rem)] flex-1">
        {group.showSenderName ? (
          <p className="mb-1.5 truncate pl-0.5 text-[13px] font-semibold tracking-tight text-gray-600">
            {displayName}
          </p>
        ) : null}
        <div
          className={`rounded-2xl border border-gray-200/70 bg-white/90 text-[15px] font-normal leading-relaxed text-gray-800 shadow-md shadow-gray-900/[0.05] ring-1 ring-gray-100/80 backdrop-blur-sm ${
            compact ? "px-4 py-2" : "px-4 py-3"
          }`}
        >
          {message.text}
        </div>
        {showTime ? (
          <p className="mt-1.5 pl-0.5 text-[11px] font-medium tabular-nums tracking-wide text-gray-400">
            {message.timeLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}

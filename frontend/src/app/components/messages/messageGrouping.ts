import type { ChatMessage } from "./types";

export function senderKey(message: ChatMessage): string {
  if (message.isOwn) return "me";
  return `other:${(message.senderName ?? "Member").trim()}`;
}

/** Consecutive messages from the same sender (you or same other user). */
export function groupMessages(messages: ChatMessage[]): ChatMessage[][] {
  const groups: ChatMessage[][] = [];
  for (const m of messages) {
    const prev = groups[groups.length - 1];
    if (prev?.length && senderKey(prev[0]) === senderKey(m)) {
      prev.push(m);
    } else {
      groups.push([m]);
    }
  }
  return groups;
}

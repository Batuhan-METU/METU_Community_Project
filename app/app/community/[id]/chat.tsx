import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MOCK_CLUBS } from '@/constants/mockClubs';
import { getMessagesForClub, MOCK_SENDER_ROLES, type ChatMessage, type SenderRole } from '@/constants/mockMessages';
import { useStore } from '@/lib/useStore';

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Returns true when there's a visible gap (>5 min) between consecutive
 * messages or the sender changes, so we can show a time separator.
 */
function shouldShowTimestamp(current: ChatMessage, previous: ChatMessage | undefined): boolean {
  if (!previous) return true;
  return current.timestamp - previous.timestamp > 5 * 60_000;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

const AVATAR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const ROLE_BADGE_COLORS: Record<SenderRole, { bg: string; text: string }> = {
  ADMIN:  { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  EDITOR: { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
};

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const userRoles = useStore((s) => s.userRoles);

  const club = useMemo(() => MOCK_CLUBS.find((c) => c.id === id) ?? null, [id]);

  const myRole = useMemo<SenderRole | null>(() => {
    const r = userRoles.find((ur) => ur.clubId === id);
    if (r?.role === 'ADMIN' || r?.role === 'EDITOR') return r.role;
    return null;
  }, [userRoles, id]);

  const clubSenderRoles = useMemo(
    () => MOCK_SENDER_ROLES[id ?? ''] ?? {},
    [id],
  );

  const getRoleForSender = useCallback(
    (senderName: string, isMe: boolean): SenderRole | null => {
      if (isMe) return myRole;
      return clubSenderRoles[senderName] ?? null;
    },
    [myRole, clubSenderRoles],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    [...getMessagesForClub(id ?? '')].sort((a, b) => b.timestamp - a.timestamp),
  );
  const [draft, setDraft] = useState('');

  const memberCount = useMemo(() => {
    const names = new Set(messages.map((m) => m.senderName));
    return names.size;
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      senderName: 'You',
      timestamp: Date.now(),
      isMe: true,
    };

    setMessages((prev) => [newMsg, ...prev]);
    setDraft('');
  }, [draft]);

  const clubName = club?.name ?? 'Group Chat';

  const renderMessage = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const nextInList = messages[index + 1];
      const showTime = shouldShowTimestamp(item, nextInList);
      const prevInList = messages[index - 1];
      const isLastInGroup =
        !prevInList || prevInList.senderName !== item.senderName || prevInList.isMe !== item.isMe;

      const senderRole = getRoleForSender(item.senderName, item.isMe);
      const badgeStyle = senderRole ? ROLE_BADGE_COLORS[senderRole] : null;

      return (
        <>
          {showTime && (
            <View style={styles.timestampRow}>
              <View style={styles.timestampPill}>
                <Text style={styles.timestampText}>{formatTime(item.timestamp)}</Text>
              </View>
            </View>
          )}
          {item.isMe ? (
            <View style={[styles.bubbleRowMe, !isLastInGroup && { marginBottom: 2 }]}>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                {isLastInGroup && senderRole && badgeStyle && (
                  <View style={[styles.chatRoleBadge, { backgroundColor: badgeStyle.bg }]}>
                    <Ionicons name="shield-checkmark" size={8} color={badgeStyle.text} />
                    <Text style={[styles.chatRoleBadgeText, { color: badgeStyle.text }]}>
                      {senderRole}
                    </Text>
                  </View>
                )}
                <View style={[styles.bubbleMe, isLastInGroup && styles.bubbleMeTail]}>
                  <Text style={styles.bubbleMeText}>{item.text}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.bubbleRowOther, !isLastInGroup && { marginBottom: 2 }]}>
              {isLastInGroup ? (
                <View style={[styles.avatar, { backgroundColor: avatarColor(item.senderName) }]}>
                  <Text style={styles.avatarText}>{getInitial(item.senderName)}</Text>
                </View>
              ) : (
                <View style={styles.avatarSpacer} />
              )}
              <View style={{ flex: 1, gap: 2 }}>
                {isLastInGroup && (
                  <View style={styles.senderRow}>
                    <Text style={styles.senderName}>{item.senderName}</Text>
                    {senderRole && badgeStyle && (
                      <View style={[styles.chatRoleBadge, { backgroundColor: badgeStyle.bg }]}>
                        <Ionicons name="shield-checkmark" size={8} color={badgeStyle.text} />
                        <Text style={[styles.chatRoleBadgeText, { color: badgeStyle.text }]}>
                          {senderRole}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                <View style={[styles.bubbleOther, isLastInGroup && styles.bubbleOtherTail]}>
                  <Text style={styles.bubbleOtherText}>{item.text}</Text>
                </View>
              </View>
            </View>
          )}
        </>
      );
    },
    [messages, getRoleForSender],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{clubName}</Text>
          <Text style={styles.headerSub}>{memberCount} members</Text>
        </View>

        <Pressable hitSlop={10} style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={18} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* ── Message list ── */}
      <FlatList
        ref={listRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      />

      {/* ── Input area ── */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <View style={styles.inputRow}>
          <Pressable hitSlop={8} style={styles.inputIcon}>
            <Ionicons name="happy-outline" size={22} color={Colors.textMuted} />
          </Pressable>

          <TextInput
            style={styles.textInput}
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={2000}
            returnKeyType="default"
          />

          <Pressable hitSlop={8} style={styles.inputIcon}>
            <Ionicons name="attach-outline" size={22} color={Colors.textMuted} />
          </Pressable>

          {draft.trim().length > 0 ? (
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [styles.sendBtn, pressed && styles.sendBtnPressed]}
              hitSlop={6}
            >
              <Ionicons name="send" size={16} color={Colors.white} />
            </Pressable>
          ) : (
            <Pressable hitSlop={8} style={styles.inputIcon}>
              <Ionicons name="mic-outline" size={22} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const AVATAR_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bgElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  headerBack: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    gap: 1,
  },
  headerTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  headerAction: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── Message list ── */
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  /* ── Timestamp ── */
  timestampRow: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  timestampPill: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  timestampText: {
    fontSize: FontSize.xxs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },

  /* ── Bubbles: my messages ── */
  bubbleRowMe: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
    paddingLeft: 60,
  },
  bubbleMe: {
    backgroundColor: '#be123c', // rose-700 — strong red that reads well on dark
    borderRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '100%',
  },
  bubbleMeTail: {
    borderBottomRightRadius: 4,
  },
  bubbleMeText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    lineHeight: 20,
  },

  /* ── Bubbles: other people ── */
  bubbleRowOther: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
    paddingRight: 60,
    gap: Spacing.sm,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarSpacer: {
    width: AVATAR_SIZE,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 2,
  },
  senderName: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  chatRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  chatRoleBadgeText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.4,
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.neutral800,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '100%',
  },
  bubbleOtherTail: {
    borderBottomLeftRadius: 4,
  },
  bubbleOtherText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },

  /* ── Input bar ── */
  inputBar: {
    backgroundColor: Colors.bgElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.bgInput,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Platform.OS === 'ios' ? Spacing.xs : 0,
    gap: 2,
  },
  inputIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    maxHeight: 120,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.sm,
    lineHeight: 20,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.metuRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  sendBtnPressed: {
    backgroundColor: Colors.metuRedLight,
  },
});

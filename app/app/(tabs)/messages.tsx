import { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MOCK_CONVERSATIONS, type Conversation } from '@/constants/mockConversations';

const AVATAR_SIZE = 52;

const CATEGORY_COLORS: Record<string, string> = {
  music:      '#be123c',
  technology: '#1d4ed8',
  art:        '#a21caf',
  science:    '#7c3aed',
  sports:     '#047857',
  business:   '#166534',
};

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;

  if (diff < min) return 'now';
  if (diff < hr) return `${Math.floor(diff / min)}m`;
  if (diff < day) return `${Math.floor(diff / hr)}h`;
  if (diff < 2 * day) return 'Yesterday';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ConversationRow({ item, onPress }: { item: Conversation; onPress: () => void }) {
  const bgColor = CATEGORY_COLORS[item.clubCategory ?? ''] ?? Colors.neutral700;
  const hasUnread = item.unreadCount > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.clubName}, ${item.lastMessage}`}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: bgColor }]}>
        <Text style={styles.avatarText}>
          {item.clubName.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Middle: name + last message */}
      <View style={styles.rowCenter}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.clubName, hasUnread && styles.clubNameUnread]}
            numberOfLines={1}
          >
            {item.clubName}
          </Text>
        </View>
        <Text
          style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
          numberOfLines={1}
        >
          {item.lastSender ? `${item.lastSender}: ` : ''}
          {item.lastMessage}
        </Text>
      </View>

      {/* Right: timestamp + badge */}
      <View style={styles.rowRight}>
        <Text style={[styles.timestamp, hasUnread && styles.timestampUnread]}>
          {formatRelativeTime(item.timestamp)}
        </Text>
        {hasUnread ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.unreadCount > 99 ? '99+' : item.unreadCount}
            </Text>
          </View>
        ) : (
          <View style={styles.badgeSpacer} />
        )}
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const router = useRouter();

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);

  const handlePress = useCallback(
    (item: Conversation) => {
      router.push(`/community/${item.id}/chat`);
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <Pressable hitSlop={10} style={styles.headerAction}>
          <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* Conversation list */}
      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationRow item={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Join a community to start chatting with other members.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: Colors.metuRed,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── List ── */
  listContent: {
    paddingBottom: 100,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.xxl + AVATAR_SIZE + Spacing.md,
  },

  /* ── Conversation row ── */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  rowPressed: {
    backgroundColor: Colors.bgElevated,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.85)',
  },

  rowCenter: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clubName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    flexShrink: 1,
  },
  clubNameUnread: {
    fontWeight: FontWeight.bold,
  },
  lastMessage: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  lastMessageUnread: {
    color: Colors.textSecondary,
  },

  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    flexShrink: 0,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  timestampUnread: {
    color: Colors.metuRed,
    fontWeight: FontWeight.semibold,
  },
  badge: {
    backgroundColor: Colors.metuRed,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  badgeSpacer: {
    height: 20,
  },

  /* ── Empty state ── */
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});

import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_META,
  type AppNotification,
} from '@/constants/mockNotifications';

function NotificationRow({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: () => void;
}) {
  const meta = NOTIFICATION_META[item.type];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !item.isRead && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: meta.color + '18',
            borderColor: meta.color + '30',
          },
        ]}
      >
        <Ionicons name={meta.icon as any} size={18} color={meta.color} />
      </View>

      {/* Content */}
      <View style={styles.rowCenter}>
        <Text
          style={[styles.rowTitle, !item.isRead && styles.rowTitleUnread]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.rowDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      {/* Right: time + unread dot */}
      <View style={styles.rowRight}>
        <Text style={[styles.rowTime, !item.isRead && styles.rowTimeUnread]}>
          {item.time}
        </Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const handlePress = useCallback(
    (item: AppNotification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );

      if (item.eventId) {
        router.push(`/event/${item.eventId}`);
      } else if (item.clubId) {
        router.push(`/community/${item.clubId}/chat`);
      }
    },
    [router],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <Pressable onPress={markAllRead} hitSlop={10} style={styles.markAllBtn}>
            <Ionicons name="checkmark-done" size={18} color={Colors.indigo} />
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow item={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-off-outline" size={36} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>
              You have no notifications right now. We'll let you know when something happens.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const ICON_SIZE = 42;

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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
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
  markAllBtn: {
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
    paddingTop: Spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.xxl + ICON_SIZE + Spacing.md,
  },

  /* ── Notification row ── */
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  rowUnread: {
    backgroundColor: 'rgba(227,6,19,0.06)',
  },
  rowPressed: {
    backgroundColor: Colors.bgElevated,
  },

  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  rowCenter: {
    flex: 1,
    gap: 3,
    paddingTop: 2,
  },
  rowTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  rowTitleUnread: {
    fontWeight: FontWeight.bold,
  },
  rowDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 19,
  },

  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 3,
    flexShrink: 0,
  },
  rowTime: {
    fontSize: FontSize.xxs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  rowTimeUnread: {
    color: Colors.metuRed,
    fontWeight: FontWeight.semibold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.metuRed,
  },

  /* ── Empty state ── */
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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

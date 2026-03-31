import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { CommunityEvent } from '@/lib/types';

type Props = {
  event: CommunityEvent;
  communityName?: string;
};

/**
 * Space-efficient grid card for Events (Explore). Whole card is tappable — no CTA strip.
 * Home feed continues to use full EventCard.
 */
export default function CompactEventCard({ event, communityName }: Props) {
  const router = useRouter();

  const dateStr = event.date || event.starts_at;
  const d = dateStr ? new Date(dateStr) : null;
  const dayNum = d ? d.getDate() : null;
  const monthSh = d ? d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : null;
  const timeStr = d
    ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null;

  const author = communityName || 'METU Community';
  const initial = author.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/event/${event.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${author}`}>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.community} numberOfLines={1}>
          {author}
        </Text>
        {event.is_paid ? (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>
              {event.ticket_price != null ? `${event.ticket_price}₺` : '₺'}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        {d ? (
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{dayNum}</Text>
            <Text style={styles.dateMonth}>{monthSh}</Text>
          </View>
        ) : null}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
      </View>

      <View style={styles.meta}>
        {timeStr ? (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
            <Text style={styles.metaText}>{timeStr}</Text>
          </View>
        ) : null}
        {event.location ? (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const AVATAR = 24;

const styles = StyleSheet.create({
  /* bg-neutral-900 — single solid surface */
  card: {
    flex: 1,
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  community: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  priceTag: {
    backgroundColor: Colors.metuRedDim,
    borderWidth: 1,
    borderColor: 'rgba(227,6,19,0.25)',
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.metuRed,
  },

  body: {
    gap: 6,
    minHeight: 72,
    justifyContent: 'flex-start',
  },
  dateBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: Radius.sm - 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dateDay: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 17,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    lineHeight: 18,
  },

  meta: {
    gap: 3,
    paddingTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    flex: 1,
  },
});

import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { CommunityEvent } from '@/lib/types';

/** Tailwind red-600 @ 30% opacity — subtle accent border */
const RED_BORDER_SUBTLE = 'rgba(220, 38, 38, 0.3)';

type Props = {
  event: CommunityEvent;
  communityName?: string;
  communityLogo?: ImageSourcePropType;
};

export default function EventCard({ event, communityName, communityLogo }: Props) {
  const router = useRouter();
  const dateStr = event.date || event.starts_at;
  const d = dateStr ? new Date(dateStr) : null;
  const dayNum = d ? d.getDate() : '';
  const monthShort = d
    ? d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : '';
  const timeStr = d
    ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : '';
  const fullDate = d
    ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '';

  const authorName = communityName || 'METU Community';

  return (
    <View style={styles.card}>
      {/* ─── Author row ─── */}
      <View style={styles.authorRow}>
        {communityLogo ? (
          <Image source={communityLogo} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{authorName.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          {fullDate ? <Text style={styles.authorDate}>{fullDate}</Text> : null}
        </View>

        <Pressable hitSlop={12} onPress={() => router.push(`/event/${event.id}`)}>
          <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* ─── Title block — deep dark surface, no heavy gradient ─── */}
      <Pressable onPress={() => router.push(`/event/${event.id}`)}>
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            {d ? (
              <View style={styles.dateBadge}>
                <Text style={styles.dateDay}>{dayNum}</Text>
                <Text style={styles.dateMonth}>{monthShort}</Text>
              </View>
            ) : (
              <View />
            )}

            {event.is_paid ? (
              <View style={styles.priceTag}>
                <Ionicons name="pricetag-outline" size={11} color={Colors.metuRed} />
                <Text style={styles.priceTagText}>
                  {event.ticket_price != null ? `${event.ticket_price} ₺` : 'Paid'}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle} numberOfLines={3}>
              {event.title}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* ─── Content ─── */}
      <View style={styles.content}>
        <View style={styles.actionRow}>
          <View style={styles.actionsLeft}>
            <Pressable hitSlop={8} style={styles.actionBtn}>
              <Ionicons name="heart-outline" size={22} color={Colors.text} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.text} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.actionBtn}>
              <Ionicons name="paper-plane-outline" size={20} color={Colors.text} />
            </Pressable>
          </View>
          <Pressable hitSlop={8}>
            <Ionicons name="bookmark-outline" size={22} color={Colors.text} />
          </Pressable>
        </View>

        {event.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            <Text style={styles.descAuthor}>{authorName} </Text>
            {event.description}
          </Text>
        ) : null}

        {timeStr || event.location ? (
          <View style={styles.metaRow}>
            {timeStr ? (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{timeStr}</Text>
              </View>
            ) : null}
            {event.location ? (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed]}
          onPress={() => router.push(`/event/${event.id}`)}>
          <Text style={styles.registerText}>Register</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 38;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: RED_BORDER_SUBTLE,
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    borderColor: RED_BORDER_SUBTLE,
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: RED_BORDER_SUBTLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.metuRed,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  authorDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },

  /* neutral-900-ish hero */
  hero: {
    minHeight: 168,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: '#17171c',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateBadge: {
    width: 46,
    height: 50,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDay: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 24,
  },
  dateMonth: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.metuRedDim,
    borderWidth: 1,
    borderColor: 'rgba(227, 6, 19, 0.35)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  priceTagText: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
    color: Colors.metuRed,
  },
  heroBottom: {
    marginTop: Spacing.md,
    gap: 4,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 26,
    letterSpacing: -0.3,
  },

  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  actionBtn: {
    padding: 2,
  },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  descAuthor: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.metuRed,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  registerBtnPressed: {
    backgroundColor: Colors.metuRedLight,
  },
  registerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#fff',
  },
});

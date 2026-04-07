import { useMemo } from 'react';
import { Image, ImageSourcePropType, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColors, type ThemeColors } from '@/hooks/useColors';
import { useStore } from '@/lib/useStore';
import type { CommunityEvent } from '@/lib/types';

const RED_BORDER_SUBTLE = 'rgba(220, 38, 38, 0.3)';

type Props = {
  event: CommunityEvent;
  communityName?: string;
  communityLogo?: ImageSourcePropType;
};

function formatLikes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function EventCard({ event, communityName, communityLogo }: Props) {
  const router = useRouter();
  const liked = useStore((s) => s.isEventLiked(event.id));
  const bookmarked = useStore((s) => s.isEventBookmarked(event.id));
  const likesCount = useStore((s) => s.getLikesCount(event.id));
  const toggleLike = useStore((s) => s.toggleLike);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const { colors, isDark } = useColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

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
                <Ionicons name="pricetag-outline" size={11} color={colors.metuRed} />
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

      <View style={styles.content}>
        <View style={styles.actionRow}>
          <View style={styles.actionsLeft}>
            <Pressable
              hitSlop={8}
              style={styles.actionBtn}
              onPress={() => toggleLike(event.id)}
              accessibilityRole="button"
              accessibilityLabel={liked ? 'Unlike event' : 'Like event'}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={22}
                color={liked ? colors.metuRed : colors.text}
              />
              {likesCount > 0 && (
                <Text style={[styles.actionCount, liked && styles.actionCountLiked]}>
                  {formatLikes(likesCount)}
                </Text>
              )}
            </Pressable>

            <Pressable
              hitSlop={8}
              style={styles.actionBtn}
              onPress={() => {
                Share.share({
                  message: `Hey! Check out '${event.title}' on METUCom. Let's go together!`,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Share event"
            >
              <Ionicons name="paper-plane-outline" size={20} color={colors.text} />
            </Pressable>
          </View>

          <Pressable
            hitSlop={8}
            onPress={() => toggleBookmark(event.id)}
            accessibilityRole="button"
            accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
          >
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={bookmarked ? colors.amber : colors.text}
            />
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
                <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                <Text style={styles.metaText}>{timeStr}</Text>
              </View>
            ) : null}
            {event.location ? (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={13} color={colors.textMuted} />
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

function createStyles(C: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    card: {
      backgroundColor: C.bgCard,
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
      backgroundColor: C.bgElevated,
      borderWidth: 1,
      borderColor: RED_BORDER_SUBTLE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitial: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.bold,
      color: C.metuRed,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.text,
    },
    authorDate: {
      fontSize: FontSize.xs,
      color: C.textMuted,
      marginTop: 1,
    },

    hero: {
      minHeight: 168,
      padding: Spacing.lg,
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#17171c' : '#f5f5f7',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: C.border,
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
      backgroundColor: 'rgba(128,128,128,0.08)',
      borderWidth: 1,
      borderColor: C.borderSubtle,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateDay: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: C.text,
      lineHeight: 24,
    },
    dateMonth: {
      fontSize: FontSize.xxs,
      fontWeight: FontWeight.bold,
      color: C.textSecondary,
      letterSpacing: 1,
    },
    priceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: C.metuRedDim,
      borderWidth: 1,
      borderColor: 'rgba(227, 6, 19, 0.35)',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
    },
    priceTagText: {
      fontSize: FontSize.xxs,
      fontWeight: FontWeight.bold,
      color: C.metuRed,
    },
    heroBottom: {
      marginTop: Spacing.md,
      gap: 4,
    },
    heroTitle: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: C.text,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      padding: 2,
    },
    actionCount: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: C.textSecondary,
    },
    actionCountLiked: {
      color: C.metuRed,
    },
    desc: {
      fontSize: FontSize.sm,
      color: C.textSecondary,
      lineHeight: 19,
    },
    descAuthor: {
      fontWeight: FontWeight.semibold,
      color: C.text,
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
      color: C.textMuted,
    },
    registerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      backgroundColor: C.metuRed,
      paddingVertical: Spacing.md,
      borderRadius: Radius.sm,
    },
    registerBtnPressed: {
      backgroundColor: C.metuRedLight,
    },
    registerText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: '#fff',
    },
  });
}

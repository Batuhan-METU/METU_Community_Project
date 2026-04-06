import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MOCK_EVENTS_FOR_SCREEN } from '@/constants/mockEvents';

const HEADER_HEIGHT = 260;
const STICKY_BAR_HEIGHT = 72;

/* Per-category gradient palette for the hero */
const CATEGORY_GRADIENTS: Record<string, readonly [string, string, string]> = {
  Technology:    ['#0f172a', '#1e3a5f', '#2563eb'],
  Science:       ['#1a0f2e', '#2d1b69', '#7c3aed'],
  Business:      ['#0c1a14', '#14532d', '#15803d'],
  Art:           ['#2d0a1e', '#86198f', '#c026d3'],
  Entertainment: ['#1c0a2e', '#4c1d95', '#7c3aed'],
  Sports:        ['#0c1f1a', '#065f46', '#059669'],
  Music:         ['#1f0a0a', '#7f1d1d', '#dc2626'],
  Engineering:   ['#0a1628', '#1e3a5f', '#1d4ed8'],
};

const DEFAULT_GRADIENT: readonly [string, string, string] = ['#0f172a', '#1e1b4b', '#312e81'];

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const event = useMemo(
    () => MOCK_EVENTS_FOR_SCREEN.find((e) => e.id === id) ?? null,
    [id],
  );

  if (!event) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtnSolid}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.centered}>
          <Ionicons name="calendar-outline" size={52} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Event not found</Text>
          <Text style={styles.emptyText}>This event may have been removed or the link is invalid.</Text>
        </View>
      </View>
    );
  }

  const heroGradient = CATEGORY_GRADIENTS[event.category] ?? DEFAULT_GRADIENT;
  const dateStr = event.date || event.starts_at;
  const d = dateStr ? new Date(dateStr) : null;
  const formattedDate = d
    ? d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const formattedTime = d
    ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null;

  return (
    <View style={styles.container}>
      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: STICKY_BAR_HEIGHT + insets.bottom + Spacing.xl }}
      >
        {/* ── Hero header ── */}
        <View style={[styles.hero, { height: HEADER_HEIGHT + insets.top }]}>
          <LinearGradient
            colors={[...heroGradient]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* subtle noise overlay */}
          <View style={styles.heroNoise} />

          {/* floating icon */}
          <View style={[styles.heroIconWrap, { marginTop: insets.top + 16 }]}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="calendar" size={44} color="rgba(255,255,255,0.25)" />
            </View>
          </View>

          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + 12 }]}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </Pressable>

          {/* Paid / Free badge */}
          <View style={[styles.priceBadge, { top: insets.top + 12 }]}>
            {event.is_paid ? (
              <>
                <Ionicons name="pricetag" size={11} color={Colors.metuRed} />
                <Text style={styles.priceBadgeText}>
                  {event.ticket_price != null ? `${event.ticket_price} ₺` : 'Paid'}
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="gift-outline" size={11} color={Colors.emerald} />
                <Text style={[styles.priceBadgeText, { color: Colors.emerald }]}>Free</Text>
              </>
            )}
          </View>

          {/* Bottom fade into content */}
          <LinearGradient
            colors={['transparent', Colors.bg]}
            style={styles.heroFade}
          />
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Category chip */}
          <View style={styles.catChip}>
            <Text style={styles.catChipText}>{event.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Organizer row */}
          <View style={styles.organizerRow}>
            <View style={styles.organizerAvatar}>
              <Text style={styles.organizerInitial}>
                {event.community.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.organizerLabel}>Organised by</Text>
              <Text style={styles.organizerName}>{event.community}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Date & Time row */}
          {(formattedDate || formattedTime) && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="calendar-outline" size={18} color={Colors.indigo} />
              </View>
              <View style={styles.infoBody}>
                {formattedDate && <Text style={styles.infoMain}>{formattedDate}</Text>}
                {formattedTime && <Text style={styles.infoSub}>{formattedTime}</Text>}
              </View>
            </View>
          )}

          {/* Location row */}
          {event.location && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="location-outline" size={18} color={Colors.metuRed} />
              </View>
              <View style={[styles.infoBody, { flex: 1 }]}>
                <Text style={styles.infoMain}>{event.location}</Text>
                <Text style={styles.infoSub}>METU Campus, Ankara</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.mapBtn, pressed && { opacity: 0.7 }]}
                accessibilityLabel="View location on map"
              >
                <Ionicons name="map-outline" size={12} color={Colors.indigo} />
                <Text style={styles.mapBtnText}>View on Map</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.divider} />

          {/* About section */}
          <Text style={styles.sectionHeading}>About this event</Text>
          <Text style={styles.description}>
            {event.description}
          </Text>
          <Text style={styles.description}>
            Join us for this exciting community event hosted by {event.community}. This is a wonderful opportunity to connect with fellow METU students, expand your skills, and become part of the vibrant campus community that makes this university special.
          </Text>
          <Text style={styles.description}>
            All participants are encouraged to arrive 15 minutes early to secure their seats. Please bring your student ID and any materials listed above. Light refreshments will be available at the venue. Questions? Reach out to the organising community directly through their profile page.
          </Text>

          {/* Ticket price detail (if paid) */}
          {event.is_paid && event.ticket_price != null && (
            <>
              <View style={styles.divider} />
              <View style={styles.ticketBox}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="pricetag-outline" size={18} color={Colors.amber} />
                </View>
                <View style={styles.infoBody}>
                  <Text style={styles.infoMain}>{event.ticket_price} ₺</Text>
                  <Text style={styles.infoSub}>Ticket price per person</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={[styles.stickyBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.stickyInner}>
          {event.is_paid && event.ticket_price != null ? (
            <View style={styles.stickyPriceBlock}>
              <Text style={styles.stickyPriceLabel}>Price</Text>
              <Text style={styles.stickyPrice}>{event.ticket_price} ₺</Text>
            </View>
          ) : (
            <View style={styles.stickyPriceBlock}>
              <Text style={styles.stickyPriceLabel}>Entry</Text>
              <Text style={[styles.stickyPrice, { color: Colors.emerald }]}>Free</Text>
            </View>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.registerBtn,
              pressed && styles.registerBtnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Register for this event"
          >
            <Text style={styles.registerText}>Register for Event</Text>
            <Ionicons name="arrow-forward" size={15} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  /* ── Not-found ── */
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  backBtnSolid: {
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },

  /* ── Hero ── */
  hero: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroNoise: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    backgroundColor: '#ffffff',
  },
  heroIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  heroIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: Spacing.lg,
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  priceBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.metuRed,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  /* ── Content ── */
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  catChip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  catChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerInitial: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  organizerLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  organizerName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },

  /* ── Info rows ── */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoBody: {
    gap: 2,
    justifyContent: 'center',
    paddingTop: 2,
  },
  infoMain: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    lineHeight: 19,
  },
  infoSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    alignSelf: 'center',
  },
  mapBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.indigo,
  },

  /* ── About ── */
  sectionHeading: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  ticketBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  /* ── Sticky bar ── */
  stickyBar: {
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  stickyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  stickyPriceBlock: {
    gap: 2,
  },
  stickyPriceLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  stickyPrice: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  registerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.metuRed,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  registerBtnPressed: {
    backgroundColor: Colors.metuRedLight,
  },
  registerText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

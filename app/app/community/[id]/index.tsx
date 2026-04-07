import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import type { AdminRole } from '@/lib/useStore';
import {
  FlatList,
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
import { MOCK_CLUBS } from '@/constants/mockClubs';
import { MOCK_EVENTS_FOR_SCREEN } from '@/constants/mockEvents';
import CompactEventCard from '@/components/CompactEventCard';
import { useStore } from '@/lib/useStore';

const CATEGORY_GRADIENTS: Record<string, readonly [string, string, string]> = {
  music:      ['#2d1515', '#7f1d1d', '#b91c1c'],
  technology: ['#0f1629', '#1e3a5f', '#1d4ed8'],
  art:        ['#2d0a1e', '#7e1d6a', '#a21caf'],
  science:    ['#1a0f2e', '#2d1b69', '#7c3aed'],
  sports:     ['#0c1f1a', '#064e3b', '#047857'],
  business:   ['#0c1a14', '#14532d', '#166534'],
};

const DEFAULT_GRADIENT: readonly [string, string, string] = ['#0f172a', '#1e1b4b', '#312e81'];

const CATEGORY_ACCENT: Record<string, string> = {
  music:      Colors.rose,
  technology: Colors.sky,
  art:        Colors.fuchsia,
  science:    Colors.violet,
  sports:     Colors.emerald,
  business:   Colors.green,
};

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const clubOverrides = useStore((s) => s.clubOverrides[id ?? '']);
  const userRoles = useStore((s) => s.userRoles);
  const customEvents = useStore((s) => s.customEvents);

  const canEdit = useMemo(() => {
    const r = userRoles.find((ur) => ur.clubId === id);
    return r?.role === 'ADMIN' || r?.role === 'EDITOR';
  }, [userRoles, id]);

  const adminRole = useMemo<AdminRole | null>(() => {
    const r = userRoles.find((ur) => ur.clubId === id);
    return r?.role ?? null;
  }, [userRoles, id]);

  const club = useMemo(() => {
    const base = MOCK_CLUBS.find((c) => c.id === id) ?? null;
    if (!base) return null;
    if (!clubOverrides) return base;
    return {
      ...base,
      ...(clubOverrides.name && { name: clubOverrides.name }),
      ...(clubOverrides.desc && { desc: clubOverrides.desc }),
      ...(clubOverrides.category && { category: clubOverrides.category }),
      ...(clubOverrides.aboutUs && { aboutUs: clubOverrides.aboutUs }),
    };
  }, [id, clubOverrides]);

  const upcomingEvents = useMemo(
    () => [
      ...customEvents.filter((e) => e.communityId === id),
      ...MOCK_EVENTS_FOR_SCREEN.filter((e) => e.communityId === id),
    ],
    [id, customEvents],
  );

  const joined = useStore((s) => s.isClubJoined(id ?? ''));
  const joinClub = useStore((s) => s.joinClub);
  const leaveClub = useStore((s) => s.leaveClub);

  if (!club) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtnSolid}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.centered}>
          <Ionicons name="people-outline" size={52} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Club not found</Text>
          <Text style={styles.emptyText}>This community may have been removed or the link is invalid.</Text>
        </View>
      </View>
    );
  }

  const heroGradient = CATEGORY_GRADIENTS[club.category ?? ''] ?? DEFAULT_GRADIENT;
  const accentColor = CATEGORY_ACCENT[club.category ?? ''] ?? Colors.indigo;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={[styles.hero, { height: 200 + insets.top }]}>
          <LinearGradient
            colors={[...heroGradient]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroNoise} />

          {/* back button */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + 12 }]}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </Pressable>

          {/* Chat button */}
          <Pressable
            onPress={() => router.push(`/community/${id}/chat`)}
            style={[styles.chatBtnHero, { top: insets.top + 12 }]}
            hitSlop={10}
          >
            <Ionicons name="chatbubbles" size={16} color={Colors.white} />
          </Pressable>

          {/* Category label */}
          {club.category && (
            <View style={[styles.catBadge, { top: insets.top + 12 }]}>
              <Text style={[styles.catBadgeText, { color: accentColor }]}>
                {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
              </Text>
            </View>
          )}

          {/* Bottom fade */}
          <LinearGradient
            colors={['transparent', Colors.bg]}
            style={styles.heroFade}
          />
        </View>

        {/* ── Management Mode badge ── */}
        {canEdit && (
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.amber} />
            <Text style={styles.adminBadgeText}>
              {adminRole === 'ADMIN' ? 'Admin' : 'Editor'} Mode
            </Text>
          </View>
        )}

        {/* ── Club identity block ── */}
        <View style={styles.identity}>
          {/* Logo / avatar */}
          <View style={[styles.logoWrap, { borderColor: accentColor + '55' }]}>
            <LinearGradient
              colors={[...heroGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.logoInitial}>
              {club.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.clubDesc}>{club.desc}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={accentColor} />
              <Text style={styles.statValue}>{formatFollowers(club.followers)}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={16} color={accentColor} />
              <Text style={styles.statValue}>{upcomingEvents.length}</Text>
              <Text style={styles.statLabel}>upcoming events</Text>
            </View>
          </View>

          {/* Action buttons row */}
          <View style={styles.actionBtnsRow}>
            {/* Join / Leave toggle */}
            <Pressable
              style={({ pressed }) => [
                styles.joinBtn,
                joined && styles.joinBtnActive,
                pressed && { opacity: 0.82 },
                { borderColor: joined ? accentColor + '66' : Colors.metuRed },
              ]}
              onPress={() => {
                if (!id) return;
                if (joined) leaveClub(id);
                else joinClub(id);
              }}
              accessibilityRole="button"
              accessibilityLabel={joined ? 'Leave community' : 'Join community'}
            >
              <Ionicons
                name={joined ? 'checkmark-circle' : 'people-outline'}
                size={16}
                color={joined ? accentColor : Colors.white}
              />
              <Text style={[styles.joinBtnText, joined && { color: accentColor }]}>
                {joined ? 'Joined' : 'Join Community'}
              </Text>
            </Pressable>

            {/* Group Chat button */}
            <Pressable
              style={({ pressed }) => [styles.chatBtn, pressed && { opacity: 0.82 }]}
              onPress={() => router.push(`/community/${id}/chat`)}
              accessibilityRole="button"
              accessibilityLabel="Open group chat"
            >
              <Ionicons name="chatbubbles-outline" size={16} color={Colors.white} />
              <Text style={styles.chatBtnText}>Group Chat</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Admin: Create Post/Event ── */}
        {canEdit && (
          <Pressable
            style={({ pressed }) => [styles.createBanner, pressed && { opacity: 0.85 }]}
            onPress={() => router.push(`/create-post?clubId=${id}`)}
          >
            <View style={styles.createBannerIcon}>
              <Ionicons name="add-circle" size={20} color={Colors.amber} />
            </View>
            <View style={styles.createBannerText}>
              <Text style={styles.createBannerTitle}>Create Post / Event</Text>
              <Text style={styles.createBannerSub}>Publish to this community</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </Pressable>
        )}

        {/* ── About Us ── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>About Us</Text>
          {club.aboutUs.split('\n\n').map((paragraph, i) => (
            <Text key={i} style={styles.aboutText}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* ── Upcoming Events ── */}
        {upcomingEvents.length > 0 && (
          <View style={[styles.section, styles.eventsSection]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Upcoming Events</Text>
              <Text style={styles.seeAllText}>{upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''}</Text>
            </View>
            <FlatList
              data={upcomingEvents}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsRow}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item }) => (
                <View style={styles.eventCardWrap}>
                  <CompactEventCard event={item} communityName={club.name} />
                </View>
              )}
            />
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: insets.bottom + Spacing.xxxl + (canEdit ? 70 : 0) }} />
      </ScrollView>

      {/* ── Admin FAB ── */}
      {canEdit && (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { bottom: insets.bottom + 20 },
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}
          onPress={() => router.push(`/edit-club?id=${id}`)}
        >
          <Ionicons name="create" size={18} color={Colors.white} />
          <Text style={styles.fabText}>Edit Page</Text>
        </Pressable>
      )}
    </View>
  );
}

const LOGO_SIZE = 80;

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
  chatBtnHero: {
    position: 'absolute',
    left: Spacing.lg + 50,
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catBadge: {
    position: 'absolute',
    right: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  catBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.4,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  /* ── Identity ── */
  identity: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: 0,
    gap: Spacing.md,
    marginTop: -(LOGO_SIZE / 2),
  },
  logoWrap: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
  },
  logoInitial: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
  clubName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  clubDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxl,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },

  /* ── Action buttons ── */
  actionBtnsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  joinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.metuRed,
    borderWidth: 1,
    borderColor: Colors.metuRedLight,
    paddingVertical: 13,
    borderRadius: Radius.full,
  },
  joinBtnActive: {
    backgroundColor: 'transparent',
  },
  joinBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
  },
  chatBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },

  /* ── Sections ── */
  section: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  eventsSection: {
    paddingHorizontal: 0,
    paddingTop: Spacing.xxl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    marginTop: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
  },
  sectionHeading: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  aboutText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  eventsRow: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xs,
  },
  eventCardWrap: {
    width: 172,
  },

  /* ── Admin badge ── */
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 5,
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.25)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 5,
    marginTop: -(Spacing.md),
    marginBottom: Spacing.sm,
  },
  adminBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.amber,
    letterSpacing: 0.4,
  },

  /* ── Create banner ── */
  createBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.2)',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  createBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(251,191,36,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBannerText: { flex: 1, gap: 2 },
  createBannerTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  createBannerSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  /* ── FAB ── */
  fab: {
    position: 'absolute',
    right: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.amber,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    elevation: 6,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  },
});

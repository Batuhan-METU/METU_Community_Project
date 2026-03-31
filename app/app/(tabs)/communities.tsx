import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import ClubCard, { type ClubItem } from '@/components/ClubCard';
import SearchInput from '@/components/SearchInput';
import { api } from '@/lib/api';
import type { Community } from '@/lib/types';

/* ─── Category filter strip ─── */
const CATEGORIES = [
  { key: 'technology',   label: 'Technology', icon: 'code-slash-outline'    as const, color: '#22d3ee', bg: '#1a2530' },
  { key: 'science',      label: 'Science',    icon: 'flask-outline'         as const, color: '#a78bfa', bg: '#231a2d' },
  { key: 'art',          label: 'Art',        icon: 'color-palette-outline' as const, color: '#e879f9', bg: '#2d1a25' },
  { key: 'sports',       label: 'Sports',     icon: 'football-outline'      as const, color: '#34d399', bg: '#1a2d1a' },
  { key: 'music',        label: 'Music',      icon: 'musical-notes-outline' as const, color: '#fb7185', bg: '#2d1a1a' },
  { key: 'business',     label: 'Business',   icon: 'briefcase-outline'     as const, color: '#fb923c', bg: '#2d211a' },
];

function categorySlug(s: string | undefined | null): string | undefined {
  const t = s?.trim().toLowerCase().replace(/\s+/g, '');
  return t || undefined;
}

/* ─── Mock clubs (always visible) ─── */
const MOCK_CLUBS: ClubItem[] = [
  { id: '1', name: 'Campus Music Night',      desc: 'Live performances, open mic sessions, and community-led jam circles.', category: 'music' },
  { id: '2', name: 'AI Builders Club',         desc: 'Hands-on ML projects, model demos, and technical peer mentoring.', category: 'technology' },
  { id: '3', name: 'Robotics Club',            desc: 'Build robots, compete in workshops, and learn embedded systems together.', category: 'technology' },
  { id: '4', name: 'Visual Arts Collective',   desc: 'Weekly illustration sessions, gallery tours, and collaborative exhibitions.', category: 'art' },
  { id: '5', name: 'Photography Walk Crew',    desc: 'Campus photo walks, editing labs, and friendly critique sessions.', category: 'art' },
  { id: '6', name: 'Astronomy Society',        desc: 'Night observations, telescope workshops, and science outreach.', category: 'science' },
];

/* ─── Screen ─── */
export default function CommunitiesScreen() {
  const [apiCommunities, setApiCommunities] = useState<Community[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getCommunities()
      .then((data) => { if (!cancelled) setApiCommunities(data as Community[]); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* If API returns clubs, merge; otherwise fall back to mocks. */
  const sourceClubs = useMemo((): ClubItem[] => {
    if (apiCommunities.length > 0) {
      return apiCommunities.map((c) => ({
        id: c.id,
        name: c.name,
        desc: c.description ?? '',
        category: categorySlug(c.category),
      }));
    }
    return MOCK_CLUBS;
  }, [apiCommunities]);

  const activeCategoryLabel = useMemo(
    () => CATEGORIES.find((c) => c.key === activeCat)?.label ?? null,
    [activeCat],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sourceClubs.filter((c) => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      const matchCat = !activeCat || c.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [sourceClubs, search, activeCat]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Discover Communities</Text>
        <Text style={styles.heroDesc}>
          Explore student clubs, connect with people, and find your place on campus.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.joinBtn, pressed && { opacity: 0.85 }]}>
          <Ionicons name="people-outline" size={15} color="#fff" />
          <Text style={styles.joinBtnText}>Join a Community</Text>
        </Pressable>

        {/* ── Category circles ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
          style={styles.catScroll}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.key;
            return (
              <Pressable
                key={cat.key}
                style={styles.catItem}
                onPress={() => setActiveCat(isActive ? null : cat.key)}>
                <View style={[
                  styles.catCircle,
                  { backgroundColor: cat.bg, borderColor: cat.color + (isActive ? 'cc' : '44') },
                  isActive && { borderWidth: 2 },
                ]}>
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>
                <Text style={[styles.catLabel, isActive && { color: Colors.text }]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Search ── */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategoryLabel ? `${activeCategoryLabel} clubs` : 'All clubs'}
        </Text>
        {activeCategoryLabel ? (
          <Text style={styles.sectionHint}>
            Showing communities tagged with {activeCategoryLabel.toLowerCase()}.
          </Text>
        ) : null}
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search communities..." />
      </View>

      {/* ── Grid ── */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ClubCard club={item} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="people-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.empty}>
              {activeCat
                ? `No ${activeCategoryLabel?.toLowerCase() ?? 'matching'} communities found.`
                : 'No communities found.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ─── Styles ─── */
const CIRCLE_SIZE = 60;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  hero: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.metuRed,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 9,
    borderRadius: Radius.full,
  },
  joinBtnText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  catScroll: { width: '100%', marginTop: Spacing.xs },
  catRow: {
    gap: Spacing.xl,
    paddingHorizontal: 2,
    paddingBottom: Spacing.xs,
  },
  catItem: {
    alignItems: 'center',
    gap: 6,
    width: CIRCLE_SIZE,
  },
  catCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catLabel: {
    fontSize: FontSize.xxs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },

  listHeader: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  sectionHint: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: -Spacing.xs,
  },

  grid: {
    paddingHorizontal: Spacing.lg,
    gap: 12,
    paddingBottom: 100,
  },
  gridRow: {
    gap: 12,
  },

  emptyWrap: { alignItems: 'center', gap: Spacing.sm, paddingTop: 40 },
  empty: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});

import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import CompactEventCard from '@/components/CompactEventCard';
import SearchInput from '@/components/SearchInput';
import FilterChips from '@/components/FilterChips';
import { api } from '@/lib/api';
import { MOCK_EVENTS_FOR_SCREEN, type EventsScreenEvent } from '@/constants/mockEvents';
import type { CommunityEvent, FilterCategory } from '@/lib/types';

export default function EventsScreen() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FilterCategory>('All');

  /* Background refresh only — never blocks UI; mocks show instantly while events=[] */
  useEffect(() => {
    let cancelled = false;
    api
      .getEvents()
      .then((data) => {
        if (cancelled) return;
        const list = data as CommunityEvent[];
        setEvents(list);
        if (list.length === 0) setCategory('All');
      })
      .catch(() => {
        if (cancelled) return;
        setEvents([]);
        setCategory('All');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceEvents = useMemo((): CommunityEvent[] => {
    return events.length > 0 ? events : MOCK_EVENTS_FOR_SCREEN;
  }, [events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sourceEvents.filter((e) => {
      const ev = e as CommunityEvent & { category?: string; community?: string };
      const matchCat = category === 'All' || ev.category === category;
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (ev.community && ev.community.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [sourceEvents, search, category]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>All Events</Text>
        <Text style={styles.subtitle}>Find events by community name, category, or topic.</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchWrap}>
          <SearchInput value={search} onChangeText={setSearch} placeholder="Search events..." />
        </View>
        <FilterChips selected={category} onSelect={setCategory} />
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.grid, filtered.length === 0 && styles.gridEmpty]}
        columnWrapperStyle={filtered.length > 0 ? styles.gridRow : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const row = item as EventsScreenEvent;
          return <CompactEventCard event={item} communityName={row.community} />;
        }}
        ListEmptyComponent={<EventsEmptyState />}
      />
    </SafeAreaView>
  );
}

function EventsEmptyState() {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyHeadline}>Nothing here yet</Text>
      <Text style={styles.emptySub}>No events found</Text>
      <Text style={styles.emptyHint}>Try another category or adjust your search.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerBlock: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
    marginTop: 4,
  },
  controls: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchWrap: {
    paddingHorizontal: Spacing.xxl,
  },
  grid: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },
  gridEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gridRow: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  emptyWrap: {
    width: '100%',
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyHeadline: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    opacity: 0.45,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  emptySub: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    maxWidth: 260,
    lineHeight: 20,
  },
});

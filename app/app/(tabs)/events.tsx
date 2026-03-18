import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import EventCard from '@/components/EventCard';
import SearchInput from '@/components/SearchInput';
import FilterChips from '@/components/FilterChips';
import type { CommunityEvent, FilterCategory } from '@/lib/types';

export default function EventsScreen() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FilterCategory>('All');

  useEffect(() => {
    fetch('http://localhost:8080/api/events')
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchCat = category === 'All' || e.category === category;
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.community?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [events, search, category]);

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
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <EventCard event={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No events found.</Text>
        }
      />
    </SafeAreaView>
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
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 40,
  },
  gridRow: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  empty: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});

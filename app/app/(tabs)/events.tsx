import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColors, type ThemeColors } from '@/hooks/useColors';
import CompactEventCard from '@/components/CompactEventCard';
import SearchInput from '@/components/SearchInput';
import FilterChips from '@/components/FilterChips';
import { api } from '@/lib/api';
import { MOCK_EVENTS_FOR_SCREEN, type EventsScreenEvent } from '@/constants/mockEvents';
import { useStore } from '@/lib/useStore';
import type { CommunityEvent, FilterCategory } from '@/lib/types';

function MyUpcomingCard({ event }: { event: EventsScreenEvent }) {
  const router = useRouter();
  const { colors } = useColors();
  const s = useMemo(() => createStyles(colors), [colors]);
  const seatInfo = useStore((st) => st.getSeats(event.id));
  const d = event.starts_at ? new Date(event.starts_at) : null;
  const dayNum = d ? d.getDate() : '';
  const monthSh = d ? d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '';
  const fraction = seatInfo ? Math.min(seatInfo.currentParticipants / seatInfo.totalSeats, 1) : 0;

  return (
    <Pressable
      style={({ pressed }) => [s.upCard, pressed && { opacity: 0.85 }]}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <View style={s.upDateBox}>
        <Text style={s.upDay}>{dayNum}</Text>
        <Text style={s.upMonth}>{monthSh}</Text>
      </View>
      <Text style={s.upTitle} numberOfLines={2}>{event.title}</Text>
      <Text style={s.upCommunity} numberOfLines={1}>{event.community}</Text>
      {seatInfo && (
        <View style={s.upSeatRow}>
          <View style={s.upSeatBarBg}>
            <View
              style={[
                s.upSeatBarFill,
                {
                  width: `${Math.round(fraction * 100)}%`,
                  backgroundColor: fraction > 0.9 ? colors.danger : fraction > 0.7 ? colors.amber : colors.emerald,
                },
              ]}
            />
          </View>
          <Text style={s.upSeatText}>
            {seatInfo.currentParticipants}/{seatInfo.totalSeats}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function EventsScreen() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FilterCategory>('All');
  const registeredEventIds = useStore((s) => s.registeredEventIds);
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

  const myUpcoming = useMemo(() => {
    const regSet = new Set(registeredEventIds);
    return MOCK_EVENTS_FOR_SCREEN.filter((e) => regSet.has(e.id));
  }, [registeredEventIds]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const regSet = new Set(registeredEventIds);
    return sourceEvents
      .filter((e) => !regSet.has(e.id))
      .filter((e) => {
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
  }, [sourceEvents, search, category, registeredEventIds]);

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
        contentContainerStyle={[styles.grid, filtered.length === 0 && myUpcoming.length === 0 && styles.gridEmpty]}
        columnWrapperStyle={filtered.length > 0 ? styles.gridRow : undefined}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          myUpcoming.length > 0 ? (
            <View style={styles.upSection}>
              <View style={styles.upHeader}>
                <Ionicons name="checkmark-circle" size={16} color={colors.emerald} />
                <Text style={styles.upHeaderText}>My Upcoming Events</Text>
                <View style={styles.upBadge}>
                  <Text style={styles.upBadgeText}>{myUpcoming.length}</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upScroll}>
                {myUpcoming.map((ev) => (
                  <MyUpcomingCard key={ev.id} event={ev} />
                ))}
              </ScrollView>
              <View style={styles.upDivider} />
            </View>
          ) : null
        }
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
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyHeadline}>Nothing here yet</Text>
      <Text style={styles.emptySub}>No events found</Text>
      <Text style={styles.emptyHint}>Try another category or adjust your search.</Text>
    </View>
  );
}

const UP_CARD_W = 170;

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    headerBlock: {
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    title: {
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: C.neutral500,
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
    upSection: {
      marginBottom: Spacing.lg,
    },
    upHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: Spacing.sm,
      marginBottom: Spacing.md,
    },
    upHeaderText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.bold,
      color: C.text,
      flex: 1,
    },
    upBadge: {
      backgroundColor: C.emerald,
      width: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: 'center',
      alignItems: 'center',
    },
    upBadgeText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      color: C.black,
    },
    upScroll: {
      paddingHorizontal: Spacing.sm,
      gap: Spacing.md,
    },
    upDivider: {
      height: 1,
      backgroundColor: C.border,
      marginTop: Spacing.lg,
      marginHorizontal: Spacing.sm,
    },
    upCard: {
      width: UP_CARD_W,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.lg,
      gap: 6,
    },
    upDateBox: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(128,128,128,0.08)',
      borderWidth: 1,
      borderColor: C.borderSubtle,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    upDay: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    upMonth: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: C.textMuted,
      letterSpacing: 0.5,
    },
    upTitle: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.text,
      lineHeight: 18,
    },
    upCommunity: {
      fontSize: FontSize.xs,
      color: C.textMuted,
    },
    upSeatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 2,
    },
    upSeatBarBg: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: C.bgElevated,
      overflow: 'hidden',
    },
    upSeatBarFill: {
      height: 4,
      borderRadius: 2,
    },
    upSeatText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: C.textMuted,
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
      backgroundColor: C.bgElevated,
      borderWidth: 1,
      borderColor: C.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xl,
    },
    emptyHeadline: {
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.bold,
      color: C.textMuted,
      opacity: 0.45,
      letterSpacing: -0.5,
      marginBottom: Spacing.sm,
    },
    emptySub: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: C.text,
      textAlign: 'center',
    },
    emptyHint: {
      fontSize: FontSize.sm,
      color: C.textMuted,
      textAlign: 'center',
      marginTop: Spacing.md,
      maxWidth: 260,
      lineHeight: 20,
    },
  });
}

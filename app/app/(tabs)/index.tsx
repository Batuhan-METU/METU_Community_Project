import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import EventCard from '@/components/EventCard';
import type { CommunityEvent } from '@/lib/types';

/* ─────────────────────────────────────────────────────────────
   Local type that bundles resolved community info onto an event.
──────────────────────────────────────────────────────────────── */
type FeedEvent = CommunityEvent & {
  _communityName?: string;
  _communityLogo?: any;
};

/* ─────────────────────────────────────────────────────────────
   Mock seed — shown when the backend returns no events.
   Keeps the UI looking polished during demos / initial launch.
──────────────────────────────────────────────────────────────── */
const now = Date.now();
const MOCK_EVENTS: FeedEvent[] = [
  {
    id: 'mock-edt',
    title: 'Tanışma Dansı & Workshop',
    community_id: 'edt',
    description:
      'Eşli dans dünyasına ilk adımını atmak için mükemmel bir fırsat! Salsa, Tango, Bachata ve daha fazlası seni bekliyor.',
    location: 'ODTÜ Kültür ve Kongre Merkezi',
    starts_at: new Date(now + 3 * 86_400_000).toISOString(),
    is_paid: true,
    ticket_price: 50,
    _communityName: 'Eşli Danslar Topluluğu',
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _communityLogo: require('../../assets/images/edt_logo.jpg'),
  },
  {
    id: 'mock-vt',
    title: 'Vaka Analizi Yarışması',
    community_id: 'vt',
    description:
      'Gerçek iş vakalarını analiz et, çözüm öner ve jüri karşısında sun. Kazananlar sertifika ve ödül alır.',
    location: 'ODTÜ Mühendislik Fakültesi B-201',
    starts_at: new Date(now + 7 * 86_400_000).toISOString(),
    is_paid: false,
    _communityName: 'ODTÜ Verimlilik Topluluğu',
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _communityLogo: require('../../assets/images/vt_logo.jpg'),
  },
  {
    id: 'mock-most',
    title: 'C++ ile Oyun Geliştirme Workshop',
    community_id: 'most',
    description:
      'Motorsport ekibiyle buluş: C++ tabanlı oyun mekaniği ve simülasyon sistemlerini sıfırdan öğren.',
    location: 'ODTÜ Elektrik-Elektronik Mühendisliği EE-03',
    starts_at: new Date(now + 14 * 86_400_000).toISOString(),
    is_paid: false,
    _communityName: 'METU Motorsport',
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _communityLogo: require('../../assets/images/most_logo.jpg'),
  },
];

/* ─────────────────────────────────────────────────────────────
   Screen
──────────────────────────────────────────────────────────────── */
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Controlled demo feed: we intentionally do NOT merge backend events for now.
  const [demoEvents] = useState<FeedEvent[]>(MOCK_EVENTS);

  return (
    <View style={styles.screen}>
      {/* ─── Top bar ─── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.logo}>
          METU<Text style={styles.logoAccent}>Com</Text>
        </Text>
        <View style={styles.topRight}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/events' as any)}>
            <Ionicons name="search-outline" size={21} color={Colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={21} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      {/* ─── Feed ─── */}
      <FlatList
        data={demoEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
        ListHeaderComponent={<FeedHeader />}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            communityName={item._communityName}
            communityLogo={item._communityLogo}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

/* ─── "for you" section label ─── */
function FeedHeader() {
  return (
    <View style={styles.feedHeader}>
      <Text style={styles.feedHeaderText}>for you</Text>
      <View style={styles.feedHeaderDot} />
    </View>
  );
}

/* ─── Empty state ─── */
function EmptyFeed() {
  return (
    <View style={styles.emptyBox}>
      <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No events yet</Text>
      <Text style={styles.emptyText}>
        Events from communities you follow will appear here.
      </Text>
    </View>
  );
}

/* ─────────────────────────────────────────────────────────────
   Styles
──────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── Top bar ── */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  logo: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    letterSpacing: -0.8,
  },
  logoAccent: {
    color: Colors.metuRed,
  },
  topRight: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  /* ── Feed ── */
  feedContainer: {
    paddingBottom: Spacing.xxxl,
  },
  separator: {
    height: Spacing.lg,
  },

  /* ── Feed section header ── */
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  feedHeaderText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    letterSpacing: 0.4,
  },
  feedHeaderDot: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  /* ── Empty state ── */
  emptyBox: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 80,
    paddingHorizontal: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

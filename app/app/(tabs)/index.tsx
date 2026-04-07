import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColors, type ThemeColors } from '@/hooks/useColors';
import { MOCK_NOTIFICATIONS } from '@/constants/mockNotifications';
import { MOCK_EVENTS_FOR_SCREEN } from '@/constants/mockEvents';
import { MOCK_CLUBS } from '@/constants/mockClubs';
import { useStore } from '@/lib/useStore';
import EventCard from '@/components/EventCard';
import type { CommunityEvent } from '@/lib/types';

const UNREAD_COUNT = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

type FeedEvent = CommunityEvent & {
  _communityName?: string;
  _communityLogo?: any;
};

const now = Date.now();
const LOGO_EVENTS: FeedEvent[] = [
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

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const joinedClubIds = useStore((s) => s.joinedClubIds);
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const feedEvents = useMemo<FeedEvent[]>(() => {
    if (joinedClubIds.length === 0) return [];
    const joinedSet = new Set(joinedClubIds);
    const communityEvents: FeedEvent[] = MOCK_EVENTS_FOR_SCREEN
      .filter((e) => e.communityId && joinedSet.has(e.communityId))
      .map((e) => {
        const club = MOCK_CLUBS.find((c) => c.id === e.communityId);
        return { ...e, _communityName: club?.name ?? e.community } as FeedEvent;
      });
    return [...communityEvents, ...LOGO_EVENTS];
  }, [joinedClubIds]);

  const hasJoinedClubs = joinedClubIds.length > 0;

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.logo}>
          METU<Text style={styles.logoAccent}>Com</Text>
        </Text>
        <View style={styles.topRight}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/events' as any)}>
            <Ionicons name="search-outline" size={21} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={21} color={colors.text} />
            {UNREAD_COUNT > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>
                  {UNREAD_COUNT > 9 ? '9+' : UNREAD_COUNT}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <FlatList
        data={feedEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.feedContainer, !hasJoinedClubs && { flexGrow: 1 }]}
        ListHeaderComponent={hasJoinedClubs ? <FeedHeader /> : null}
        ListEmptyComponent={<DiscoverCTA />}
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

function FeedHeader() {
  const router = useRouter();
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.hypeBanner, pressed && { opacity: 0.88 }]}
        onPress={() => router.push('/hype')}
      >
        <LinearGradient
          colors={['rgba(251,191,36,0.08)', 'rgba(251,191,36,0.03)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.hypeBannerLeft}>
          <Text style={styles.hypeBannerEmoji}>🔥</Text>
          <View style={styles.hypeBannerText}>
            <Text style={styles.hypeBannerTitle}>Post-Event Hype</Text>
            <Text style={styles.hypeBannerSub}>See what's trending on campus</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>

      <View style={styles.feedHeader}>
        <Text style={styles.feedHeaderText}>for you</Text>
        <View style={styles.feedHeaderDot} />
      </View>
    </>
  );
}

function DiscoverCTA() {
  const router = useRouter();
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.discoverWrap}>
      <View style={styles.discoverIconCircle}>
        <Ionicons name="people-outline" size={44} color={colors.metuRed} />
      </View>
      <Text style={styles.discoverTitle}>Discover Communities</Text>
      <Text style={styles.discoverText}>
        Join clubs and communities to see their upcoming events right here in your feed.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.discoverBtn, pressed && { opacity: 0.85 }]}
        onPress={() => router.push('/(tabs)/communities')}
      >
        <Ionicons name="compass-outline" size={16} color={colors.white} />
        <Text style={styles.discoverBtnText}>Explore Clubs</Text>
      </Pressable>
    </View>
  );
}

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: C.bg,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      backgroundColor: C.bg,
    },
    logo: {
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.extrabold,
      color: C.text,
      letterSpacing: -0.8,
    },
    logoAccent: {
      color: C.metuRed,
    },
    topRight: {
      flexDirection: 'row',
      gap: Spacing.xs,
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: C.bgElevated,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
    },
    bellBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 17,
      height: 17,
      borderRadius: 9,
      backgroundColor: C.metuRed,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: C.bg,
    },
    bellBadgeText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: C.white,
    },
    feedContainer: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxxl,
    },
    separator: {
      height: Spacing.lg,
    },
    hypeBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: C.bgElevated,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.2)',
      padding: Spacing.lg,
      marginTop: Spacing.lg,
      overflow: 'hidden',
    },
    hypeBannerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      flex: 1,
    },
    hypeBannerEmoji: { fontSize: 22 },
    hypeBannerText: { flex: 1, gap: 2 },
    hypeBannerTitle: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    hypeBannerSub: {
      fontSize: FontSize.xs,
      color: C.textMuted,
    },
    feedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    feedHeaderText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: C.textMuted,
      letterSpacing: 0.4,
    },
    feedHeaderDot: {
      flex: 1,
      height: 1,
      backgroundColor: C.border,
    },
    discoverWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xxl,
      gap: Spacing.md,
      paddingBottom: 40,
    },
    discoverIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: C.metuRedDim,
      borderWidth: 1,
      borderColor: 'rgba(227,6,19,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    discoverTitle: {
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.bold,
      color: C.text,
      letterSpacing: -0.5,
    },
    discoverText: {
      fontSize: FontSize.sm,
      color: C.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 280,
    },
    discoverBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      backgroundColor: C.metuRed,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.lg,
      borderRadius: Radius.full,
      marginTop: Spacing.md,
    },
    discoverBtnText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: C.white,
    },
  });
}

import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import EventCard from '@/components/EventCard';
import type { CommunityEvent } from '@/lib/types';

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/events')
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.1)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Live on campus · Spring 2026</Text>
          </View>
          <Text style={styles.heroTitle}>
            Discover{'\n'}Communities{'\n'}at METU.
          </Text>
          <Text style={styles.heroDesc}>
            Explore student communities, join exciting events, and connect with people who share your
            interests across the METU campus.
          </Text>
          <View style={styles.heroButtons}>
            <Pressable style={styles.primaryBtn} onPress={() => router.push('/events' as any)}>
              <Text style={styles.primaryBtnText}>Explore Events</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={() => router.push('/communities' as any)}>
              <Text style={styles.secondaryBtnText}>Join a Community</Text>
            </Pressable>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <Text style={styles.sectionSub}>Handpicked events from active student communities.</Text>
            </View>
            <Pressable onPress={() => router.push('/events' as any)}>
              <Text style={styles.viewAll}>View all →</Text>
            </Pressable>
          </View>
          <FlatList
            data={events.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardRow}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <EventCard event={item} />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No events yet or backend is offline.</Text>
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  hero: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxxl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: Spacing.xxl,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  heroTitle: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: Spacing.lg,
  },
  heroDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
    marginBottom: Spacing.xxl,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  secondaryBtnText: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },

  section: {
    marginTop: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  sectionSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  viewAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  cardRow: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.lg,
  },
  cardWrapper: {
    width: 260,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.xxl,
  },
});

import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import CommunityCard from '@/components/CommunityCard';
import SearchInput from '@/components/SearchInput';
import type { Community } from '@/lib/types';

export default function CommunitiesScreen() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/communities')
      .then((r) => r.json())
      .then(setCommunities)
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
    );
  }, [communities, search]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Mini hero matching web's communities page header */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Discover Communities</Text>
        <Text style={styles.heroDesc}>
          Explore student communities, connect with people, and find your place on campus.
        </Text>
        <Pressable style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>Join a Community</Text>
        </Pressable>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Communities</Text>
        <View style={styles.searchWrap}>
          <SearchInput value={search} onChangeText={setSearch} placeholder="Search communities..." />
        </View>
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
            <CommunityCard community={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No communities found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  hero: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 320,
    lineHeight: 20,
  },
  joinBtn: {
    backgroundColor: Colors.green,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    marginTop: Spacing.xl,
  },
  joinBtnText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },

  listHeader: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  searchWrap: {},
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

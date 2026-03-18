import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('http://localhost:8080/api/communities')
      .then((r) => r.json())
      .then((list: any[]) => setCommunity(list.find((c) => String(c.id) === String(id)) || null))
      .catch(() => setCommunity(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.indigo} />
        </View>
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Community not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[...Gradients.communityCardBg]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        />
        <Pressable onPress={() => router.back()} style={styles.backBtnFloat}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </Pressable>
        <View style={styles.content}>
          <View style={styles.initialBox}>
            <Text style={styles.initial}>{community.name.charAt(0)}</Text>
          </View>
          <Text style={styles.title}>{community.name}</Text>
          {community.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{community.category}</Text>
            </View>
          )}
          {community.description && (
            <Text style={styles.desc}>{community.description}</Text>
          )}
          <Pressable style={styles.joinBtn}>
            <Text style={styles.joinText}>Join Community</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted },
  backBtn: { padding: Spacing.xl },
  backBtnFloat: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradient: { height: 180 },
  content: { padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md },
  initialBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -32,
    borderWidth: 3,
    borderColor: Colors.bg,
  },
  initial: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.text, textAlign: 'center' },
  categoryBadge: {
    backgroundColor: Colors.neutral100,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  categoryText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  joinBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: 14,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
  },
  joinText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.medium },
});

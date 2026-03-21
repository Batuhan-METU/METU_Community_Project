import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('http://localhost:8080/api/events')
      .then((r) => r.json())
      .then((list: any[]) => setEvent(list.find((e) => String(e.id) === String(id)) || null))
      .catch(() => setEvent(null))
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

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Event not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dateStr = event.date || event.starts_at;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[...Gradients.eventCardBg]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        />
        <Pressable onPress={() => router.back()} style={styles.backBtnFloat}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </Pressable>
        <View style={styles.content}>
          {dateStr && (
            <Text style={styles.date}>
              {new Date(dateStr).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}
            </Text>
          )}
          <Text style={styles.title}>{event.title}</Text>
          {event.location && (
            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.rowText}>{event.location}</Text>
            </View>
          )}
          {event.description && <Text style={styles.desc}>{event.description}</Text>}
          {event.is_paid && event.ticket_price != null && (
            <Text style={styles.price}>Ticket: {event.ticket_price} TL</Text>
          )}
          <Pressable style={styles.registerBtn}>
            <Text style={styles.registerText}>Register for Event</Text>
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
  heroGradient: { height: 200 },
  content: { padding: Spacing.xxl, gap: Spacing.md },
  date: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  desc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  price: { fontSize: FontSize.base, color: Colors.indigo, fontWeight: FontWeight.semibold },
  registerBtn: {
    backgroundColor: Colors.black,
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.medium },
});

import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Gradients, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { CommunityEvent } from '@/lib/types';

type Props = {
  event: CommunityEvent;
};

export default function EventCard({ event }: Props) {
  const router = useRouter();
  const dateStr = event.date || event.starts_at;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  const formattedTime = dateStr
    ? new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => router.push(`/event/${event.id}`)}>
      {/* Gradient header matching web's from-indigo via-fuchsia to-orange */}
      <LinearGradient
        colors={[...Gradients.eventCardBg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      />
      {/* Content area matching web's slate-900 bg */}
      <View style={styles.content}>
        <View style={styles.infoBlock}>
          {dateStr && (
            <Text style={styles.dateLine}>
              {formattedDate}, {formattedTime}
            </Text>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          {event.location && (
            <Text style={styles.location}>{event.location}</Text>
          )}
        </View>
        <Pressable
          style={styles.registerBtn}
          onPress={() => router.push(`/event/${event.id}`)}>
          <Text style={styles.registerText}>Register</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.bgDarkCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientHeader: {
    height: 130,
  },
  content: {
    backgroundColor: '#0f172a',
    padding: Spacing.lg,
    gap: Spacing.md,
    justifyContent: 'space-between',
    flex: 1,
  },
  infoBlock: {
    gap: Spacing.sm,
  },
  dateLine: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textOnDarkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnDark,
    lineHeight: 20,
  },
  location: {
    fontSize: FontSize.sm,
    color: Colors.textOnDarkMuted,
  },
  registerBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  registerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
});

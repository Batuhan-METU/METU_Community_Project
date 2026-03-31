import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

/** `category` slug matches hero chips: technology | science | art | sports | music | business */
export type ClubItem = {
  id: string;
  name: string;
  desc: string;
  category?: string;
};

type Props = {
  club: ClubItem;
};

/** Gradient card aligned to web design: bottom-anchored title + desc + Join pill. */
export default function ClubCard({ club }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.88 }]}
      onPress={() => router.push(`/community/${club.id}`)}
      accessibilityRole="button"
      accessibilityLabel={club.name}>
      <LinearGradient
        colors={['#1a1a2a', '#0d0d14', '#0a0a0f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>{club.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{club.desc}</Text>
          <Pressable
            style={({ pressed }) => [styles.joinBtn, pressed && { opacity: 0.85, backgroundColor: Colors.metuRedLight }]}
            onPress={(e) => {
              e.stopPropagation?.();
              router.push(`/community/${club.id}`);
            }}>
            <Text style={styles.joinText}>Join</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 164,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  content: {
    gap: 6,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    lineHeight: 19,
  },
  desc: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 17,
  },
  joinBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.metuRed,
    borderWidth: 1,
    borderColor: Colors.metuRedLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    marginTop: 4,
  },
  joinText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

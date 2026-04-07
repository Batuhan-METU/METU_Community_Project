import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColors, type ThemeColors } from '@/hooks/useColors';

export type ClubItem = {
  id: string;
  name: string;
  desc: string;
  category?: string;
};

type Props = {
  club: ClubItem;
};

export default function ClubCard({ club }: Props) {
  const router = useRouter();
  const { colors, isDark } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientColors = isDark
    ? (['#1a1a2a', '#0d0d14', '#0a0a0f'] as const)
    : (['#f0f0f5', '#e8e8ee', '#e0e0e8'] as const);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.88 }]}
      onPress={() => router.push(`/community/${club.id}`)}
      accessibilityRole="button"
      accessibilityLabel={club.name}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>{club.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{club.desc}</Text>
          <Pressable
            style={({ pressed }) => [styles.joinBtn, pressed && { opacity: 0.85, backgroundColor: colors.metuRedLight }]}
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

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: Radius.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: C.border,
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
      color: C.text,
      lineHeight: 19,
    },
    desc: {
      fontSize: FontSize.xs,
      color: C.textMuted,
      lineHeight: 17,
    },
    joinBtn: {
      alignSelf: 'flex-start',
      backgroundColor: C.metuRed,
      borderWidth: 1,
      borderColor: C.metuRedLight,
      borderRadius: Radius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: 5,
      marginTop: 4,
    },
    joinText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: C.white,
    },
  });
}

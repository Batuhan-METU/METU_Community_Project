import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { Community } from '@/lib/types';

const CATEGORY_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; gradient: readonly [string, string] }> = {
  Engineering: { icon: 'hardware-chip-outline', gradient: ['#818cf8', '#6366f1'] },
  Arts:        { icon: 'color-palette-outline', gradient: ['#e879f9', '#a855f7'] },
  Sports:      { icon: 'football-outline',      gradient: ['#34d399', '#10b981'] },
  Music:       { icon: 'musical-notes-outline',  gradient: ['#fb923c', '#f97316'] },
  Social:      { icon: 'people-outline',         gradient: ['#38bdf8', '#0ea5e9'] },
  Science:     { icon: 'flask-outline',          gradient: ['#2dd4bf', '#14b8a6'] },
  Business:    { icon: 'trending-up-outline',    gradient: ['#fbbf24', '#f59e0b'] },
};

const DEFAULT_CONFIG = { icon: 'sparkles-outline' as keyof typeof Ionicons.glyphMap, gradient: ['#818cf8', '#a78bfa'] as const };

type Props = {
  community: Community;
};

export default function CommunityCard({ community }: Props) {
  const router = useRouter();
  const config = (community.category && CATEGORY_CONFIG[community.category]) || DEFAULT_CONFIG;

  return (
    <Pressable
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      onPress={() => router.push(`/community/${community.id}`)}>
      {/* Gradient header with category icon */}
      <LinearGradient
        colors={[...config.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name={config.icon} size={24} color="#fff" />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <View style={styles.initialBox}>
            <Text style={[styles.initial, { color: config.gradient[0] }]}>
              {community.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.name} numberOfLines={1}>{community.name}</Text>
            {community.category ? (
              <Text style={styles.category}>{community.category}</Text>
            ) : null}
          </View>
        </View>

        {community.description ? (
          <Text style={styles.desc} numberOfLines={2}>{community.description}</Text>
        ) : null}

        {/* CTA */}
        <View style={styles.ctaRow}>
          <LinearGradient
            colors={[...config.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.joinBtn}>
            <Text style={styles.joinText}>Explore</Text>
          </LinearGradient>
          <View style={styles.arrowBox}>
            <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    backgroundColor: Colors.bgCardHover,
  },

  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  initialBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  initial: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  nameCol: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  category: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  joinBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  joinText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#fff',
  },
  arrowBox: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

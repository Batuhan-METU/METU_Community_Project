import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Gradients, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { Community } from '@/lib/types';

type Props = {
  community: Community;
};

export default function CommunityCard({ community }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => router.push(`/communities/${community.id}`)}>
      {/* Gradient header matching web's emerald→teal→cyan */}
      <LinearGradient
        colors={[...Gradients.communityCardBg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      />
      <View style={styles.content}>
        <View style={styles.infoBlock}>
          <View style={styles.nameRow}>
            <View style={styles.initialBox}>
              <Text style={styles.initial}>{community.name.charAt(0)}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {community.name}
            </Text>
          </View>
          {community.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {community.description}
            </Text>
          )}
          {community.numberOfEvents != null && (
            <Text style={styles.meta}>
              <Text style={styles.metaBold}>{community.numberOfEvents}</Text> events
            </Text>
          )}
        </View>
        <Pressable
          style={styles.viewBtn}
        onPress={() => router.push(`/communities/${community.id}`)}>
        <Text style={styles.viewBtnText}>View Community</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.neutral900,
    borderWidth: 1,
    borderColor: Colors.neutral800,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientHeader: {
    height: 110,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    justifyContent: 'space-between',
    flex: 1,
  },
  infoBlock: {
    gap: Spacing.sm,
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
    backgroundColor: Colors.neutral800,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral400,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    flex: 1,
  },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.neutral400,
    lineHeight: 20,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
  },
  metaBold: {
    fontWeight: FontWeight.medium,
    color: Colors.neutral300,
  },
  viewBtn: {
    backgroundColor: Colors.neutral800,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.neutral200,
  },
});

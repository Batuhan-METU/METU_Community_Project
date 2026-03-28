import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { FilterCategory } from '@/lib/types';

const CATEGORIES: FilterCategory[] = [
  'All',
  'Engineering',
  'Technology',
  'Business',
  'Art',
  'Music',
  'Science',
  'Sports',
  'Entertainment',
];

type Props = {
  selected: FilterCategory;
  onSelect: (cat: FilterCategory) => void;
};

export default function FilterChips({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;
        return (
          <Pressable key={cat} onPress={() => onSelect(cat)} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}>
            {isActive ? (
              <View style={styles.chipActive}>
                <Text style={styles.chipTextActive}>{cat}</Text>
              </View>
            ) : (
              <View style={styles.chipInactive}>
                <Text style={styles.chipText}>{cat}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
  },
  chipActive: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.metuRed,
    borderWidth: 1,
    borderColor: Colors.metuRedLight,
    shadowColor: Colors.metuRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  chipInactive: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipTextActive: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
});

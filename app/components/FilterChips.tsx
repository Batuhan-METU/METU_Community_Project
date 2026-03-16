import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Gradients, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import type { FilterCategory } from '@/lib/types';

const CATEGORIES: FilterCategory[] = ['All', 'Engineering', 'Business', 'Art', 'Music', 'Science'];

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
          <Pressable key={cat} onPress={() => onSelect(cat)}>
            {isActive ? (
              <LinearGradient
                colors={[...Gradients.accentBtn]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chip}>
                <Text style={styles.chipTextActive}>{cat}</Text>
              </LinearGradient>
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
    paddingHorizontal: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  chipInactive: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.neutral800,
  },
  chipTextActive: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.white,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.neutral400,
  },
});

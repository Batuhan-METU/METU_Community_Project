import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchInput({ value, onChangeText, placeholder = 'Search...' }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={16} color={Colors.neutral500} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.neutral700,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.neutral200,
  },
});

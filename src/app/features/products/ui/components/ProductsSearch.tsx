import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../../../../core/theme/tokens";

interface ProductsSearchProps {
  value: string;
  onChangeText: (input: string) => void;
}
export default function ProductsSearch({
  value,
  onChangeText,
}: ProductsSearchProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  searchInput: {
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../../../core/theme/tokens";

interface ProductsCounterProps {
  count: number;
}

export default function ProductsCounter({ count }: ProductsCounterProps) {
  return (
    <View style={styles.counterContainer}>
      <Text
        style={styles.counterText}
      >{`Showing ${count} ${count === 1 ? "product" : "products"}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  counterContainer: {
    marginBlockEnd: spacing.sm,
  },
  counterText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
});

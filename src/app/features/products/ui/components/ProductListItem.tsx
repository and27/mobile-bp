import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Product } from "../../domain/entities/Product";
import {
  colors,
  sizes,
  spacing,
  typography,
} from "../../../../core/theme/tokens";

interface Props {
  item: Product;
  onPress: () => void;
}
export default function ProductListItem({ item, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerPressed : null,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{`ID: ${item.id}`}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: sizes.listItemMinHeight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerPressed: {
    backgroundColor: colors.surfacePressed,
  },
  itemTitle: {
    fontSize: typography.body,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  itemSubtitle: {
    marginTop: spacing.xs,
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: sizes.iconLg,
    color: colors.iconMuted,
    lineHeight: sizes.iconLg,
  },
});

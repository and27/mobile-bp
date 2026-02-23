import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../../../core/theme/tokens";

interface ProductHeaderProps {
  id: string;
}

export default function ProductHeader({ id }: ProductHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{`ID: ${id}`}</Text>
      <Text style={styles.subtitle}>Additional information</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
});

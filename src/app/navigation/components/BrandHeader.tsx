import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../core/theme/tokens";

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper} accessibilityElementsHidden>
        <View style={styles.iconBackCard} />
        <View style={styles.iconFrontCard} />
      </View>
      <Text style={styles.title}>BANCO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrapper: {
    width: 18,
    height: 14,
    justifyContent: "center",
  },
  iconBackCard: {
    position: "absolute",
    width: 12,
    height: 8,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    borderRadius: radius.sm,
    left: 0,
    top: 2,
  },
  iconFrontCard: {
    position: "absolute",
    width: 12,
    height: 8,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    borderRadius: radius.sm,
    left: 4,
    top: 0,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

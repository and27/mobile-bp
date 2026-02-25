import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../../../../core/theme/tokens";
import SkeletonBlock from "./SkeletonBlock";

export default function ProductFormSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea} testID="product-form-skeleton">
      <View style={styles.container}>
        <SkeletonBlock height={30} width="50%" style={styles.title} />

        <View style={styles.fields}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.fieldGroup}>
              <SkeletonBlock height={12} width="30%" />
              <SkeletonBlock height={44} />
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <SkeletonBlock height={44} borderRadius={radius.md} />
          <SkeletonBlock height={44} borderRadius={radius.md} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  container: {
    flex: 1,
  },
  title: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  fields: {
    gap: spacing.md,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});

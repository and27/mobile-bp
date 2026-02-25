import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import {
  colors,
  radius,
  spacing,
  sizes,
} from "../../../../../core/theme/tokens";
import SkeletonBlock from "./SkeletonBlock";

export default function ProductDetailSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea} testID="product-detail-skeleton">
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <SkeletonBlock height={28} width="45%" />
            <SkeletonBlock
              height={14}
              width="35%"
              style={styles.headerSubtitle}
            />
          </View>

          <View style={styles.infoCard}>
            {Array.from({ length: 2 }).map((_, index) => (
              <View key={index} style={styles.infoRow}>
                <SkeletonBlock height={14} width="30%" />
                <SkeletonBlock height={14} width="50%" />
              </View>
            ))}

            <SkeletonBlock height={14} width="20%" />
            <View style={styles.logoContainer}>
              <SkeletonBlock
                width={sizes.logo}
                height={sizes.logo}
                borderRadius={radius.md}
              />
            </View>

            {Array.from({ length: 2 }).map((_, index) => (
              <View key={`date-${index}`} style={styles.infoRow}>
                <SkeletonBlock height={14} width="35%" />
                <SkeletonBlock height={14} width="35%" />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.btnContainer}>
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
    justifyContent: "space-between",
  },
  content: {
    gap: spacing.xl,
  },
  header: {
    marginTop: spacing.md,
  },
  headerSubtitle: {
    marginTop: spacing.xs,
  },
  infoCard: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
  },
  btnContainer: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});

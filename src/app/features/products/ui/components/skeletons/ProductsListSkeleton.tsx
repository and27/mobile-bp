import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../../../../core/theme/tokens";
import SkeletonBlock from "./SkeletonBlock";

export default function ProductsListSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea} testID="products-list-skeleton">
      <View style={styles.container}>
        <SkeletonBlock height={44} style={styles.search} />
        <SkeletonBlock height={16} width="30%" style={styles.counter} />

        <View style={styles.listContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.rowText}>
                <SkeletonBlock height={16} width="50%" />
                <SkeletonBlock height={12} width="30%" />
              </View>
              <SkeletonBlock height={12} width={12} />
            </View>
          ))}
        </View>

        <SkeletonBlock height={44} width={180} style={styles.addBtn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  search: {
    marginTop: spacing.md,
  },
  counter: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  listContainer: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
  },
  row: {
    minHeight: 68,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  rowText: {
    flex: 1,
    gap: spacing.sm,
  },
  addBtn: {
    marginVertical: spacing.md,
    alignSelf: "center",
    borderRadius: radius.sm,
  },
});

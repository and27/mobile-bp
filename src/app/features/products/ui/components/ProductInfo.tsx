import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Product } from "../../domain/entities/Product";
import {
  colors,
  sizes,
  spacing,
  typography,
} from "../../../../core/theme/tokens";

interface ProductInfoProps {
  product: Product;
}
interface ProductInfoItemProps {
  title: string;
  value: string;
}

function ProductInfoItem({ title, value }: ProductInfoItemProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const logoUri = encodeURI((product.logo ?? "").trim());

  return (
    <View style={styles.container}>
      <ProductInfoItem title="Name" value={product.name} />
      <ProductInfoItem title="Description" value={product.description} />
      <View style={styles.row}>
        <Text style={styles.title}>Logo</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logoUri }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ProductInfoItem title="Release date" value={product.dateRelease} />
      <ProductInfoItem title="Revision date" value={product.dateRevision} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  value: {
    flexShrink: 1,
    textAlign: "right",
    fontWeight: "bold",
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  logoContainer: { alignItems: "center" },
  logo: {
    width: sizes.logo,
    height: sizes.logo,
  },
});

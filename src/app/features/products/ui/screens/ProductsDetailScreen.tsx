import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ProductHeader from "../components/ProductHeader";
import ProductInfo from "../components/ProductInfo";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { getProductsUseCase } from "../../domain/usecases/GetProductsUseCase";
import { productsRepositoryImpl } from "../../data/products.repository";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";
import { colors, radius, spacing } from "../../../../core/theme/tokens";
import { SafeAreaView } from "react-native-safe-area-context";

type DetailRoute = RouteProp<RootStackParamList, "ProductsDetail">;
type DetailNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsDetail"
>;

export default function ProductsDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNavigation>();
  const { productId } = route.params;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsUseCase(productsRepositoryImpl),
  });

  const handleEdit = () => {
    navigation.navigate("ProductsForm", { isEdit: true, productId });
  };

  if (isLoading)
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>Loading product...</Text>
      </View>
    );
  if (isError)
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>{mapErrorToMessage(error)}</Text>
      </View>
    );

  const product = (data ?? []).find((p) => p.id === productId);

  if (!product)
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>Product not found.</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ProductHeader id={productId} />
          <ProductInfo product={product} />
        </View>
        <View style={styles.btnContainer}>
          <Pressable style={styles.editBtn} onPress={handleEdit}>
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </Pressable>
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
    backgroundColor: colors.surface,
    justifyContent: "space-between",
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  content: {
    gap: spacing.xl,
  },
  btnContainer: {
    gap: spacing.sm,
    width: "100%",
  },
  stateText: {
    color: colors.textSecondary,
  },
  editBtn: {
    width: "100%",
    alignItems: "center",
    borderRadius: radius.md,
    backgroundColor: colors.actionSecondary,
    padding: spacing.md,
  },
  deleteBtn: {
    width: "100%",
    alignItems: "center",
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    padding: spacing.md,
  },
  editBtnText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  deleteBtnText: {
    color: colors.onDanger,
    fontWeight: "bold",
  },
});

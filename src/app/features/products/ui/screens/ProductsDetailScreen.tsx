import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ProductHeader from "../components/ProductHeader";
import ProductInfo from "../components/ProductInfo";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductsUseCase } from "../../domain/usecases/GetProductsUseCase";
import { productsRepositoryImpl } from "../../data/products.repository";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";
import { colors, radius, spacing } from "../../../../core/theme/tokens";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkeleton";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

type DetailRoute = RouteProp<RootStackParamList, "ProductsDetail">;
type DetailNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsDetail"
>;

export default function ProductsDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNavigation>();
  const queryClient = useQueryClient();
  const { productId } = route.params;
  const [visible, setVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsUseCase(productsRepositoryImpl),
  });

  const handleEdit = () => {
    navigation.navigate("ProductsForm", { isEdit: true, productId });
  };

  const handleDelete = () => {
    setDeleteError(null);
    setVisible(true);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setDeleteError(null);
    setVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await productsRepositoryImpl.deleteProduct(productId);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "ProductsList" }],
      });
    } catch (deleteException) {
      setDeleteError(mapErrorToMessage(deleteException));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;
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
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </Pressable>
        </View>
      </View>
      <ConfirmDeleteModal
        visible={visible}
        productName={product.name}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        errorMessage={deleteError}
      />
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

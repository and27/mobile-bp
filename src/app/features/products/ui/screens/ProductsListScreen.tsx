import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsUseCase } from "../../domain/usecases/GetProductsUseCase";
import { productsRepositoryImpl } from "../../data/products.repository";
import { useQuery } from "@tanstack/react-query";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";
import ProductListItem from "../components/ProductListItem";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { colors, radius, spacing } from "../../../../core/theme/tokens";
import ProductsSearch from "../components/ProductsSearch";
import ProductsCounter from "../components/ProductsCounter";
import ProductsListSkeleton from "../components/skeletons/ProductsListSkeleton";
import { Product } from "../../domain/entities/Product";

type ProductsListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsList"
>;

export default function ProductsListScreen() {
  const navigation = useNavigation<ProductsListNavProp>();
  const [query, setQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const normalizedQuery = debouncedValue.trim().toLowerCase();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsUseCase(productsRepositoryImpl),
  });

  const handleAddModal = useCallback(() => {
    navigation.navigate("ProductsForm", { isEdit: false });
  }, [navigation]);

  const handleOpenDetail = useCallback(
    (productId: string) => {
      navigation.navigate("ProductsDetail", { productId });
    },
    [navigation],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductListItem item={item} onPress={() => handleOpenDetail(item.id)} />
    ),
    [handleOpenDetail],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const products = useMemo(
    () =>
      data?.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.id.toLowerCase().includes(normalizedQuery),
      ) ?? [],
    [data, normalizedQuery],
  );

  if (isLoading) return <ProductsListSkeleton />;
  if (isError) return <Text>{mapErrorToMessage(error)}</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProductsSearch value={query} onChangeText={setQuery} />
        <ProductsCounter count={products.length} />
        {products.length === 0 ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>
              {normalizedQuery
                ? `No results for "${debouncedValue.trim()}".`
                : `No products found.`}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={7}
              removeClippedSubviews
            />
          </View>
        )}
        <Pressable onPress={handleAddModal} style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
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
    width: "100%",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  listContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  listContent: {
    paddingBottom: 96,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  stateText: {
    color: colors.textSecondary,
  },
  addBtn: {
    backgroundColor: colors.actionPrimary,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginVertical: spacing.md,
    minWidth: 180,
    alignItems: "center",
  },
  addBtnText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
});

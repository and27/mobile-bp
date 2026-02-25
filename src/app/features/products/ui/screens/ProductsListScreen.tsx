import React, { useEffect, useState } from "react";
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

  const handleAddModal = () => {
    navigation.navigate("ProductsForm", { isEdit: false });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (isLoading) return <ProductsListSkeleton />;
  if (isError) return <Text>{mapErrorToMessage(error)}</Text>;

  const products =
    data?.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.id.toLowerCase().includes(normalizedQuery),
    ) ?? [];

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
              renderItem={({ item }) => (
                <ProductListItem
                  item={item}
                  onPress={() =>
                    navigation.navigate("ProductsDetail", {
                      productId: item.id,
                    })
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
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

import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getProductsUseCase } from "../../domain/usecases/GetProductsUseCase";
import { productsRepositoryImpl } from "../../data/products.repository";
import { useQuery } from "@tanstack/react-query";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";
import ProductListItem from "../components/ProductListItem";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { colors, radius, spacing } from "../../../../core/theme/tokens";

type ProductsListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsList"
>;

export default function ProductsListScreen() {
  const navigation = useNavigation<ProductsListNavProp>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsUseCase(productsRepositoryImpl),
  });
  if (isLoading) return <Text>Loading </Text>;
  if (isError) return <Text>{mapErrorToMessage(error)}</Text>;
  const products = data ?? [];

  if (products.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>No products found.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ProductListItem
              item={item}
              onPress={() =>
                navigation.navigate("ProductsDetail", { productId: item.id })
              }
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  listContainer: {
    overflow: "hidden",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
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
});

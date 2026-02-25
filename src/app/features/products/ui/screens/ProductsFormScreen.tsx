import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { RootStackParamList } from "../../../../navigation/types";
import { colors, spacing } from "../../../../core/theme/tokens";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";
import ProductFormView from "../components/ProductFormView";
import {
  PRODUCT_FORM_DEFAULT_VALUES,
  useProductForm,
} from "../hooks/useProductForm";
import { useEditProductPrefill } from "../hooks/useEditProductPrefill";

type ProductsFormRoute = RouteProp<RootStackParamList, "ProductsForm">;
type ProductsFormNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsForm"
>;

export default function ProductsFormScreen() {
  const route = useRoute<ProductsFormRoute>();
  const navigation = useNavigation<ProductsFormNavigation>();
  const queryClient = useQueryClient();
  const { isEdit, productId } = route.params;

  const handleSubmitSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    navigation.navigate("ProductsList");
  }, [navigation, queryClient]);

  const {
    control,
    reset,
    handleSubmit,
    onSubmit,
    onReset,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useProductForm({
    isEdit,
    productId,
    onSubmitSuccess: handleSubmitSuccess,
  });

  const {
    isLoadingProducts,
    isProductsError,
    productsError,
    isProductNotFound,
    prefillValues,
  } = useEditProductPrefill({
    isEdit,
    productId,
    reset,
  });

  if (isEdit && isLoadingProducts) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isEdit && isProductsError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            {mapErrorToMessage(productsError)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isEdit && isProductNotFound) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProductFormView
        isEdit={isEdit}
        control={control}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
        onSubmitPress={handleSubmit(onSubmit)}
        onResetPress={() =>
          onReset(
            isEdit && prefillValues
              ? prefillValues
              : PRODUCT_FORM_DEFAULT_VALUES,
          )
        }
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
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  stateText: {
    color: colors.textSecondary,
  },
});

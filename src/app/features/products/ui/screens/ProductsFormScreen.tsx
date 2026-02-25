import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../core/theme/tokens";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductFormField from "../components/ProductFormField";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  ProductFormValues,
} from "../../validation/productForm.schema";
import { productsRepositoryImpl } from "../../data/products.repository";
import { useQueryClient } from "@tanstack/react-query";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type ProductsFormRoute = RouteProp<RootStackParamList, "ProductsForm">;
type ProductsFormNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ProductsForm"
>;

const defaultValues: ProductFormValues = {
  id: "",
  name: "",
  description: "",
  logo: "",
  dateRelease: "",
  dateRevision: "",
};

export default function ProductsFormScreen() {
  const route = useRoute<ProductsFormRoute>();
  const navigation = useNavigation<ProductsFormNavigation>();
  const queryClient = useQueryClient();
  const { isEdit } = route.params;
  const {
    control,
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const dateReleaseValue = watch("dateRelease");

  useEffect(() => {
    const release = dayjs(dateReleaseValue, "YYYY-MM-DD", true);

    if (!dateReleaseValue || !release.isValid()) {
      setValue("dateRevision", "", {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
      clearErrors("dateRevision");
      return;
    }

    setValue("dateRevision", release.add(1, "year").format("YYYY-MM-DD"), {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [dateReleaseValue, setValue, clearErrors]);

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    clearErrors("id");

    try {
      const normalizedValues: ProductFormValues = {
        ...values,
        id: values.id.trim(),
        name: values.name.trim(),
        description: values.description.trim(),
        logo: values.logo.trim(),
        dateRelease: values.dateRelease.trim(),
        dateRevision: values.dateRevision.trim(),
      };

      if (!isEdit) {
        const idAlreadyExists = await productsRepositoryImpl.verifyProductId(
          normalizedValues.id,
        );
        if (idAlreadyExists) {
          setError("id", {
            type: "manual",
            message: "This product ID already exists.",
          });
          return;
        }

        await productsRepositoryImpl.createProduct(normalizedValues);
        setSubmitSuccess("Product added successfully.");
      }

      reset(defaultValues);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigation.navigate("ProductsList");
    } catch (error) {
      setSubmitError(mapErrorToMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>
        {isEdit ? "Edit Product" : "Register Form"}
      </Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fields}>
          {submitError ? (
            <Text style={styles.submitErrorText}>{submitError}</Text>
          ) : null}
          {submitSuccess ? (
            <Text style={styles.submitSuccessText}>{submitSuccess}</Text>
          ) : null}

          <Controller
            control={control}
            name="id"
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <ProductFormField
                label="ID"
                value={value}
                onChangeText={onChange}
                placeholder="Enter product ID"
                autoCapitalize="none"
                disabled={isEdit}
                onBlur={onBlur}
                error={error?.message}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="name"
            render={({
              fieldState: { error },
              field: { value, onBlur, onChange },
            }) => (
              <ProductFormField
                label="Name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter product name"
                error={error?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <ProductFormField
                label="Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter product description"
                multiline
                numberOfLines={3}
                error={error?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="logo"
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <ProductFormField
                label="Logo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter logo URL"
                autoCapitalize="none"
                error={error?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="dateRelease"
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <ProductFormField
                label="Release date"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
                error={error?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="dateRevision"
            render={({ field: { value, onBlur }, fieldState: { error } }) => (
              <ProductFormField
                label="Revision date"
                value={value}
                onChangeText={() => {}}
                onBlur={onBlur}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
                disabled
                error={error?.message}
                required
              />
            )}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.primaryBtn,
              isSubmitting ? styles.primaryBtnDisabled : null,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryBtnText}>
              {isSubmitting ? "Submitting..." : isEdit ? "Save" : "Add"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => reset(defaultValues)}
            disabled={isSubmitting}
          >
            <Text style={styles.secondaryBtnText}>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: "700",
    marginBottom: spacing.xl,
  },
  fields: {
    gap: spacing.md,
  },
  submitErrorText: {
    color: colors.danger,
    fontWeight: "600",
  },
  submitSuccessText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  primaryBtn: {
    borderRadius: radius.md,
    backgroundColor: colors.actionPrimary,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  primaryBtnText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  secondaryBtn: {
    borderRadius: radius.md,
    backgroundColor: colors.actionSecondary,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  secondaryBtnText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700",
  },
});

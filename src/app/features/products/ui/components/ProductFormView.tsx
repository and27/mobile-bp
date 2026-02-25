import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, Control } from "react-hook-form";
import ProductFormField from "./ProductFormField";
import { ProductFormValues } from "../../validation/productForm.schema";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../core/theme/tokens";

type ProductFormViewProps = {
  isEdit: boolean;
  control: Control<ProductFormValues>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: string | null;
  onSubmitPress: () => void;
  onResetPress: () => void;
};

export default function ProductFormView({
  isEdit,
  control,
  isSubmitting,
  submitError,
  submitSuccess,
  onSubmitPress,
  onResetPress,
}: ProductFormViewProps) {
  return (
    <>
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
              field: { value, onBlur, onChange },
              fieldState: { error },
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
            onPress={onSubmitPress}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryBtnText}>
              {isSubmitting ? "Submitting..." : isEdit ? "Save" : "Add"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={onResetPress}
            disabled={isSubmitting}
          >
            <Text style={styles.secondaryBtnText}>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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

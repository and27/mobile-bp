import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  productFormSchema,
  ProductFormValues,
} from "../../validation/productForm.schema";
import { productsRepositoryImpl } from "../../data/products.repository";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";

dayjs.extend(customParseFormat);

export const PRODUCT_FORM_DEFAULT_VALUES: ProductFormValues = {
  id: "",
  name: "",
  description: "",
  logo: "",
  dateRelease: "",
  dateRevision: "",
};

type UseProductFormParams = {
  isEdit: boolean;
  productId?: string;
  onSubmitSuccess: () => Promise<void> | void;
};

export function useProductForm({
  isEdit,
  productId,
  onSubmitSuccess,
}: UseProductFormParams) {
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
    defaultValues: PRODUCT_FORM_DEFAULT_VALUES,
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

      if (isEdit) {
        if (!productId) {
          setSubmitError("Missing product identifier for edit.");
          return;
        }

        await productsRepositoryImpl.updateProduct(productId, {
          name: normalizedValues.name,
          description: normalizedValues.description,
          logo: normalizedValues.logo,
          dateRelease: normalizedValues.dateRelease,
          dateRevision: normalizedValues.dateRevision,
        });
        setSubmitSuccess("Product updated successfully.");
      } else {
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
        reset(PRODUCT_FORM_DEFAULT_VALUES);
      }

      await onSubmitSuccess();
    } catch (error) {
      setSubmitError(mapErrorToMessage(error));
    }
  };

  const onReset = (values: ProductFormValues = PRODUCT_FORM_DEFAULT_VALUES) => {
    reset(values);
    setSubmitError(null);
    setSubmitSuccess(null);
    clearErrors();
  };

  return {
    control,
    reset,
    handleSubmit,
    onSubmit,
    onReset,
    isSubmitting,
    submitError,
    submitSuccess,
  };
}

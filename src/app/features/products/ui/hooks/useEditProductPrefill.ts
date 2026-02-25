import { useEffect, useMemo, useRef } from "react";
import { UseFormReset } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getProductsUseCase } from "../../domain/usecases/GetProductsUseCase";
import { productsRepositoryImpl } from "../../data/products.repository";
import { ProductFormValues } from "../../validation/productForm.schema";

type UseEditProductPrefillParams = {
  isEdit: boolean;
  productId?: string;
  reset: UseFormReset<ProductFormValues>;
};

export function useEditProductPrefill({
  isEdit,
  productId,
  reset,
}: UseEditProductPrefillParams) {
  const hasPrefilledEditValues = useRef(false);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsUseCase(productsRepositoryImpl),
    enabled: isEdit && Boolean(productId),
  });

  const productToEdit = (productsData ?? []).find(
    (product) => product.id === productId,
  );

  const prefillValues = useMemo<ProductFormValues | null>(() => {
    if (!productToEdit) return null;

    return {
      id: productToEdit.id,
      name: productToEdit.name,
      description: productToEdit.description,
      logo: productToEdit.logo,
      dateRelease: productToEdit.dateRelease,
      dateRevision: productToEdit.dateRevision,
    };
  }, [productToEdit]);

  useEffect(() => {
    hasPrefilledEditValues.current = false;
  }, [productId]);

  useEffect(() => {
    if (!isEdit || !prefillValues || hasPrefilledEditValues.current) return;
    reset(prefillValues);
    hasPrefilledEditValues.current = true;
  }, [isEdit, prefillValues, reset]);

  const isProductNotFound =
    isEdit &&
    (!productId ||
      (!isLoadingProducts &&
        !isProductsError &&
        Array.isArray(productsData) &&
        !productToEdit));

  return {
    isLoadingProducts,
    isProductsError,
    productsError,
    isProductNotFound,
    prefillValues,
  };
}

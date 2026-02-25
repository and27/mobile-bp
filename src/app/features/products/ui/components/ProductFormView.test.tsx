import {
  fireEvent,
  render,
  screen,
  renderHook,
} from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import ProductFormView from "./ProductFormView";
import { ProductFormValues } from "../../validation/productForm.schema";

const defaultValues: ProductFormValues = {
  id: "p1",
  name: "Product name",
  description: "Valid description",
  logo: "https://placehold.co/120x120.png?text=P1",
  dateRelease: "2026-01-01",
  dateRevision: "2027-01-01",
};

describe("ProductFormView", () => {
  it("renders add mode and triggers submit/reset callbacks", () => {
    const onSubmitPress = jest.fn();
    const onResetPress = jest.fn();
    const { result } = renderHook(() =>
      useForm<ProductFormValues>({ defaultValues }),
    );

    render(
      <ProductFormView
        isEdit={false}
        control={result.current.control}
        isSubmitting={false}
        submitError={null}
        submitSuccess={null}
        onSubmitPress={onSubmitPress}
        onResetPress={onResetPress}
      />,
    );

    expect(screen.getByText("Register Form")).toBeTruthy();
    expect(screen.getByText("Add")).toBeTruthy();

    fireEvent.press(screen.getByText("Add"));
    fireEvent.press(screen.getByText("Reset"));

    expect(onSubmitPress).toHaveBeenCalledTimes(1);
    expect(onResetPress).toHaveBeenCalledTimes(1);
  });

  it("renders edit mode, submitting state and messages", () => {
    const { result } = renderHook(() =>
      useForm<ProductFormValues>({ defaultValues }),
    );

    render(
      <ProductFormView
        isEdit
        control={result.current.control}
        isSubmitting
        submitError="Submit error"
        submitSuccess="Submit success"
        onSubmitPress={jest.fn()}
        onResetPress={jest.fn()}
      />,
    );

    expect(screen.getByText("Edit Product")).toBeTruthy();
    expect(screen.getByText("Submitting...")).toBeTruthy();
    expect(screen.getByText("Submit error")).toBeTruthy();
    expect(screen.getByText("Submit success")).toBeTruthy();
  });
});

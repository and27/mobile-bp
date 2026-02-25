import { fireEvent, render, screen } from "@testing-library/react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import ProductsFormScreen from "./ProductsFormScreen";
import { useProductForm } from "../hooks/useProductForm";
import { useEditProductPrefill } from "../hooks/useEditProductPrefill";

const mockNavigationReset = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnReset = jest.fn();
const mockHandleSubmit = jest.fn((fn) => fn);

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: jest.fn(),
}));

jest.mock("../hooks/useProductForm", () => ({
  PRODUCT_FORM_DEFAULT_VALUES: {
    id: "",
    name: "",
    description: "",
    logo: "",
    dateRelease: "",
    dateRevision: "",
  },
  useProductForm: jest.fn(),
}));

jest.mock("../hooks/useEditProductPrefill", () => ({
  useEditProductPrefill: jest.fn(),
}));

jest.mock("../components/ProductFormView", () => ({
  __esModule: true,
  default: ({
    onSubmitPress,
    onResetPress,
    isEdit,
  }: {
    onSubmitPress: () => void;
    onResetPress: () => void;
    isEdit: boolean;
  }) => {
    const { Pressable, Text, View } = jest.requireActual("react-native");
    return (
      <View>
        <Text>{isEdit ? "form-edit" : "form-add"}</Text>
        <Pressable onPress={onSubmitPress}>
          <Text>trigger-submit</Text>
        </Pressable>
        <Pressable onPress={onResetPress}>
          <Text>trigger-reset</Text>
        </Pressable>
      </View>
    );
  },
}));

jest.mock("../components/skeletons/ProductFormSkeleton", () => ({
  __esModule: true,
  default: () => {
    const { Text } = jest.requireActual("react-native");
    return <Text>form-skeleton</Text>;
  },
}));

jest.mock("../../../../core/errors/mapErrorToMessage", () => ({
  mapErrorToMessage: () => "Mapped error message",
}));

describe("ProductsFormScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      reset: mockNavigationReset,
    });
    (useRoute as jest.Mock).mockReturnValue({
      params: { isEdit: true, productId: "p1" },
    });
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
    (useProductForm as jest.Mock).mockReturnValue({
      control: {},
      reset: jest.fn(),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      onReset: mockOnReset,
      isSubmitting: false,
      submitError: null,
      submitSuccess: null,
    });
    (useEditProductPrefill as jest.Mock).mockReturnValue({
      isLoadingProducts: false,
      isProductsError: false,
      productsError: null,
      isProductNotFound: false,
      prefillValues: {
        id: "p1",
        name: "Product one",
        description: "Description one",
        logo: "https://placehold.co/120x120.png?text=P1",
        dateRelease: "2026-01-01",
        dateRevision: "2027-01-01",
      },
    });
  });

  it("renders skeleton while loading edit data", () => {
    (useEditProductPrefill as jest.Mock).mockReturnValue({
      isLoadingProducts: true,
      isProductsError: false,
      productsError: null,
      isProductNotFound: false,
      prefillValues: null,
    });

    render(<ProductsFormScreen />);
    expect(screen.getByText("form-skeleton")).toBeTruthy();
  });

  it("renders mapped error state", () => {
    (useEditProductPrefill as jest.Mock).mockReturnValue({
      isLoadingProducts: false,
      isProductsError: true,
      productsError: new Error("boom"),
      isProductNotFound: false,
      prefillValues: null,
    });

    render(<ProductsFormScreen />);
    expect(screen.getByText("Mapped error message")).toBeTruthy();
  });

  it("renders not found state", () => {
    (useEditProductPrefill as jest.Mock).mockReturnValue({
      isLoadingProducts: false,
      isProductsError: false,
      productsError: null,
      isProductNotFound: true,
      prefillValues: null,
    });

    render(<ProductsFormScreen />);
    expect(screen.getByText("Product not found.")).toBeTruthy();
  });

  it("renders form and forwards submit/reset handlers", () => {
    render(<ProductsFormScreen />);

    expect(screen.getByText("form-edit")).toBeTruthy();
    fireEvent.press(screen.getByText("trigger-submit"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText("trigger-reset"));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});

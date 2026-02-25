import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useProductForm } from "./useProductForm";
import { productsRepositoryImpl } from "../../data/products.repository";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";

jest.mock("../../data/products.repository", () => ({
  productsRepositoryImpl: {
    updateProduct: jest.fn(),
    verifyProductId: jest.fn(),
    createProduct: jest.fn(),
  },
}));

jest.mock("../../../../core/errors/mapErrorToMessage", () => ({
  mapErrorToMessage: jest.fn(),
}));

const validValues = {
  id: " abc123 ",
  name: " Product Name ",
  description: " Valid description for product ",
  logo: " https://placehold.co/120x120.png?text=P1 ",
  dateRelease: " 2026-01-01 ",
  dateRevision: " 2027-01-01 ",
};

describe("useProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates product in add mode and triggers success callback", async () => {
    const onSubmitSuccess = jest.fn();
    (productsRepositoryImpl.verifyProductId as jest.Mock).mockResolvedValue(
      false,
    );
    (productsRepositoryImpl.createProduct as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() =>
      useProductForm({
        isEdit: false,
        onSubmitSuccess,
      }),
    );

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(productsRepositoryImpl.verifyProductId).toHaveBeenCalledWith(
      "abc123",
    );
    expect(productsRepositoryImpl.createProduct).toHaveBeenCalledWith({
      id: "abc123",
      name: "Product Name",
      description: "Valid description for product",
      logo: "https://placehold.co/120x120.png?text=P1",
      dateRelease: "2026-01-01",
      dateRevision: "2027-01-01",
    });
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(result.current.submitSuccess).toBe("Product added successfully.");
    });
  });

  it("sets manual id error path when id already exists", async () => {
    const onSubmitSuccess = jest.fn();
    (productsRepositoryImpl.verifyProductId as jest.Mock).mockResolvedValue(
      true,
    );

    const { result } = renderHook(() =>
      useProductForm({
        isEdit: false,
        onSubmitSuccess,
      }),
    );

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(productsRepositoryImpl.createProduct).not.toHaveBeenCalled();
    expect(onSubmitSuccess).not.toHaveBeenCalled();
    expect(result.current.submitSuccess).toBeNull();
    expect(result.current.submitError).toBeNull();
  });

  it("returns missing id error in edit mode when productId is not provided", async () => {
    const onSubmitSuccess = jest.fn();

    const { result } = renderHook(() =>
      useProductForm({
        isEdit: true,
        onSubmitSuccess,
      }),
    );

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(productsRepositoryImpl.updateProduct).not.toHaveBeenCalled();
    expect(onSubmitSuccess).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe(
      "Missing product identifier for edit.",
    );
  });

  it("updates product in edit mode and triggers success callback", async () => {
    const onSubmitSuccess = jest.fn();
    (productsRepositoryImpl.updateProduct as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() =>
      useProductForm({
        isEdit: true,
        productId: "p1",
        onSubmitSuccess,
      }),
    );

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(productsRepositoryImpl.updateProduct).toHaveBeenCalledWith("p1", {
      name: "Product Name",
      description: "Valid description for product",
      logo: "https://placehold.co/120x120.png?text=P1",
      dateRelease: "2026-01-01",
      dateRevision: "2027-01-01",
    });
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.submitSuccess).toBe("Product updated successfully.");
  });

  it("maps and stores submit error when request fails", async () => {
    const onSubmitSuccess = jest.fn();
    const failure = new Error("boom");
    (productsRepositoryImpl.verifyProductId as jest.Mock).mockResolvedValue(
      false,
    );
    (productsRepositoryImpl.createProduct as jest.Mock).mockRejectedValue(
      failure,
    );
    (mapErrorToMessage as jest.Mock).mockReturnValue("Mapped submit error");

    const { result } = renderHook(() =>
      useProductForm({
        isEdit: false,
        onSubmitSuccess,
      }),
    );

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(mapErrorToMessage).toHaveBeenCalledWith(failure);
    expect(result.current.submitError).toBe("Mapped submit error");
    expect(onSubmitSuccess).not.toHaveBeenCalled();
  });
});

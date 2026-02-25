import { renderHook } from "@testing-library/react-native";
import { useQuery } from "@tanstack/react-query";
import { useEditProductPrefill } from "./useEditProductPrefill";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

describe("useEditProductPrefill", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefills values in edit mode when product exists", () => {
    const reset = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "Product One",
          description: "Description",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateRelease: "2026-01-01",
          dateRevision: "2027-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() =>
      useEditProductPrefill({
        isEdit: true,
        productId: "p1",
        reset,
      }),
    );

    expect(result.current.prefillValues).toEqual({
      id: "p1",
      name: "Product One",
      description: "Description",
      logo: "https://placehold.co/120x120.png?text=P1",
      dateRelease: "2026-01-01",
      dateRevision: "2027-01-01",
    });
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("does not prefill twice for same product on rerender", () => {
    const reset = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "Product One",
          description: "Description",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateRelease: "2026-01-01",
          dateRevision: "2027-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    const { rerender } = renderHook(
      ({ productId }: { productId: string }) =>
        useEditProductPrefill({
          isEdit: true,
          productId,
          reset,
        }),
      { initialProps: { productId: "p1" } },
    );

    rerender({ productId: "p1" });
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("marks not found when edit is enabled and product is missing", () => {
    const reset = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() =>
      useEditProductPrefill({
        isEdit: true,
        productId: "missing",
        reset,
      }),
    );

    expect(result.current.isProductNotFound).toBe(true);
  });

  it("disables query when edit mode is off", () => {
    const reset = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderHook(() =>
      useEditProductPrefill({
        isEdit: false,
        productId: undefined,
        reset,
      }),
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});

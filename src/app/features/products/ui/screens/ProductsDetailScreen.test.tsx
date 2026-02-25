import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import ProductsDetailScreen from "./ProductsDetailScreen";
import { productsRepositoryImpl } from "../../data/products.repository";
import { mapErrorToMessage } from "../../../../core/errors/mapErrorToMessage";

const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockInvalidateQueries = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: jest.fn(),
  useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
}));

jest.mock("../../data/products.repository", () => ({
  productsRepositoryImpl: {
    deleteProduct: jest.fn(),
  },
}));

jest.mock("../components/ProductHeader", () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => {
    const { Text } = jest.requireActual("react-native");
    return <Text>{`header-${id}`}</Text>;
  },
}));

jest.mock("../components/ProductInfo", () => ({
  __esModule: true,
  default: ({ product }: { product: { name: string } }) => {
    const { Text } = jest.requireActual("react-native");
    return <Text>{`product-info-${product.name}`}</Text>;
  },
}));

jest.mock("../../../../core/errors/mapErrorToMessage", () => ({
  mapErrorToMessage: jest.fn(() => "Mapped detail error"),
}));

describe("ProductsDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: { productId: "p1" },
    });
  });

  it("renders loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      iserror: false,
      error: null,
    });

    render(<ProductsDetailScreen />);
    expect(screen.getByTestId("product-detail-skeleton")).toBeTruthy();
  });

  it("renders error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("test error"),
    });

    render(<ProductsDetailScreen />);
    expect(screen.getByText("Mapped detail error"));
  });

  it("renders not found state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ProductsDetailScreen />);
    expect(screen.getByText("Product not found."));
  });

  it("renders product details when found", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "ProductOne",
          description: "Description One",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateReelase: "2026-01-02",
          dateRevision: "2027-01-02",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ProductsDetailScreen />);
    expect(screen.getByText("header-p1")).toBeTruthy();
    expect(screen.getByText("product-info-ProductOne")).toBeTruthy();
    expect(screen.getByText("Edit")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("navigates to edit form on edit press", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "ProductOne",
          description: "Description One",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateReelase: "2026-01-02",
          dateRevision: "2027-01-02",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProductsDetailScreen />);
    fireEvent.press(screen.getByText("Edit"));

    expect(mockNavigate).toHaveBeenCalledWith("ProductsForm", {
      isEdit: true,
      productId: "p1",
    });
  });

  it("opens and closes delete modal", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "ProductOne",
          description: "Description One",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateReelase: "2026-01-02",
          dateRevision: "2027-01-02",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProductsDetailScreen />);
    fireEvent.press(screen.getByText("Delete"));

    expect(
      screen.getByText('Are you sure you want to delete product "ProductOne"?'),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Cancel"));
    expect(
      screen.queryByText(
        'Are you sure you want to delete product "ProductOne"?',
      ),
    ).toBeNull();
  });

  it("deletes product on confirm and resets stack to list", async () => {
    (productsRepositoryImpl.deleteProduct as jest.Mock).mockResolvedValue(
      undefined,
    );
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "ProductOne",
          description: "Description One",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateReelase: "2026-01-02",
          dateRevision: "2027-01-02",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProductsDetailScreen />);
    fireEvent.press(screen.getByText("Delete"));
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(productsRepositoryImpl.deleteProduct).toHaveBeenCalledWith("p1");
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ["products"],
      });
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "ProductsList" }],
      });
    });
  });

  it("shows mapped error message when delete fails", async () => {
    (productsRepositoryImpl.deleteProduct as jest.Mock).mockRejectedValue(
      new Error("delete failed"),
    );
    (mapErrorToMessage as jest.Mock).mockReturnValue("Delete request failed");
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "ProductOne",
          description: "Description One",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateReelase: "2026-01-02",
          dateRevision: "2027-01-02",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProductsDetailScreen />);
    fireEvent.press(screen.getByText("Delete"));
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Delete request failed")).toBeTruthy();
    });
  });
});

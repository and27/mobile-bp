import { fireEvent, render, screen } from "@testing-library/react-native";
import { useQuery } from "@tanstack/react-query";
import ProductsListScreen from "./ProductsListScreen";

const mockNavigate = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("../../../../core/errors/mapErrorToMessage", () => ({
  mapErrorToMessage: () => "Mapped error message",
}));

describe("ProductsListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<ProductsListScreen />);
    expect(screen.getByText("Loading ")).toBeTruthy();
  });

  it("renders error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("test"),
    });

    render(<ProductsListScreen />);
    expect(screen.getByText("Mapped error message")).toBeTruthy();
  });

  it("renders empty state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ProductsListScreen />);
    expect(screen.getByText("No products found.")).toBeTruthy();
  });

  it("navigates to detail on item press", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "Product One",
          description: "Description One",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateRelease: "2026-01-01",
          dateRevision: "2027-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ProductsListScreen />);
    fireEvent.press(screen.getByText("Product One"));
    expect(mockNavigate).toHaveBeenCalledWith("ProductsDetail", {
      productId: "p1",
    });
  });
});

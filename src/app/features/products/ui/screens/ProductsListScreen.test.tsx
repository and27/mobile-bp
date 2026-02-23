import { act, fireEvent, render, screen } from "@testing-library/react-native";
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

  it("filters by name after debounce", () => {
    jest.useFakeTimers();
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "Card",
          description: "Card description",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateRelease: "2026-01-01",
          dateRevision: "2026-01-01",
        },
        {
          id: "p2",
          name: "Second product",
          description: "Second description",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateRelease: "2026-01-01",
          dateRevision: "2026-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ProductsListScreen />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.changeText(input, "card");

    expect(screen.getByText("Card")).toBeTruthy();
    expect(screen.getByText("Second product")).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText("Card")).toBeTruthy();
    expect(screen.queryByText("Second product")).toBeNull();

    jest.useRealTimers();
  });

  it("shows no results message when query has no matches", () => {
    jest.useFakeTimers();
    (useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "p1",
          name: "Card",
          description: "Card description",
          logo: "https://placehold.co/120x120.png?text=P1",
          dateRelease: "2026-01-01",
          dateRevision: "2026-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<ProductsListScreen />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.changeText(input, "other");
    expect(screen.getByText("Card")).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText(`No results for "other".`));
    jest.useRealTimers();
  });
});

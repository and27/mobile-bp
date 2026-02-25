import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
  verifyProductIdApi,
} from "./products.api";
import { httpClient } from "../../../core/api/httpClient";

jest.mock("../../../core/api/httpClient", () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("products.api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets products list", async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({
      data: {
        data: [{ id: "p1" }],
      },
    });

    const result = await getProductsApi();

    expect(httpClient.get).toHaveBeenCalledWith("/bp/products");
    expect(result).toEqual([{ id: "p1" }]);
  });

  it("creates a product", async () => {
    const payload = {
      id: "p1",
      name: "Product one",
      description: "Description one",
      logo: "https://placehold.co/120x120.png?text=P1",
      date_release: "2026-01-01",
      date_revision: "2027-01-01",
    };
    (httpClient.post as jest.Mock).mockResolvedValue({
      data: {
        message: "Product added successfully",
        data: payload,
      },
    });

    const result = await createProductApi(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/bp/products", payload);
    expect(result).toEqual(payload);
  });

  it("updates a product", async () => {
    const payload = {
      name: "Updated",
      description: "Updated description",
      logo: "https://placehold.co/120x120.png?text=P1",
      date_release: "2026-01-01",
      date_revision: "2027-01-01",
    };
    (httpClient.put as jest.Mock).mockResolvedValue({
      data: {
        message: "Product updated successfully",
        data: payload,
      },
    });

    const result = await updateProductApi("p1", payload);

    expect(httpClient.put).toHaveBeenCalledWith("/bp/products/p1", payload);
    expect(result).toEqual(payload);
  });

  it("deletes a product", async () => {
    (httpClient.delete as jest.Mock).mockResolvedValue({ data: {} });

    await deleteProductApi("p1");

    expect(httpClient.delete).toHaveBeenCalledWith("/bp/products/p1");
  });

  it("verifies product id", async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ data: true });

    const result = await verifyProductIdApi("p1");

    expect(httpClient.get).toHaveBeenCalledWith("/bp/products/verification/p1");
    expect(result).toBe(true);
  });
});

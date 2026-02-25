import { productsRepositoryImpl } from "./products.repository";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
  verifyProductIdApi,
} from "./products.api";
import { toDomainProduct, toProductDto } from "./product.mapper";

jest.mock("./products.api", () => ({
  getProductsApi: jest.fn(),
  createProductApi: jest.fn(),
  updateProductApi: jest.fn(),
  deleteProductApi: jest.fn(),
  verifyProductIdApi: jest.fn(),
}));

jest.mock("./product.mapper", () => ({
  toDomainProduct: jest.fn(),
  toProductDto: jest.fn(),
}));

describe("products.repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps and returns products list", async () => {
    (getProductsApi as jest.Mock).mockResolvedValue([
      { id: "p1" },
      { id: "p2" },
    ]);
    (toDomainProduct as jest.Mock)
      .mockReturnValueOnce({ id: "d1" })
      .mockReturnValueOnce({ id: "d2" });

    const result = await productsRepositoryImpl.getProducts();

    expect(getProductsApi).toHaveBeenCalledTimes(1);
    expect(toDomainProduct).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ id: "d1" }, { id: "d2" }]);
  });

  it("creates a product using dto mapper", async () => {
    const input = {
      id: "p1",
      name: "Product one",
      description: "Description one",
      logo: "https://placehold.co/120x120.png?text=P1",
      dateRelease: "2026-01-01",
      dateRevision: "2027-01-01",
    };
    const dto = {
      id: "p1",
      name: "Product one",
      description: "Description one",
      logo: "https://placehold.co/120x120.png?text=P1",
      date_release: "2026-01-01",
      date_revision: "2027-01-01",
    };
    (toProductDto as jest.Mock).mockReturnValue(dto);
    (createProductApi as jest.Mock).mockResolvedValue(dto);
    (toDomainProduct as jest.Mock).mockReturnValue(input);

    const result = await productsRepositoryImpl.createProduct(input);

    expect(toProductDto).toHaveBeenCalledWith(input);
    expect(createProductApi).toHaveBeenCalledWith(dto);
    expect(toDomainProduct).toHaveBeenCalledWith(dto);
    expect(result).toEqual(input);
  });

  it("updates a product with mapped payload", async () => {
    const input = {
      name: "Updated",
      description: "Updated description",
      logo: "https://placehold.co/120x120.png?text=P1",
      dateRelease: "2026-01-01",
      dateRevision: "2027-01-01",
    };
    const apiResponse = {
      name: input.name,
      description: input.description,
      logo: input.logo,
      date_release: input.dateRelease,
      date_revision: input.dateRevision,
    };
    (updateProductApi as jest.Mock).mockResolvedValue(apiResponse);
    (toDomainProduct as jest.Mock).mockReturnValue({
      id: "p1",
      ...input,
    });

    const result = await productsRepositoryImpl.updateProduct("p1", input);

    expect(updateProductApi).toHaveBeenCalledWith("p1", {
      name: input.name,
      description: input.description,
      logo: input.logo,
      date_release: input.dateRelease,
      date_revision: input.dateRevision,
    });
    expect(toDomainProduct).toHaveBeenCalledWith({ ...apiResponse, id: "p1" });
    expect(result).toEqual({ id: "p1", ...input });
  });

  it("deletes a product", async () => {
    (deleteProductApi as jest.Mock).mockResolvedValue(undefined);

    await productsRepositoryImpl.deleteProduct("p1");

    expect(deleteProductApi).toHaveBeenCalledWith("p1");
  });

  it("verifies product id", async () => {
    (verifyProductIdApi as jest.Mock).mockResolvedValue(true);

    const result = await productsRepositoryImpl.verifyProductId("p1");

    expect(verifyProductIdApi).toHaveBeenCalledWith("p1");
    expect(result).toBe(true);
  });
});

import { ProductsRepository } from "../contracts/ProductsRepository";
import { Product } from "../entities/Product";
import { getProductsUseCase } from "./GetProductsUseCase";

describe("getProductsUseCase", () => {
  it("returns products from repository", async () => {
    const products: Product[] = [
      {
        id: "abc",
        name: "Credit Card",
        description: "Credit card product",
        logo: "logo.png",
        dateRelease: "2026-02-01",
        dateRevision: "2027-02-01",
      },
    ];

    const respository: ProductsRepository = {
      getProducts: jest.fn().mockResolvedValue(products),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      verifyProductId: jest.fn(),
    };

    const result = await getProductsUseCase(respository);
    expect(respository.getProducts).toHaveBeenCalledTimes(1);
    expect(result).toEqual(products);
  });
});

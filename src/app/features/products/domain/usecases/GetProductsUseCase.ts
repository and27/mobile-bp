import { ProductsRepository } from "../contracts/ProductsRepository";

export const getProductsUseCase = (repository: ProductsRepository) => {
  return repository.getProducts();
};

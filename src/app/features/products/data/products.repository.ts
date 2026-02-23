import {
  ProductsRepository,
  CreateProductInput,
  UpdateProductInput,
} from "../domain/contracts/ProductsRepository";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  verifyProductIdApi,
} from "./products.api";
import { toDomainProduct, toProductDto } from "./product.mapper";
import { Product } from "../domain/entities/Product";

export const productsRepositoryImpl: ProductsRepository = {
  async getProducts(): Promise<Product[]> {
    const data = await getProductsApi();
    return data.map(toDomainProduct);
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const dto = toProductDto(input);
    const data = await createProductApi(dto);
    return toDomainProduct(data);
  },
  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const payload = {
      name: input.name,
      description: input.description,
      logo: input.logo,
      date_release: input.dateRelease,
      date_revision: input.dateRevision,
    };
    const data = await updateProductApi(id, payload);
    return toDomainProduct({ ...data, id });
  },
  async deleteProduct(id: string): Promise<void> {
    await deleteProductApi(id);
  },
  async verifyProductId(id: string): Promise<boolean> {
    return verifyProductIdApi(id);
  },
};

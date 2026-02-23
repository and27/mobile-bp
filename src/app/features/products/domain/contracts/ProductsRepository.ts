import { Product } from "../entities/Product";

export type CreateProductInput = Product;
export type UpdateProductInput = Omit<Product, "id">;

export interface ProductsRepository {
  getProducts(): Promise<Product[]>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  verifyProductId(id: string): Promise<boolean>;
}

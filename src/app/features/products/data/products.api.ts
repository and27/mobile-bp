import { httpClient } from "../../../core/api/httpClient";
import {
  CreateProductResponseDto,
  ProductDto,
  ProductsResponseDto,
  UpdateProductResponseDto,
} from "./product.dto";

const PRODUCTS_PATH = "/bp/products";
export async function getProductsApi(): Promise<ProductDto[]> {
  const { data } = await httpClient.get<ProductsResponseDto>(PRODUCTS_PATH);
  return data.data;
}

export async function createProductApi(
  payload: ProductDto,
): Promise<ProductDto> {
  const { data } = await httpClient.post<CreateProductResponseDto>(
    PRODUCTS_PATH,
    payload,
  );
  return data.data;
}

export async function updateProductApi(
  id: string,
  payload: Omit<ProductDto, "id">,
): Promise<ProductDto> {
  const { data } = await httpClient.put<UpdateProductResponseDto>(
    `${PRODUCTS_PATH}/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteProductApi(id: string): Promise<void> {
  await httpClient.delete(`${PRODUCTS_PATH}/${id}`);
}

export async function verifyProductIdApi(id: string): Promise<boolean> {
  const { data } = await httpClient.get<boolean>(
    `${PRODUCTS_PATH}/verification/${id}`,
  );
  return data;
}

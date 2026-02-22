export type ProductDto = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

export type ProductsResponseDto = {
  data: ProductDto[];
};

export type CreateProductResponseDto = {
  message: string;
  data: ProductDto;
};

export type UpdateProductResponseDto = {
  message: string;
  data: ProductDto;
};

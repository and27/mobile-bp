import { Product } from "../domain/entities/Product";
import { ProductDto } from "./product.dto";

export function toDomainProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    logo: dto.logo,
    dateRelease: dto.date_release,
    dateRevision: dto.date_revision,
  };
}

export function toProductDto(product: Product): ProductDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    logo: product.logo,
    date_release: product.dateRelease,
    date_revision: product.dateRevision,
  };
}

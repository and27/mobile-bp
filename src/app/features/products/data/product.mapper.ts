import { Product } from "../domain/entities/Product";
import { ProductDto } from "./product.dto";
import dayjs from "dayjs";

function normalizeDate(value: string): string {
  const raw = value?.trim?.() ?? "";
  if (!raw) return "";

  const datePrefixMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (datePrefixMatch) {
    return datePrefixMatch[1];
  }

  const parsed = dayjs(raw);
  if (parsed.isValid()) {
    return parsed.format("YYYY-MM-DD");
  }

  return raw;
}

export function toDomainProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    logo: dto.logo,
    dateRelease: normalizeDate(dto.date_release),
    dateRevision: normalizeDate(dto.date_revision),
  };
}

export function toProductDto(product: Product): ProductDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    logo: product.logo,
    date_release: normalizeDate(product.dateRelease),
    date_revision: normalizeDate(product.dateRevision),
  };
}

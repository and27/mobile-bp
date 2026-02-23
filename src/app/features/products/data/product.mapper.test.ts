import { toDomainProduct, toProductDto } from "./product.mapper";

describe("product.mapper", () => {
  it("maps dto to domain", () => {
    const dto = {
      id: "p1",
      name: "Product One",
      description: "Description",
      logo: "https://placehold.co/120x120.png?text=P1",
      date_release: "2026-01-01",
      date_revision: "2027-01-01",
    };

    const domain = toDomainProduct(dto);

    expect(domain).toEqual({
      id: "p1",
      name: "Product One",
      description: "Description",
      logo: "https://placehold.co/120x120.png?text=P1",
      dateRelease: "2026-01-01",
      dateRevision: "2027-01-01",
    });
  });

  it("maps domain to dto", () => {
    const domain = {
      id: "p2",
      name: "Product Two",
      description: "Description 2",
      logo: "https://placehold.co/120x120.png?text=P2",
      dateRelease: "2026-02-01",
      dateRevision: "2027-02-01",
    };

    const dto = toProductDto(domain);

    expect(dto).toEqual({
      id: "p2",
      name: "Product Two",
      description: "Description 2",
      logo: "https://placehold.co/120x120.png?text=P2",
      date_release: "2026-02-01",
      date_revision: "2027-02-01",
    });
  });
});

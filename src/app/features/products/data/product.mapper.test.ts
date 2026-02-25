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

  it("normalizes ISO dates when mapping dto to domain", () => {
    const dto = {
      id: "p3",
      name: "Product Three",
      description: "Description 3",
      logo: "https://placehold.co/120x120.png?text=P3",
      date_release: "2026-03-01T00:00:00.000Z",
      date_revision: "2027-03-01T00:00:00.000Z",
    };

    const domain = toDomainProduct(dto);

    expect(domain.dateRelease).toBe("2026-03-01");
    expect(domain.dateRevision).toBe("2027-03-01");
  });

  it("normalizes ISO dates when mapping domain to dto", () => {
    const domain = {
      id: "p4",
      name: "Product Four",
      description: "Description 4",
      logo: "https://placehold.co/120x120.png?text=P4",
      dateRelease: "2026-04-01T14:22:10.000Z",
      dateRevision: "2027-04-01T14:22:10.000Z",
    };

    const dto = toProductDto(domain);

    expect(dto.date_release).toBe("2026-04-01");
    expect(dto.date_revision).toBe("2027-04-01");
  });
});

import dayjs from "dayjs";
import { productFormSchema, ProductFormValues } from "./productForm.schema";

function buildValidValues(): ProductFormValues {
  const release = dayjs().add(1, "day").format("YYYY-MM-DD");
  return {
    id: "abc123",
    name: "Product Name",
    description: "Valid product description",
    logo: "https://placehold.co/120x120.png?text=P1",
    dateRelease: release,
    dateRevision: dayjs(release).add(1, "year").format("YYYY-MM-DD"),
  };
}

describe("productForm.schema", () => {
  it("accepts valid input", () => {
    const values = buildValidValues();

    const result = productFormSchema.safeParse(values);

    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const values = {
      ...buildValidValues(),
      id: "",
      name: "",
      description: "",
      logo: "",
      dateRelease: "",
      dateRevision: "",
    };

    const result = productFormSchema.safeParse(values);

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain("ID is required");
      expect(messages).toContain("Name is required");
      expect(messages).toContain("Description is required");
      expect(messages).toContain("Logo is required");
      expect(messages).toContain("Release date is required");
      expect(messages).toContain("Revision date is required");
    }
  });

  it("rejects release date before today", () => {
    const release = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const values = {
      ...buildValidValues(),
      dateRelease: release,
      dateRevision: dayjs(release).add(1, "year").format("YYYY-MM-DD"),
    };

    const result = productFormSchema.safeParse(values);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === "Release date must be today or later.",
        ),
      ).toBe(true);
    }
  });

  it("rejects revision date not exactly one year after release date", () => {
    const release = dayjs().add(1, "day").format("YYYY-MM-DD");
    const values = {
      ...buildValidValues(),
      dateRelease: release,
      dateRevision: dayjs(release).add(2, "year").format("YYYY-MM-DD"),
    };

    const result = productFormSchema.safeParse(values);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.message ===
            "Revision date must be exactly one year after release date.",
        ),
      ).toBe(true);
    }
  });
});

import * as z from "zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const productFormSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, "ID is required")
      .min(3, "ID must be at least 3 characters")
      .max(10, "ID must be at most 10 characters"),
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(6, "Name must be at least 6 characters")
      .max(100, "Name must be at most 100 characters"),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description must be at most 200 characters"),
    logo: z
      .string()
      .trim()
      .min(1, "Logo is required")
      .url("Logo must be a valid URL"),
    dateRelease: z
      .string()
      .trim()
      .min(1, "Release date is required")
      .regex(dateRegex, "Release date must be YYYY-MM-DD"),
    dateRevision: z
      .string()
      .trim()
      .min(1, "Revision date is required")
      .regex(dateRegex, "Revision date must be YYYY-MM-DD"),
  })
  .superRefine((values, ctx) => {
    const release = dayjs(values.dateRelease, "YYYY-MM-DD", true);
    const revision = dayjs(values.dateRevision, "YYYY-MM-DD", true);
    const today = dayjs().startOf("day");

    if (!release.isValid()) return;
    if (!revision.isValid()) return;

    if (release.isBefore(today)) {
      ctx.addIssue({
        code: "custom",
        path: ["dateRelease"],
        message: "Release date must be today or later.",
      });
    }

    if (!revision.isSame(release.add(1, "year"), "day")) {
      ctx.addIssue({
        code: "custom",
        path: ["dateRevision"],
        message: "Revision date must be exactly one year after release date.",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

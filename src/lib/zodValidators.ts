import * as z from "zod";

export const FormNameSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export type StoreFormType = z.infer<typeof FormNameSchema>;

export type SettingsFormType = z.infer<typeof FormNameSchema>;

export const BillboardFormSchema = z.object({
  label: z.string().min(2, "Label must be at least 2 characters."),
  imageData: z.object({
    imageUrl: z.string().min(2, "Image Url must be at least 2 characters."),
    imagePublicId: z
      .string()
      .min(2, "Image Url must be at least 2 characters."),
  }),
});

export type BillboardFormType = z.infer<typeof BillboardFormSchema>;

export const CategoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  billboardId: z.string().min(2, "billboardId must be at least 2 characters."),
});

export type CategoryFormType = z.infer<typeof CategoryFormSchema>;

export const SizesFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  value: z.string().min(2, "Value must be at least 2 characters."),
});

export type SizesFormType = z.infer<typeof SizesFormSchema>;

export const ColorsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: "String must be a valid hex code, e.g #f3f3f3",
  }),
});

export type ColorsFormType = z.infer<typeof ColorsFormSchema>;

export const ProductsFormSchema = z.object({
  name: z.string().min(1),
  images: z.object({
      imageUrl: z.string(),
      imagePublicId: z.string(),
    }).array(),
  price: z.coerce.number().min(1), // because we are working with a decimal
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type ProductsFormType = z.infer<typeof ProductsFormSchema>;

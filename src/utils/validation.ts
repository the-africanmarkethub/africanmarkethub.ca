import { BusinessTypes } from "@/constants/vendor/formFieldType";
import { z } from "zod";

export const VendorFormValidation = z.object({
  name: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Business address is required"),
  type: z.enum([BusinessTypes.PRODUCT, BusinessTypes.SERVICE], {
    required_error: "Business type is required",
    invalid_type_error: "Invalid business type",
  }),
  description: z.string().min(1, "Business description is required"),
  logo: z
    .any()
    .refine((file) => !file || file.size <= 1 * 1024 * 1024, {
      message: "Logo file must be 1MB or smaller",
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: "Logo must be a JPEG, PNG, or GIF image",
      }
    )
    .optional(),
  banner: z
    .any()
    .refine((file) => !file || file.size <= 1 * 1024 * 1024, {
      message: "Banner file must be 1MB or smaller",
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: "Banner must be a JPEG, PNG, or GIF image",
      }
    )
    .optional(),
  subscription_id: z.string(),
  billing_cycle: z.string(), // .optional(),
  state_id: z.string(),
  city_id: z.string(),
  country_id: z.string(),
  category_id: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),

  // terms: z.literal(true, {
  //   errorMap: () => ({ message: "You must accept the terms and conditions" }),
  // }),
});

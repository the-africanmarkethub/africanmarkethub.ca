import { z } from "zod";

// Common validation schemas that can be reused across forms

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number");

export const requiredString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

export const optionalString = z.string().optional();

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "File must be a valid image (JPEG, PNG, or WebP)"
  );

export const optionalFileSchema = fileSchema.optional();

export const dateSchema = z.date({
  required_error: "Please select a date",
  invalid_type_error: "That's not a valid date",
});

export const priceSchema = z
  .number()
  .positive("Price must be a positive number")
  .multipleOf(0.01, "Price must have at most 2 decimal places");

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

// Address validation schema
export const addressSchema = z.object({
  street: requiredString("Street address"),
  city: requiredString("City"),
  state: requiredString("State"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid postal code"),
  country: requiredString("Country"),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
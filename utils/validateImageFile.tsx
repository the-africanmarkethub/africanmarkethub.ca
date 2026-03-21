import { FILE_LIMITS, VALID_IMAGE_TYPES } from "@/setting";

export const validateImageFile = (file: File | null, type: keyof typeof FILE_LIMITS) => {
  if (!file) return { valid: true };
  
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid format. Only PNG, JPG, and JPEG are allowed.` };
  }

  if (file.size > FILE_LIMITS[type].max) {
    return { valid: false, error: `${FILE_LIMITS[type].label} exceeds size limit.` };
  }

  return { valid: true };
};
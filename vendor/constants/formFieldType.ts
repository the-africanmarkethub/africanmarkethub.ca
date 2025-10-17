export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  DATE_TIME_PICKER = "dateTimePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  FILE_UPLOAD = "fileUpload",
  FILE = "file",
  DATE = "date",
  RICH_TEXT = "richText",
  NUMBER = "number",
}

export const BusinessTypes = {
  PRODUCT: "products",
  SERVICE: "services",
} as const;

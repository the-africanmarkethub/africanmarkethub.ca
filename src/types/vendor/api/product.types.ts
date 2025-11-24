// Product related types

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  status: ProductStatus;
  categoryId: string;
  subcategoryId?: string;
  images: ProductImage[];
  sizes: ProductSize[];
  colors: ProductColor[];
  tags: string[];
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  // Dimension fields
  weight?: number;
  height?: number;
  length?: number;
  width?: number;
  size_unit?: 'cm' | 'm' | 'ft' | 'in';
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
}

export type ProductStatus = "active" | "draft" | "archived" | "out_of_stock";

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductSize {
  id: string;
  name: string;
  stock: number;
}

export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  stock: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  categoryId: string;
  subcategoryId?: string;
  images: File[];
  sizes: string[];
  colors: string[];
  tags: string[];
  // Dimension fields
  weight?: number;
  height?: number;
  length?: number;
  width?: number;
  size_unit?: 'cm' | 'm' | 'ft' | 'in';
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: "name" | "price" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}
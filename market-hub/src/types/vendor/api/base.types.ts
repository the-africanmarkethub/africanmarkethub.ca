// Base API response types

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: ApiError;
}

export interface ApiError {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  silent?: boolean;
}
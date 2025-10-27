// Analytics API Types

export interface CategoryData {
  category: string;
  quantity_sold: number;
  revenue: number;
}

export interface ProductData {
  product_id: number;
  title: string;
  image: string;
  quantity_sold: number;
  revenue: number;
}

export interface LocationData {
  country: string;
  users: number;
  percentage: number;
}

export interface SalesAnalyticsData {
  sales_volume: number;
  sales_growth: number;
  conversion_rate: number;
  conversion_growth: number;
  profit_margin: number;
  profit_growth: number;
}

// Transformed data interfaces for UI components
export interface TransformedCategory {
  image: string;
  name: string;
  value: string;
  increase: boolean;
  percentage: number;
}

export interface TransformedProduct {
  image: string;
  name: string;
  subtitle: string;
  value: string;
}

export interface TransformedLocation {
  country: string;
  users: number;
  percentage: number;
}
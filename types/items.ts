import { Product } from "./product";

export type ItemType = "products" | "services";

export interface ItemsPayload {
  type: ItemType;
  page?: number;
  limit?: number;
}

export interface ItemsResponse {
  status: string;
  data: Product[];
  total: number;
  offset: number;
  limit: number;
}

import { Product, PaginationLink } from "./product";

export interface SearchPayload {
  query: string;
  page?: number;
  per_page?: number;
}

export interface SearchResponse {
  data: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  status: string;
  message: string;
}

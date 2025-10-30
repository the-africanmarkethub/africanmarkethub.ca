export interface FAQ {
  id: number;
  question: string;
  answer: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FAQResponse {
  total: number;
  offset: number;
  limit: number;
  data: FAQ[];
}

export interface FAQParams {
  type?: string;
  limit?: number;
  offset?: number;
}
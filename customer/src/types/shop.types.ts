export interface State {
  id: number;
  name: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
}

export interface Vendor {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface Shop {
  id: number;
  name: string;
  slug: string;
  address: string;
  type: string;
  logo: string;
  banner: string;
  description: string;
  status: string;
  state: State;
  city: City;
  category: Category;
  vendor: Vendor;
}

export interface ShopsApiResponse {
  message: string;
  status: string;
  shops: {
    current_page: number;
    data: Shop[];
    total: number;
  };
}

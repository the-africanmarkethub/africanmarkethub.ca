export interface City {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name: string;
  flag: string;
  flag_public_id: string;
  dial_code: string;
  currency: string;
  short_name: string;
  created_at: string;
  updated_at: string;
  state: State[];
  city: City[];
}

export interface LocationsResponse {
  status: string;
  data: Country[];
}
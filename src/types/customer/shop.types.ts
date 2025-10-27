export interface Shop {
  id: number;
  name: string;
  slug: string;
  address: string;
  type: "products" | "services";
  logo: string;
  logo_public_id: string;
  banner: string;
  banner_public_id: string;
  description: string;
  subscription_id: number;
  state_id: string;
  city_id: string;
  country_id: string;
  vendor_id: number;
  category_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  state: {
    id: number;
    name: string;
    country_id: number;
    created_at: string;
    updated_at: string;
  };
  city: {
    id: number;
    name: string;
    state_id: number;
    country_id: number;
    created_at: string;
    updated_at: string;
  };
  category: {
    id: number;
    name: string;
    type: string;
    image: string | null;
    image_public_id: string | null;
    slug: string;
    description: string;
    status: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
  };
  vendor: {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    email_verified_at: string;
    phone_verified_at: string;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    referral_code: string;
    referred_by: string | null;
    profile_photo: string;
    google_id: string | null;
    fcm_token: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface ShopsResponse {
  message: string;
  status: string;
  shops: {
    current_page: number;
    data: Shop[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

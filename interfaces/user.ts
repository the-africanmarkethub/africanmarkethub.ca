export interface User {
  id: number;
  name: string;
  email: string;
  last_name: string;
  role: string;
  phone: string;
  email_verified_at: string;
  phone_verified_at: string;
  is_active: string;
  google_id: string;
  referral_code: string;
  referred_by: string; 
  profile_photo?: string;
  country?: string;
  state?: string;
  city?: string;
  created_at: string;
  updated_at: string;
  street_address?: string;
  zip_code?: string;
  address_label?: string;
}
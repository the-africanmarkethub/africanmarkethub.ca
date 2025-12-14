import Item from "./items";

export default interface Category {
  id: number;
  name: string;
  type: string;
  slug: string;
  description: string | null;
  image: string | null;
  image_public_id?: string | null;
  status: string;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
  products?: Item[];
  parent_name?: string;
}

// Define TypeScript interfaces
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  image_public_id: string | null;
  description: string | null;
  status: string;
  parent_id: number | string | null;
  created_at: string;
  updated_at: string;
  children?: Category[]; // Children are optional and recursive
}

export interface CategoriesPopoverProps {
  categories: Category[];
}

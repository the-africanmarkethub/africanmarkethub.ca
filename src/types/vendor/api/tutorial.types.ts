export interface Tutorial {
  id: number;
  title: string;
  description: string;
  video_url: string;
  image_url: string;
  image_public_id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TutorialResponse {
  status: string;
  data: Tutorial[];
  total: number;
  limit: number;
  offset: number;
}

export interface TutorialParams {
  type?: string;
  limit?: number;
  offset?: number;
}
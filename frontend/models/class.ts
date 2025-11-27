export interface Class {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code: string;
  owner_id: string;
  owner?: {
    id: string;
    full_name?: string | null;
    display_name?: string | null;
    email: string;
  } | null;
  member_count?: number;
}

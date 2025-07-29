export interface Event {
  id: string;
  title: string;
  description?: string;
  host_id: string;
  start_date_range: string; // ISO date string
  end_date_range: string;   // ISO date string
  invite_token?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}
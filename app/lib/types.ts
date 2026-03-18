export type EventCategory =
  | 'Engineering'
  | 'Business'
  | 'Art'
  | 'Music'
  | 'Science';

export type CommunityEvent = {
  id: string | number;
  title: string;
  community?: string;
  community_id?: string;
  description?: string;
  location?: string;
  date?: string;
  starts_at?: string;
  ends_at?: string;
  category?: EventCategory;
  image_url?: string;
  is_paid?: boolean;
  ticket_price?: number;
  capacity?: number;
  filledSeats?: number;
  totalSeats?: number;
};

export type Community = {
  id: string | number;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  numberOfEvents?: number;
  created_by?: string;
};

export type FilterCategory = 'All' | EventCategory;

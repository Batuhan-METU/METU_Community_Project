export type EventCategory =
  | 'Engineering'
  | 'Technology'
  | 'Business'
  | 'Art'
  | 'Music'
  | 'Science'
  | 'Sports'
  | 'Entertainment';

/** Shape returned by GET /api/events */
export type CommunityEvent = {
  id: string;
  title: string;
  slug?: string;
  community_id?: string;
  description?: string;
  location?: string;
  /** Legacy field — prefer starts_at */
  date?: string;
  starts_at?: string;
  ends_at?: string;
  application_deadline?: string;
  image_url?: string;
  is_paid?: boolean;
  ticket_price?: number | null;
  iban?: string | null;
  capacity?: number | null;
  created_by?: string;
  created_at?: string;
};

/** Shape returned by GET /api/communities */
export type Community = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  logo_url?: string | null;
  created_by?: string;
  created_at?: string;
};

export type FilterCategory = 'All' | EventCategory;

-- METUHub / METU Community — veritabanı şeması
-- Kaynak: backend/src/routes/*.js içindeki Supabase sorguları
--
-- Notlar:
-- - API `communities` tablosunu kullanır (kulüp / topluluk kaydı).
-- - `clubs` fiziksel tablo değildir; aynı veriyi gösteren VIEW'dur (isim uyumu için).
-- - `auth.users` Supabase Auth şemasındadır; bu dosya Supabase SQL Editor veya
--   auth şemasına erişimi olan bir PostgreSQL örneğinde çalıştırılmalıdır.

-- =============================================================================
-- 1) Kod analizi özeti (hangi tablo / sütun kullanılıyor)
-- =============================================================================
--
-- profiles (users.js — GET /api/users/me)
--   select("*") + eq("id", …)  →  id (PK, auth ile eşleşir)
--   Uygulama: full_name, email, role vb. public.profiles üzerinden okunur.
--
-- communities (communities.js)
--   select("*"), insert: name, description, category, created_by
--   search: name, description (ilike)
--
-- events (events.js)
--   select("*"), gt/eq: starts_at; or: title, description; join: communities(category)
--   insert: community_id, title, slug, description, location, starts_at, ends_at,
--           application_deadline, capacity, is_paid, ticket_price, iban, created_by
--   unique hata (23505): aynı toplulukta slug tekrarı → UNIQUE (community_id, slug)
--
-- event_participants (events.js)
--   select: id, user_id, created_at; insert: event_id, user_id
--   unique katılım: UNIQUE (event_id, user_id)
--
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- profiles — auth.users ile bire bir; /api/users/me
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text,
  email text,
  role text NOT NULL DEFAULT 'student',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

COMMENT ON TABLE public.profiles IS 'Kullanıcı profili; auth.users.id ile eşleşir.';

-- -----------------------------------------------------------------------------
-- communities — kulüpler / topluluklar (API tablo adı)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  created_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_communities_created_by ON public.communities (created_by);
CREATE INDEX IF NOT EXISTS idx_communities_category ON public.communities (category);

COMMENT ON TABLE public.communities IS 'Öğrenci kulüpleri (topluluklar); API doğrudan bu tabloyu kullanır.';

-- -----------------------------------------------------------------------------
-- clubs — communities ile aynı satırlar (salt okunur VIEW; "Clubs" ismi için)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.clubs AS
SELECT
  id,
  name,
  description,
  category,
  created_by,
  created_at,
  updated_at
FROM public.communities;

COMMENT ON VIEW public.clubs IS 'communities tablosunun alias görünümü; INSERT/UPDATE API üzerinden communities kullanılmalıdır.';

-- -----------------------------------------------------------------------------
-- events — community_id → communities.id (kodda club_id yok)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities (id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  location text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  application_deadline timestamptz,
  capacity integer CHECK (capacity IS NULL OR capacity >= 0),
  is_paid boolean NOT NULL DEFAULT false,
  ticket_price numeric(12, 2),
  iban text,
  created_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_community_slug_unique UNIQUE (community_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_events_community_id ON public.events (community_id);
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON public.events (starts_at);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events (created_by);

COMMENT ON TABLE public.events IS 'Etkinlikler; events.community_id → communities.id.';

-- -----------------------------------------------------------------------------
-- event_participants — "Katıl" kayıtları
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_participants_event_user_unique UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants (event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON public.event_participants (user_id);

COMMENT ON TABLE public.event_participants IS 'Kullanıcı–etkinlik katılımı; (event_id, user_id) tekil.';

-- =============================================================================
-- 2) Yeni kayıtta profil satırı (Supabase önerisi — opsiyonel)
-- =============================================================================
-- Aşağıdaki fonksiyon ve tetikleyiciyi yalnızca Supabase projesinde,
-- auth şeması mevcutken çalıştırın. Kayıt sonrası public.profiles doldurulur.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        email     = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = now();
  RETURN new;
END;
$$;

-- Supabase: auth.users yoksa bu blok atlanır (saf PostgreSQL testleri için).
DO $body$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'auth'
      AND table_name = 'users'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users';
    EXECUTE 'CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user()';
  END IF;
END;
$body$;

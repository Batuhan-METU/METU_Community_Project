const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');

/**
 * @openapi
 * tags:
 *   - name: Events
 *     description: Etkinlik işlemleri
 */

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Etkinlikleri listele (gelecek etkinlikler, starts_at ASC)
 *     responses:
 *       200:
 *         description: Etkinlik listesi
 *       500:
 *         description: Sunucu hatası
 */
// GET /api/events — tüm etkinlikleri listele (herkese açık)
router.get('/', async (req, res) => {
  try {
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gt('starts_at', nowIso)
      .order('starts_at', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Etkinlikler getirilemedi.' });
  }
});

/**
 * @openapi
 * /api/events/search:
 *   get:
 *     tags: [Events]
 *     summary: Etkinliklerde arama (title/description, ilike)
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arama sonuçları
 *       400:
 *         description: Arama terimi gerekli
 *       500:
 *         description: Sunucu hatası
 */
// GET /api/events/search — başlık ve açıklamada arama (herkese açık)
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Arama terimi (q) gereklidir.' });
  }

  try {
    const nowIso = new Date().toISOString();
    const searchPattern = `%${q.trim()}%`;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
      .gt('starts_at', nowIso)
      .order('starts_at', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Etkinlik araması gerçekleştirilemedi.' });
  }
});

/**
 * @openapi
 * /api/events/filter:
 *   get:
 *     tags: [Events]
 *     summary: Etkinlikleri filtrele (community category ve/veya starts_at)
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: starts_at
 *         required: false
 *         schema:
 *           type: string
 *           description: ISO datetime (ör. 2026-03-10T00:00:00Z)
 *     responses:
 *       200:
 *         description: Filtre sonuçları
 *       400:
 *         description: En az bir filtre gerekli
 *       500:
 *         description: Sunucu hatası
 */
// GET /api/events/filter — kategori ve/veya tarihe göre filtreleme (herkese açık)
router.get('/filter', async (req, res) => {
  const rawCategory = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const rawStartsAt = typeof req.query.starts_at === 'string' ? req.query.starts_at.trim() : '';

  const hasCategory = !!rawCategory;
  const hasStartsAt = !!rawStartsAt;

  if (!hasCategory && !hasStartsAt) {
    return res
      .status(400)
      .json({ error: 'En az bir filtre parametresi (category veya starts_at) gereklidir.' });
  }

  try {
    // Not: events tablosunda category kolonu yok, kategori bilgisi communities.category’de.
    // Bu yüzden Supabase relationship üzerinden communities ile join yapıyoruz.
    let selectClause = '*';
    if (hasCategory) {
      selectClause = '*, communities!inner(category)';
    }

    const nowIso = new Date().toISOString();

    let query = supabase.from('events').select(selectClause).gt('starts_at', nowIso);

    if (hasCategory) {
      query = query.eq('communities.category', rawCategory);
    }

    if (hasStartsAt) {
      query = query.gte('starts_at', rawStartsAt);
    }

    const { data, error } = await query.order('starts_at', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Filtreleme Hatası:', error);
    res.status(500).json({ error: 'Etkinlikler filtrelenemedi.' });
  }
});

/**
 * @openapi
 * /api/events/participants/{event_id}:
 *   get:
 *     tags: [Events]
 *     summary: Etkinlik katılımcılarını listele
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Katılımcılar
 *       500:
 *         description: Sunucu hatası
 */
// GET /api/events/participants/:event_id — etkinliğe kimlerin katıldığını listele (herkese açık)
router.get('/participants/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;

    const { data, error } = await supabase
      .from('event_participants')
      .select('id, user_id, created_at')
      .eq('event_id', event_id);

    if (error) throw error;

    res.json({ event_id, participant_count: data.length, participants: data });
  } catch (err) {
    res.status(500).json({ error: 'Katılımcılar getirilemedi.' });
  }
});

/**
 * @openapi
 * /api/events/join/{event_id}:
 *   post:
 *     tags: [Events]
 *     summary: Giriş yapan kullanıcıyı etkinliğe kaydet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Katılım oluşturuldu
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Kontenjan dolu
 *       404:
 *         description: Etkinlik bulunamadı
 *       409:
 *         description: Zaten kayıtlı
 *       500:
 *         description: Sunucu hatası
 */
// POST /api/events/join/:event_id — giriş yapan kullanıcıyı etkinliğe kaydet (auth gerekli)
router.post('/join/:event_id', authMiddleware, async (req, res) => {
  try {
    const { event_id } = req.params;

    const { data: existing, error: existingError } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', event_id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      return res.status(409).json({ error: 'Bu etkinliğe zaten kayıtlısınız.' });
    }

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, capacity')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı.' });
    }

    if (event.capacity !== null) {
      const { count, error: countError } = await supabase
        .from('event_participants')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', event_id);

      if (countError) throw countError;

      if (count >= event.capacity) {
        return res.status(403).json({ error: 'Kontenjan dolu.' });
      }
    }

    const { data, error } = await supabase
      .from('event_participants')
      .insert({
        event_id,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Etkinliğe kayıt yapılamadı.' });
  }
});

// POST /api/events/:community_id — sadece topluluğu oluşturan kişi etkinlik açabilsin
router.post('/:community_id', authMiddleware, async (req, res) => {
  try {
    const { community_id } = req.params;
    const {
      title,
      description,
      location,
      starts_at,
      ends_at,
      application_deadline,
      capacity,
      is_paid,
      ticket_price,
      iban,
      slug,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Etkinlik başlığı zorunludur.' });
    }

    if (!starts_at) {
      return res.status(400).json({ error: 'Başlangıç tarihi (starts_at) zorunludur.' });
    }

    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, created_by')
      .eq('id', community_id)
      .single();

    if (communityError || !community) {
      return res.status(404).json({ error: 'Topluluk bulunamadı.' });
    }

    if (community.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sadece topluluğu oluşturan kişi etkinlik ekleyebilir.' });
    }

    const eventSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') ||
      'etkinlik';

    const { data, error } = await supabase
      .from('events')
      .insert({
        community_id,
        title,
        slug: eventSlug,
        description: description || null,
        location: location || null,
        starts_at,
        ends_at: ends_at || null,
        application_deadline: application_deadline || null,
        capacity: capacity ?? null,
        is_paid: is_paid ?? false,
        ticket_price: ticket_price ?? null,
        iban: iban || null,
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Bu toplulukta aynı slug ile etkinlik zaten var.' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Etkinlik oluşturulamadı.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

// Tüm /api/me rotaları için auth zorunlu
router.use(authMiddleware);

// GET /api/me/profile — giriş yapmış kullanıcının profil bilgileri
router.get('/profile', async (req, res) => {
  try {
    const authUser = req.user;

    if (!authUser) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }

    // full_name bilgisi public.profiles tablosunda tutuluyor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: 'Profil bilgileri getirilemedi.' });
    }

    return res.json({
      id: authUser.id,
      email: authUser.email,
      full_name: profile ? profile.full_name : null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Profil bilgileri alınırken bir hata oluştu.' });
  }
});

// GET /api/me/events — kullanıcının katıldığı etkinlikler
router.get('/events', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }

    const { data, error } = await supabase
      .from('event_participants')
      .select(
        `
          id,
          created_at,
          event:events (
            id,
            community_id,
            title,
            slug,
            description,
            location,
            starts_at,
            ends_at,
            application_deadline,
            capacity,
            is_paid,
            ticket_price,
            iban,
            created_by,
            created_at,
            updated_at
          )
        `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Kullanıcının katıldığı etkinlikler getirilemedi.' });
    }

    // data boş olabilir; bu durumda [] dönmek yeterli
    return res.json(data || []);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Kullanıcının katıldığı etkinlikler alınırken bir hata oluştu.' });
  }
});

// GET /api/me/communities — kullanıcının kurduğu topluluklar
router.get('/communities', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }

    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('created_by', userId);

    if (error) {
      return res.status(500).json({ error: 'Kullanıcının kurduğu topluluklar getirilemedi.' });
    }

    return res.json(data || []);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Kullanıcının kurduğu topluluklar alınırken bir hata oluştu.' });
  }
});

// PUT /api/me/profile — sadece full_name güncelleme
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { full_name } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }

    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      return res
        .status(400)
        .json({ error: 'Güncelleme için geçerli bir full_name alanı gereklidir.' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: full_name.trim() })
      .eq('id', userId)
      .select('id, full_name')
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: 'Profil güncellenemedi.' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Profil bulunamadı.' });
    }

    return res.json({
      message: 'Profil başarıyla güncellendi.',
      profile: data,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu.' });
  }
});

// DELETE /api/me/events/:eventId — kullanıcının bir etkinlikten ayrılması
router.delete('/events/:eventId', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }

    if (!eventId) {
      return res.status(400).json({ error: 'Etkinlik ID bilgisi gereklidir.' });
    }

    // Bu endpoint'te RLS politikaları auth.uid() üzerinden çalışsın diye
    // kullanıcının access token'ı ile yetkilendirilmiş bir Supabase client oluşturuyoruz.
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    const authedSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      }
    );

    const { data, error } = await authedSupabase
      .from('event_participants')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Silme Hatası Detayı (Supabase):', error);
      return res.status(500).json({ error: 'Etkinlikten ayrılırken bir hata oluştu.' });
    }

    if (!data) {
      return res
        .status(404)
        .json({ error: 'Bu etkinlik için kayıt bulunamadı veya zaten ayrılmışsınız.' });
    }

    return res.json({ message: 'Etkinlikten başarıyla ayrıldınız.' });
  } catch (error) {
    console.error('Silme Hatası Detayı:', error);
    return res.status(500).json({ error: 'Etkinlikten ayrılma işlemi sırasında bir hata oluştu.' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');

const MEDIA_BUCKET = 'metuhub_media';

function extractMediaPathFromPublicUrl(publicUrl) {
  if (!publicUrl || typeof publicUrl !== 'string') return null;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

/**
 * @openapi
 * tags:
 *   - name: Communities
 *     description: Topluluk (community) işlemleri
 */

/**
 * @openapi
 * /api/communities:
 *   get:
 *     tags: [Communities]
 *     summary: Toplulukları listele
 *     responses:
 *       200:
 *         description: Topluluk listesi
 *       500:
 *         description: Sunucu hatası
 */
// GET /api/communities — herkese açık
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Topluluklar getirilemedi.' });
  }
});

/**
 * @openapi
 * /api/communities/search:
 *   get:
 *     tags: [Communities]
 *     summary: Topluluklarda arama (name/description)
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
// GET /api/communities/search — topluluk ismi ve açıklamasında arama (herkese açık)
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Arama terimi (q) gereklidir.' });
  }

  try {
    const searchPattern = `%${q.trim()}%`;

    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Topluluk araması gerçekleştirilemedi.' });
  }
});

/**
 * @openapi
 * /api/communities:
 *   post:
 *     tags: [Communities]
 *     summary: Yeni topluluk oluştur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Oluşturuldu
 *       400:
 *         description: Hatalı istek
 *       401:
 *         description: Yetkisiz
 *       500:
 *         description: Sunucu hatası
 */
// POST /api/communities — sadece giriş yapmış kullanıcılar
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Topluluk adı zorunludur.' });
    }

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name,
        description: description || null,
        category: category || null,
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Topluluk oluşturulamadı.' });
  }
});

/**
 * @openapi
 * /api/communities/{id}:
 *   put:
 *     tags: [Communities]
 *     summary: Topluluk güncelle (sadece sahibi)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Güncellendi
 *       400:
 *         description: Hatalı istek
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yetki yok
 *       404:
 *         description: Bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
// PUT /api/communities/:id — sadece topluluğu oluşturan kullanıcı güncelleyebilir
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, description, category } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }
    if (!id) {
      return res.status(400).json({ error: 'Topluluk ID bilgisi gereklidir.' });
    }

    const updates = {};
    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof description === 'string') updates.description = description.trim() || null;
    if (typeof category === 'string') updates.category = category.trim() || null;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Güncellenecek en az bir alan gönderilmelidir.' });
    }

    const { data: existing, error: existingError } = await supabase
      .from('communities')
      .select('id, created_by')
      .eq('id', id)
      .maybeSingle();

    if (existingError) {
      return res.status(500).json({ error: 'Topluluk bilgisi doğrulanamadı.' });
    }
    if (!existing) {
      return res.status(404).json({ error: 'Topluluk bulunamadı.' });
    }
    if (existing.created_by !== userId) {
      return res.status(403).json({ error: 'Bu topluluğu güncelleme yetkiniz yok.' });
    }

    const { data, error } = await supabase
      .from('communities')
      .update(updates)
      .eq('id', id)
      .eq('created_by', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Topluluk güncellendi.', community: data });
  } catch (err) {
    return res.status(500).json({ error: 'Topluluk güncellenemedi.' });
  }
});

/**
 * @openapi
 * /api/communities/{id}:
 *   delete:
 *     tags: [Communities]
 *     summary: Topluluk sil (sadece sahibi)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Silindi
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yetki yok
 *       404:
 *         description: Bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
// DELETE /api/communities/:id — sadece topluluğu oluşturan kullanıcı silebilir
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }
    if (!id) {
      return res.status(400).json({ error: 'Topluluk ID bilgisi gereklidir.' });
    }

    const { data: existing, error: existingError } = await supabase
      .from('communities')
      .select('id, created_by, logo_url')
      .eq('id', id)
      .maybeSingle();

    if (existingError) {
      return res.status(500).json({ error: 'Topluluk bilgisi doğrulanamadı.' });
    }
    if (!existing) {
      return res.status(404).json({ error: 'Topluluk bulunamadı.' });
    }
    if (existing.created_by !== userId) {
      return res.status(403).json({ error: 'Bu topluluğu silme yetkiniz yok.' });
    }

    // Logo dosyasını storage'dan silmeyi best-effort dene (başarısız olursa DB silmeyi engellemez)
    const logoPath = extractMediaPathFromPublicUrl(existing.logo_url);
    if (logoPath) {
      const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([logoPath]);
      if (storageError) {
        console.error('Community logo silme hatası:', storageError);
      }
    }

    const { error: deleteError } = await supabase
      .from('communities')
      .delete()
      .eq('id', id)
      .eq('created_by', userId);

    if (deleteError) {
      return res.status(500).json({ error: 'Topluluk silinemedi.' });
    }

    return res.json({ message: 'Topluluk silindi.' });
  } catch (err) {
    return res.status(500).json({ error: 'Topluluk silinemedi.' });
  }
});

module.exports = router;
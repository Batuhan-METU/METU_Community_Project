const express = require('express');
const router = express.Router();
const multer = require('multer');

const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');
const { uploadToBucket } = require('../services/storageService');

/**
 * @openapi
 * tags:
 *   - name: Upload
 *     description: Supabase Storage görsel yükleme uçları
 */

/**
 * @openapi
 * /api/upload/profile:
 *   post:
 *     tags: [Upload]
 *     summary: Profil fotoğrafı yükle (profiles.avatar_url)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Yüklendi
 *       400:
 *         description: Hatalı dosya/istek
 *       401:
 *         description: Yetkisiz
 *       500:
 *         description: Sunucu hatası
 */
// Sadece resim türlerine izin ver
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new Error('Sadece resim dosyaları (JPEG, PNG, GIF, WebP) yüklenebilir.'), false);
    }
    cb(null, true);
  },
});

// Tüm yükleme rotaları auth zorunlu
router.use(authMiddleware);

// Ortak: tek dosya alanı
const singleImage = upload.single('image');

// Yardımcı: dosya geldi mi kontrolü
function hasFile(req) {
  return req.file && req.file.buffer;
}

// Yardımcı: MIME türünden uzantı
function getExt(mimetype) {
  const map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };
  return map[mimetype] || '.jpg';
}

// GET /api/upload — kullanım bilgisi (isteğe bağlı)
router.get('/', (req, res) => {
  res.json({
    endpoints: {
      profile: 'POST /api/upload/profile (field: image)',
      community: 'POST /api/upload/community/:community_id (field: image)',
      event: 'POST /api/upload/event/:event_id (field: image)',
    },
  });
});

// POST /api/upload/profile — profil fotoğrafı; URL profiles.avatar_url'e yazılır
router.post('/profile', singleImage, async (req, res) => {
  try {
    if (!hasFile(req)) {
      return res.status(400).json({ error: 'Lütfen bir resim dosyası (image) gönderin.' });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }

    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;
    if (!Buffer.isBuffer(buffer)) {
      return res.status(400).json({ error: 'Dosya buffer olarak alınamadı.' });
    }

    const ext = getExt(mimetype);
    const filePath = `profile/${userId}-${Date.now()}${ext}`;
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    const publicUrl = await uploadToBucket(buffer, mimetype, filePath, token);

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: 'Profil fotoğrafı kaydedilemedi.' });
    }

    return res.json({ message: 'Profil fotoğrafı yüklendi.', url: publicUrl });
  } catch (err) {
    const msg = err.message || 'Profil fotoğrafı yüklenirken bir hata oluştu.';
    return res.status(500).json({ error: msg });
  }
});

/**
 * @openapi
 * /api/upload/community/{community_id}:
 *   post:
 *     tags: [Upload]
 *     summary: Topluluk logosu yükle (communities.logo_url)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: community_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Yüklendi
 *       400:
 *         description: Hatalı dosya/istek
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yetki yok
 *       404:
 *         description: Topluluk bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
// POST /api/upload/community/:community_id — topluluk logosu; URL communities.logo_url'e yazılır
router.post('/community/:community_id', singleImage, async (req, res) => {
  try {
    if (!hasFile(req)) {
      return res.status(400).json({ error: 'Lütfen bir resim dosyası (image) gönderin.' });
    }
    const userId = req.user?.id;
    const { community_id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }
    if (!community_id) {
      return res.status(400).json({ error: 'Topluluk ID gereklidir.' });
    }

    const { data: community, error: fetchErr } = await supabase
      .from('communities')
      .select('id, created_by')
      .eq('id', community_id)
      .single();

    if (fetchErr || !community) {
      return res.status(404).json({ error: 'Topluluk bulunamadı.' });
    }
    if (community.created_by !== userId) {
      return res.status(403).json({ error: 'Sadece topluluğu oluşturan kişi logo yükleyebilir.' });
    }

    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;
    if (!Buffer.isBuffer(buffer)) {
      return res.status(400).json({ error: 'Dosya buffer olarak alınamadı.' });
    }

    const ext = getExt(mimetype);
    const filePath = `community/${community_id}-${Date.now()}${ext}`;
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    const publicUrl = await uploadToBucket(buffer, mimetype, filePath, token);

    const { error } = await supabase
      .from('communities')
      .update({ logo_url: publicUrl })
      .eq('id', community_id);

    if (error) {
      return res.status(500).json({ error: 'Topluluk logosu kaydedilemedi.' });
    }

    return res.json({ message: 'Topluluk logosu yüklendi.', url: publicUrl });
  } catch (err) {
    const msg = err.message || 'Topluluk logosu yüklenirken bir hata oluştu.';
    return res.status(500).json({ error: msg });
  }
});

/**
 * @openapi
 * /api/upload/event/{event_id}:
 *   post:
 *     tags: [Upload]
 *     summary: Etkinlik kapak resmi yükle (events.image_url)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Yüklendi
 *       400:
 *         description: Hatalı dosya/istek
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yetki yok
 *       404:
 *         description: Etkinlik bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
// POST /api/upload/event/:event_id — etkinlik kapak resmi; URL events.image_url'e yazılır
router.post('/event/:event_id', singleImage, async (req, res) => {
  try {
    if (!hasFile(req)) {
      return res.status(400).json({ error: 'Lütfen bir resim dosyası (image) gönderin.' });
    }
    const userId = req.user?.id;
    const { event_id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }
    if (!event_id) {
      return res.status(400).json({ error: 'Etkinlik ID gereklidir.' });
    }

    const { data: event, error: fetchErr } = await supabase
      .from('events')
      .select('id, created_by')
      .eq('id', event_id)
      .single();

    if (fetchErr || !event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı.' });
    }
    if (event.created_by !== userId) {
      return res.status(403).json({ error: 'Sadece etkinliği oluşturan kişi kapak resmi yükleyebilir.' });
    }

    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;
    if (!Buffer.isBuffer(buffer)) {
      return res.status(400).json({ error: 'Dosya buffer olarak alınamadı.' });
    }

    const ext = getExt(mimetype);
    const filePath = `event/${event_id}-${Date.now()}${ext}`;
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    const publicUrl = await uploadToBucket(buffer, mimetype, filePath, token);

    const { error } = await supabase
      .from('events')
      .update({ image_url: publicUrl })
      .eq('id', event_id);

    if (error) {
      return res.status(500).json({ error: 'Etkinlik kapak resmi kaydedilemedi.' });
    }

    return res.json({ message: 'Etkinlik kapak resmi yüklendi.', url: publicUrl });
  } catch (err) {
    const msg = err.message || 'Etkinlik kapak resmi yüklenirken bir hata oluştu.';
    return res.status(500).json({ error: msg });
  }
});

// Multer / fileFilter hatalarını yakala
router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message || 'Dosya yüklenirken bir hata oluştu.' });
  }
  next();
});

module.exports = router;

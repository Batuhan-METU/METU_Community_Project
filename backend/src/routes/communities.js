const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');

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

module.exports = router;
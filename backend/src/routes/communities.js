const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');

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
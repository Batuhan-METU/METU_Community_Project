const express = require("express");
const supabase = require("../config/supabaseClient");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Kullanıcı kayıt/giriş ve profil işlemleri
 */

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Kullanıcı kaydı
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, full_name]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Hatalı istek
 *       500:
 *         description: Sunucu hatası
 */
// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        error: "email, password ve full_name alanları zorunludur.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Kayıt başarılı! Lütfen e-postanızı doğrulayın.",
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
});

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Kullanıcı girişi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı (access_token döner)
 *       400:
 *         description: Hatalı istek
 *       401:
 *         description: Yetkisiz
 *       500:
 *         description: Sunucu hatası
 */
// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email ve password zorunludur." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Giriş yapan kullanıcının profilini getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil
 *       401:
 *         description: Yetkisiz
 *       404:
 *         description: Profil bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
// GET /api/users/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Profil bulunamadı." });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

module.exports = router;


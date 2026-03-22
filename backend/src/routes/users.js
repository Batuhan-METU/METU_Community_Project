const express = require("express");
const supabase = require("../config/supabaseClient");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

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

    const session = data.session;
    const payload = {
      message: session
        ? "Kayıt başarılı."
        : "Kayıt başarılı! Lütfen e-postanızı doğrulayın.",
      user: data.user,
      session: session
        ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          }
        : null,
    };

    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
});

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

    if (!data.session) {
      return res.status(401).json({
        error: "Oturum oluşturulamadı. Lütfen tekrar deneyin.",
      });
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
    res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
});

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


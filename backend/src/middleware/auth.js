const supabase = require("../config/supabaseClient");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetkisiz erişim. Token gerekli." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Token doğrulama hatası." });
  }
};

module.exports = authMiddleware;

const express = require("express");

const router = express.Router();

// Şimdilik örnek data; sonra veritabanına bağlanacağız
const sampleCommunities = [
  {
    id: 1,
    name: "Eşli Dans Topluluğu",
    slug: "esli-dans",
    description: "Salsa, bachata ve daha fazlası için dans topluluğu.",
    category: "Spor & Sanat",
  },
  {
    id: 2,
    name: "Müzik Topluluğu",
    slug: "muzik",
    description: "Konserler, jam session'lar ve müzik etkinlikleri.",
    category: "Sanat",
  },
];

router.get("/", (req, res) => {
  res.json(sampleCommunities);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const community = sampleCommunities.find((c) => c.id === id);

  if (!community) {
    return res.status(404).json({ message: "Topluluk bulunamadı" });
  }

  res.json(community);
});

module.exports = router;


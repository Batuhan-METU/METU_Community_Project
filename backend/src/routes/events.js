const express = require("express");

const router = express.Router();

// Örnek etkinlik verisi
const sampleEvents = [
  {
    id: 1,
    communityId: 1,
    title: "Eşli Dans Partisi",
    description: "Salsa ve bachata gecesi.",
    dateTime: "2026-03-20T20:00:00Z",
    location: "ODTÜ Kültür ve Kongre Merkezi",
    ticketPrice: 150,
    iban: "TR00 0000 0000 0000 0000 0000 00",
  },
  {
    id: 2,
    communityId: 2,
    title: "Akustik Konser",
    description: "Kampüs akustik konser serisi.",
    dateTime: "2026-03-25T19:30:00Z",
    location: "ODTÜ Amfi Tiyatro",
    ticketPrice: 0,
    iban: null,
  },
];

router.get("/", (req, res) => {
  res.json(sampleEvents);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const event = sampleEvents.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ message: "Etkinlik bulunamadı" });
  }

  res.json(event);
});

module.exports = router;


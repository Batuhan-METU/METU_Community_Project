const express = require("express");

const router = express.Router();

// Şimdilik sahte "current user" datası
router.get("/me", (req, res) => {
  res.json({
    id: 1,
    name: "ODTÜ Öğrencisi",
    email: "ornek@metu.edu.tr",
    department: "Computer Engineering",
    classYear: 3,
    hobbies: ["dans", "müzik", "oyun geliştirme"],
  });
});

module.exports = router;


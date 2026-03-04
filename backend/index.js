const express = require("express");
const app = express();
const PORT = 8080; // Genelde backend 5000 veya 8000'de çalışır

// Bu bizim ilk "Endpoint"imiz (Kapımız)
app.get("/", (req, res) => {
  res.send("METUHub API Canavar Gibi Çalışıyor! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server şu an http://localhost:${PORT} adresinde aktif.`);
});

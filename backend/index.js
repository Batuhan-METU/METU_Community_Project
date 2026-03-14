const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Basit health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "METUHub API" });
});

// Route modüllerini bağla
const communitiesRouter = require("./src/routes/communities");
const eventsRouter = require("./src/routes/events");
const usersRouter = require("./src/routes/users");
const meRouter = require("./src/routes/me");

app.use("/api/communities", communitiesRouter);
app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);
app.use("/api/me", meRouter);

app.listen(PORT, () => {
  console.log(`METUHub API http://localhost:${PORT} adresinde çalışıyor.`);
});

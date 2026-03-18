const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Basit health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "METUHub API" });
});

// Swagger / OpenAPI docs
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "METUHub API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:8080" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route modüllerini bağla
const communitiesRouter = require("./src/routes/communities");
const eventsRouter = require("./src/routes/events");
const usersRouter = require("./src/routes/users");
const meRouter = require("./src/routes/me");
const uploadRouter = require("./src/routes/upload");

app.use("/api/communities", communitiesRouter);
app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);
app.use("/api/me", meRouter);
app.use("/api/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`METUHub API http://localhost:${PORT} adresinde çalışıyor.`);
});

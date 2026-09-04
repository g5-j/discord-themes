const express = require("express");

const app = express();
app.use(express.json());

const PYTHON_URL = "http://fi13.bot-hosting.cloud:25862";
const API_KEY = "LAC_8fK2mP7xQ9vR4tY6";

app.get("/", (req, res) => {
  res.json({ ok: true, service: "LAC Status Relay" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/update", async (req, res) => {
  try {
    if (!PYTHON_URL || !API_KEY) {
      return res.status(503).json({
        ok: false,
        error: "Relay environment is not configured"
      });
    }

    const map = typeof req.query.map === "string"
      ? req.query.map
      : "";

    const playersRaw = typeof req.query.players === "string"
      ? req.query.players
      : "0";

    const gameTime = typeof req.query.time === "string"
      ? req.query.time
      : "";

    const code = typeof req.query.code === "string"
      ? req.query.code
      : "";

    const weather = typeof req.query.weather === "string"
      ? req.query.weather
      : "غير معروف";

    if (!/^\d{10}$/.test(code)) {
      return res.status(400).json({
        ok: false,
        error: "code must contain exactly 10 digits"
      });
    }

    const players = Number.parseInt(playersRaw, 10);

    if (!Number.isFinite(players) || players < 0) {
      return res.status(400).json({
        ok: false,
        error: "players must be a non-negative integer"
      });
    }

    const response = await fetch(
      `${PYTHON_URL.replace(/\/$/, "")}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY
        },
        body: JSON.stringify({
          map,
          players,
          time: gameTime,
          code,
          weather
        })
      }
    );

    const text = await response.text();

    let body;

    try {
      body = JSON.parse(text);
    } catch {
      body = {
        raw: text
      };
    }

    return res.status(response.status).json(body);

  } catch (error) {
    console.error("Relay error:", error);

    return res.status(502).json({
      ok: false,
      error: "Could not reach Python server"
    });
  }
});

module.exports = app;
import express from "express";
import serverless from "serverless-http";
import cors from "cors";

const app = express();

/* ========= CORS ========= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

/* ========= BODY PARSERS ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

/* ========= SAFE FETCH WRAPPER ========= */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    console.error("FETCH ERROR:", url, err);
    return null;
  }
}

/* ========= PLAYERS RELAY ========= */
app.post("/pstatus", async (req, res) => {
  try {
    const name = req.body?.name || "";
    const id = req.body?.id || "";

    if (!name || !id) {
      return res.status(400).json({ error: "missing fields" });
    }

    const params = new URLSearchParams();
    params.append("name", name);
    params.append("id", id);

    const response = await safeFetch("http://fi9.bot-hosting.net:21908/pstatus", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    if (!response) {
      return res.status(502).json({ error: "backend unreachable" });
    }

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("pstatus ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= ANNOUNCEMENT RELAY ========= */
app.post("/set_msg", async (req, res) => {
  try {
    let message = "";

    if (typeof req.body === "string") {
      message = req.body;
    } else {
      message = req.body?.message || "";
    }

    if (!message) {
      return res.status(400).json({ error: "no message" });
    }

    const params = new URLSearchParams();
    params.append("message", message);

    const response = await safeFetch("http://fi9.bot-hosting.net:21908/set_msg", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!response) {
      return res.status(502).json({ error: "backend unreachable" });
    }

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("set_msg ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= GET MSG ========= */
app.get("/msg", async (req, res) => {
  try {
    const response = await safeFetch("http://fi9.bot-hosting.net:21908/msg");

    if (!response) {
      return res.status(502).send("backend unreachable");
    }

    const text = await response.text();
    res.status(200).send(text);

  } catch (err) {
    console.error("msg ERROR:", err);
    res.status(500).send(err.message);
  }
});

/* ========= UPDATE RELAY ========= */
app.post("/update", async (req, res) => {
  try {
    const params = new URLSearchParams();

    if (req.body?.players) params.append("players", req.body.players);
    if (req.body?.time) params.append("time", req.body.time);
    if (req.body?.weather) params.append("weather", req.body.weather);

    const response = await safeFetch("http://fi9.bot-hosting.net:21908/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!response) {
      return res.status(502).json({ error: "backend unreachable" });
    }

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("update ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
export const handler = serverless(app);

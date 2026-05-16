import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import https from "https";

const app = express();

/* ========= SAFE CORS (Vercel friendly) ========= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

/* ❌ احذف app.options بالكامل */

/* ========= BODY ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

/* ========= SAFE POST (no fetch crash) ========= */
function postData(url, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }, res => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => resolve(body));
    });

    req.on("error", err => reject(err));
    req.write(data);
    req.end();
  });
}

/* ========= SET MSG ========= */
app.post("/set_msg", async (req, res) => {
  try {
    const message = req.body?.message || req.body || "";

    if (!message) {
      return res.status(400).json({ error: "no message" });
    }

    const params = new URLSearchParams();
    params.append("message", message);

    await postData(
      "https://fi9.bot-hosting.net:21908/set_msg",
      params.toString()
    );

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("SET_MSG ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= PSTATUS ========= */
app.post("/pstatus", async (req, res) => {
  try {
    const name = req.body?.name || "";
    const id = req.body?.id || "";

    if (!name || !id) {
      return res.status(400).json({ error: "missing" });
    }

    const params = new URLSearchParams();
    params.append("name", name);
    params.append("id", id);

    await postData(
      "https://fi9.bot-hosting.net:21908/pstatus",
      params.toString()
    );

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= MSG GET ========= */
app.get("/msg", async (req, res) => {
  try {
    const data = await fetch("https://fi9.bot-hosting.net:21908/msg");
    const text = await data.text();
    res.status(200).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* ========= UPDATE ========= */
app.post("/update", async (req, res) => {
  try {
    const params = new URLSearchParams();

    if (req.body?.players) params.append("players", req.body.players);
    if (req.body?.time) params.append("time", req.body.time);
    if (req.body?.weather) params.append("weather", req.body.weather);

    await postData(
      "https://fi9.bot-hosting.net:21908/update",
      params.toString()
    );

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
export const handler = serverless(app);

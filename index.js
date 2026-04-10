import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

/* ========= PLAYERS RELAY ========= */

app.post("/pstatus", async (req, res) => {
  try {
    let name = req.body?.name;
    let id = req.body?.id;

    if (!name || !id) {
      return res.status(400).end();
    }

    const params = new URLSearchParams();
    params.append("name", name);
    params.append("id", id);

    await fetch("http://fi9.bot-hosting.net:21908/pstatus", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

/* ========= ANNOUNCEMENT RELAY ========= */

app.post("/set_msg", async (req, res) => {
  try {
    let message = "";

    if (req.body?.message) {
      message = req.body.message;
    } else if (typeof req.body === "string") {
      message = req.body;
    }

    const params = new URLSearchParams();
    params.append("message", message);

    await fetch("http://fi9.bot-hosting.net:21908/set_msg", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    res.end();
  } catch {
    res.status(500).end();
  }
});

app.get("/msg", async (req, res) => {
  try {
    const response = await fetch("http://fi9.bot-hosting.net:21908/msg");
    const text = await response.text();
    res.status(200).send(text);
  } catch {
    res.status(500).end();
  }
});

/* ========= UPDATE RELAY ========= */

app.post("/update", async (req, res) => {
  try {
    const params = new URLSearchParams();

    if (req.body.players) params.append("players", req.body.players);
    if (req.body.time) params.append("time", req.body.time);
    if (req.body.weather) params.append("weather", req.body.weather);

    await fetch("http://fi9.bot-hosting.net:21908/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    res.end();
  } catch {
    res.status(500).end();
  }
});

export default app;
export const handler = serverless(app);

import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

/* ========= PLAYERS RELAY ========= */

let connectedPlayers = []; // هنا نحفظ أسماء اللاعبين المتصلين

// استلام بيانات من البوت (Discord)
app.post("/pstatus", async (req, res) => {
  try {
    let players = "";

    if (req.body?.players) {
      players = req.body.players; // من البوت: players = "Player1\nPlayer2\nPlayer3"
      connectedPlayers = players.split("\n"); // تحديث الذاكرة عند كل تحديث
    } else if (typeof req.body === "string") {
      players = req.body;
      connectedPlayers = players.split("\n");
    }

    // إرسالها للخادم الرئيسي
    const params = new URLSearchParams();
    params.append("players", players);

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

// لو تحب تعرض اللاعبين لأي حد يقدر يطلبهم هنا
app.get("/players", async (req, res) => {
  try {
    res.status(200).send(connectedPlayers.join("\n"));
  } catch {
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

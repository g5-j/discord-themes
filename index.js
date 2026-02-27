import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

let announcementMessage = "";

/* ========== ANNOUNCEMENT ========== */

app.post("/set_msg", (req, res) => {
  let message = "";

  if (req.body?.message) {
    message = req.body.message;
  } else if (typeof req.body === "string") {
    message = req.body;
  }

  if (message.toLowerCase() === "stop") announcementMessage = "";
  else announcementMessage = message;

  res.end();
});

app.get("/msg", (req, res) => {
  res.status(200).send(announcementMessage);
});

/* ========== UPDATE RELAY ========== */

app.post("/update", async (req, res) => {
  try {
    let players = req.body.players;
    let time = req.body.time;
    let weather = req.body.weather;

    if (weather) {
      if (weather.toLowerCase() === "clear") weather = "مشمس";
      else if (weather.toLowerCase() === "rain") weather = "ممطر";
    }

    if (time) {
      const [hoursStr, minutes] = time.split(":");
      let hours = parseInt(hoursStr, 10);
      let period = "AM";
      if (hours === 0) hours = 12;
      else if (hours >= 12) {
        period = "PM";
        if (hours > 12) hours -= 12;
      }
      time = `${hours}:${minutes} ${period}`;
    }

    const params = new URLSearchParams();
    if (players) params.append("players", players);
    if (time) params.append("time", time);
    if (weather) params.append("weather", weather);

    await fetch("http://fi9.bot-hosting.net:21908/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    res.end();
  } catch (err) {
    res.status(500).end();
  }
});

export default app;
export const handler = serverless(app);
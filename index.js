const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// بيانات السيرفر
let sharedData = {
  map: "TIGEROZ ROLEPLAY",
  players: 0,
  time: "00:00",
  weather: "غير معروف"
};

let lastUpdateTime = Date.now();

// رسالة الإعلان
let announcementMessage = null;
let announcementTime = 0;

// تحديث بيانات السيرفر
app.post("/update", (req, res) => {
  const data = req.body;

  if (!data) return res.status(400).json({ error: "No JSON received" });

  if (data.players !== undefined) sharedData.players = Number(data.players) || 0;
  if (data.time !== undefined) sharedData.time = data.time;
  if (data.weather !== undefined) sharedData.weather = data.weather;

  lastUpdateTime = Date.now();

  return res.json({ status: "updated", data: sharedData });
});

// قراءة بيانات السيرفر
app.get("/", (req, res) => {
  return res.json({ data: sharedData, last_update: lastUpdateTime });
});

// حفظ رسالة الإعلان
app.post("/set_msg", (req, res) => {
  const data = req.body;
  if (!data || !data.message) return res.status(400).json({ error: "No message provided" });

  announcementMessage = data.message;
  announcementTime = Date.now();

  return res.json({ status: "announcement saved" });
});

// قراءة رسالة الإعلان (تنتهي بعد 7 ثواني)
app.get("/msg", (req, res) => {
  if (announcementMessage && (Date.now() - announcementTime <= 7000)) {
    return res.json({ message: announcementMessage });
  }
  return res.json({ message: null });
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
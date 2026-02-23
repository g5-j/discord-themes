// index.js
import express from "express";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

let announcementMessage = null;
let announcementTime = 0;

app.post("/set_msg", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message" });

  announcementMessage = message;
  announcementTime = Date.now();
  res.status(200).json({ status: "announcement saved" });
});

app.get("/msg", (req, res) => {
  if (announcementMessage && (Date.now() - announcementTime <= 7000)) {
    return res.status(200).json({ message: announcementMessage });
  }
  res.status(200).json({ message: null });
});

export default app;
export const handler = serverless(app);
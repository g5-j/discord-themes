import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

let announcementMessage = "";

app.post("/set_msg", (req, res) => {
  let message = "";

  if (req.body?.message) message = req.body.message;
  else if (req.body && typeof req.body === "object") message = Object.values(req.body)[0] || "";
  else if (typeof req.body === "string") message = req.body;

  if (message.toLowerCase() === "stop") announcementMessage = "";
  else announcementMessage = message;

  res.end();
});

app.get("/msg", (req, res) => {
  res.status(200).send(announcementMessage);
});

export default app;
export const handler = serverless(app);
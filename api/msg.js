import { announcementMessage, announcementTime } from "./set_msg";

export default function handler(req, res) {
  if (req.method === "GET") {
    if (announcementMessage && (Date.now() - announcementTime <= 7000)) {
      return res.status(200).json({ message: announcementMessage });
    }
    return res.status(200).json({ message: null });
  }
  res.status(405).json({ error: "Method not allowed" });
}
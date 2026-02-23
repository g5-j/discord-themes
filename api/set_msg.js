let announcementMessage = null;
let announcementTime = 0;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = await req.json();
    if (!body.message) return res.status(400).json({ error: "No message provided" });
    announcementMessage = body.message;
    announcementTime = Date.now();
    return res.status(200).json({ status: "announcement saved" });
  }
  res.status(405).json({ error: "Method not allowed" });
}

export { announcementMessage, announcementTime };
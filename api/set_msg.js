let announcementMessage = null;
let announcementTime = 0;

export default function handler(req, res) {
    if (req.method === "POST") {
        const data = req.body;
        if (!data || !data.message) return res.status(400).json({ error: "No message provided" });

        announcementMessage = data.message;
        announcementTime = Date.now();

        return res.status(200).json({ status: "announcement saved" });
    }
    res.status(405).json({ error: "Method not allowed" });
}

export { announcementMessage, announcementTime };
// index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// إعلان مؤقت
let announcementMessage = null;
let announcementTime = 0;

// حفظ إعلان مؤقت
app.post("/set_msg", (req, res) => {
    const data = req.body;
    if (!data || !data.message) return res.status(400).json({ error: "No message provided" });

    announcementMessage = data.message;
    announcementTime = Date.now();

    return res.json({ status: "announcement saved" });
});

// الحصول على الإعلان (إذا ما تعدت 7 ثواني)
app.get("/msg", (req, res) => {
    if (announcementMessage && (Date.now() - announcementTime <= 7000)) {
        return res.json({ message: announcementMessage });
    }
    return res.json({ message: null });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 21908;
app.listen(PORT, () => {
    console.log(`Announcement server running on port ${PORT}`);
});
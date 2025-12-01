// -> Simple Express server used ONLY to bypass CORS for RSS feeds

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors()); // -> allow your React app to call this backend

// -> This route fetches the RSS feed from the server side
app.get("/rss", async (req, res) => {
  try {
    const rssUrl = "https://www.medicalnewstoday.com/rss"; 
    const result = await fetch(rssUrl);
    const xml = await result.text();

    // -> Tell browser that we're returning XML
    res.set("Content-Type", "application/xml");
    res.send(xml);
    console.log("server is running");
  } catch (err) {
    console.error("RSS server error:", err);
    res.status(500).json({ error: "RSS fetch failed" });
  }
});

// -> Start server on port 5001
app.listen(5001, () => {
  console.log("RSS server running on http://localhost:5001/rss");
});

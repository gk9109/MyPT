import React, { useEffect, useState } from "react";
import DailyArticle from "../../componenets/clients/DailyArticle";
import SavedArticles from "../../componenets/clients/SavedArticles"; 
import { useAuth } from "../../firebase/AuthContext";  
import Loader from "../../componenets/shared/Loader";

// -> NOTE ABOUT RSS FEEDS:
//    RSS is not a "real API". It's just a public XML file that websites publish.
//    You can't fetch it directly from the browser because RSS servers don't allow CORS.
//    That's why we use AllOrigins, which simply fetches the XML for us and returns it as JSON.
//    So the logic is: fetch RSS through proxy -> parse XML -> extract articles.
//    It works exactly like a normal API in React, just a different data format (XML instead of JSON).

export default function ArticlePage() {
  const [articles, setArticles] = useState([]);      // -> holds all parsed RSS articles
  const [todayArticle, setTodayArticle] = useState(null); // -> the article for the current day
  const [loading, setLoading] = useState(true);      // -> simple loading state
  
  // -> Fetch RSS feed once when page loads
  useEffect(() => {
    const fetchRSS = async () => {
      try {
        // -> Healthline RSS feed URL
        const rssUrl = "https://rssfeeds.webmd.com/rss/rss.aspx?rssSource=RSS_PUBLIC";

        // -> Using AllOrigins to bypass CORS (browser blocks RSS otherwise)
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          rssUrl
        )}`;

        const res = await fetch(proxyUrl);
        const data = await res.json();
        console.log("data usin raw:", data);

        // -> 'contents' is an XML string returned inside JSON
        const xmlString = data.contents;

        // -> Parse XML string into actual DOM nodes we can navigate
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");

        // -> Extract all <item> elements from RSS feed
        const items = Array.from(xml.querySelectorAll("item"));

        // -> Convert each <item> node into a simple JS object
        const parsedArticles = items.map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          description:
            item.querySelector("description")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
        }));

        setArticles(parsedArticles);

        // -----------------------------
        // -> Pick today's article using day-of-year index
        // -----------------------------

        const now = new Date();

        // -> Day-of-year (1–365) calculation
        const dayOfYear = Math.floor(
          (now - new Date(now.getFullYear(), 0, 0)) / 86400000
        );

        // -> Use modulo (%) so we never go out of array bounds
        const index = dayOfYear % parsedArticles.length;

        setTodayArticle(parsedArticles[index]);
      } catch (error) {
        console.log("RSS fetch error ->", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, []);

  return (
    <div id="ArticlePage">
      {loading && <Loader />}

      {!loading && todayArticle && (
        <DailyArticle article={todayArticle} />
      )}

      {/* 
        SavedArticles tab -> 
        Not used right now, but ready for future use if you add saving logic 
      */}
      {/* <SavedArticles /> */}
    </div>
  );
}

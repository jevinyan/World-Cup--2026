import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get local data paths
const getPaths = () => {
  const rootDir = process.cwd();
  const devPath = path.join(rootDir, "public", "api", "worldcup.json");
  const prodPath = path.join(rootDir, "dist", "api", "worldcup.json");
  return { devPath, prodPath };
};

// GET endpoint to retrieve the world cup data
app.get("/api/worldcup.json", (req, res) => {
  const { devPath, prodPath } = getPaths();
  let dataPath = devPath;

  // Prefer prod path if running in production and file exists
  if (process.env.NODE_ENV === "production" && fs.existsSync(prodPath)) {
    dataPath = prodPath;
  } else if (!fs.existsSync(devPath) && fs.existsSync(prodPath)) {
    dataPath = prodPath;
  }

  try {
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, "utf-8");
      return res.json(JSON.parse(content));
    } else {
      // Fallback fallback if file is somehow missing
      return res.status(404).json({ error: "WorldCup data file not found" });
    }
  } catch (err: any) {
    console.error("Error reading worldcup.json:", err);
    return res.status(500).json({ error: "Failed to read database file" });
  }
});

// POST endpoint to invoke the Gemini crawler/scraper
app.post("/api/scrape-data", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in the server environment. Please configure it in Settings > Secrets."
    });
  }

  const { devPath, prodPath } = getPaths();
  let currentData = { matches: [], scorers: [], news: [] };

  try {
    let readPath = devPath;
    if (fs.existsSync(prodPath)) {
      readPath = prodPath;
    } else if (fs.existsSync(devPath)) {
      readPath = devPath;
    }

    if (fs.existsSync(readPath)) {
      currentData = JSON.parse(fs.readFileSync(readPath, "utf-8"));
    }
  } catch (e) {
    console.warn("Failed to read current data, starting fresh.", e);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `You are an intelligent real-time sports web crawler and scraper specializing in the 2026 FIFA World Cup. 
Today's local date is June 25, 2026. 
Your task is to search the web using your Search tool for any actual news, schedules, match scores, scorers, or updates of the 2026 FIFA World Cup (or qualifiers/teams if the main tournament hasn't started yet relative to the search index).
If there is no direct real-time live data for this exact date on the web, you must intelligently simulate the next step of the tournament based on the current state provided to make the data feel alive, real-time, and dynamic.

Current World Cup state:
${JSON.stringify(currentData, null, 2)}

Instructions:
1. Update any match that is currently "Live" to "Completed", generate a realistic final score, update the 'events' list (with goals, yellow cards, etc. using players from the actual squads), and populate the 'stats' object.
2. Advance/Schedule some other matches or mark next round matches as "Live" or "Scheduled".
3. Update the 'scorers' array: increment players' goals, assists, and matchesPlayed based on the newly completed matches.
4. Add 1-2 brand new, detailed, exciting, and highly professional news stories in Chinese to the 'news' array. news should have realistic details. Make sure news ids are unique (e.g., 'news-3', 'news-4', etc.).
5. Make sure all IDs are unique and existing format is perfectly preserved.

Return the fully updated, complete JSON structure containing:
- matches: Array of matches
- scorers: Array of scorers
- news: Array of news

Ensure that your output is a valid JSON.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
    } catch (searchError: any) {
      console.warn("⚠️ Google Search Grounding failed (likely due to free tier quota/billing limitations):", searchError.message || searchError);
      console.log("🔄 Falling back to AI simulation mode without search grounding...");
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt + "\n\nNote: Google Search tool is currently unavailable. Please generate a highly realistic and detailed simulation/progression of the tournament based purely on your knowledge and the current state.",
        config: {
          responseMimeType: "application/json"
        }
      });
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini API");
    }

    const scrapedData = JSON.parse(responseText);

    // Validate the scraped data contains the main keys
    if (!scrapedData.matches || !scrapedData.scorers || !scrapedData.news) {
      throw new Error("Scraped data is missing matches, scorers, or news fields");
    }

    // Save the scraped data back to files
    try {
      // Ensure directories exist
      const devDir = path.dirname(devPath);
      if (!fs.existsSync(devDir)) {
        fs.mkdirSync(devDir, { recursive: true });
      }
      fs.writeFileSync(devPath, JSON.stringify(scrapedData, null, 2), "utf-8");
      console.log("Successfully wrote crawled data to dev path:", devPath);

      // Write to prod path if it exists or if we are in production
      const prodDir = path.dirname(prodPath);
      if (fs.existsSync(prodDir) || process.env.NODE_ENV === "production") {
        if (!fs.existsSync(prodDir)) {
          fs.mkdirSync(prodDir, { recursive: true });
        }
        fs.writeFileSync(prodPath, JSON.stringify(scrapedData, null, 2), "utf-8");
        console.log("Successfully wrote crawled data to prod path:", prodPath);
      }
    } catch (writeErr) {
      console.error("Error writing updated worldcup.json:", writeErr);
    }

    return res.json({
      success: true,
      message: "Scraping and synchronization complete!",
      data: scrapedData
    });

  } catch (err: any) {
    console.error("Gemini Scraper Error:", err);
    return res.status(500).json({
      error: "AI scraping failed",
      details: err.message || err
    });
  }
});

// Start server setup
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

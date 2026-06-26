import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
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
// Automatically refreshes from GitHub if cache is stale
app.get("/api/worldcup.json", async (req, res) => {
  const { devPath, prodPath } = getPaths();
  let dataPath = devPath;

  // Prefer prod path if running in production and file exists
  if (process.env.NODE_ENV === "production" && fs.existsSync(prodPath)) {
    dataPath = prodPath;
  } else if (!fs.existsSync(devPath) && fs.existsSync(prodPath)) {
    dataPath = prodPath;
  }

  // Check if local data is stale (older than 5 minutes) - refresh from GitHub
  let needsRefresh = true;
  try {
    if (fs.existsSync(dataPath)) {
      const stats = fs.statSync(dataPath);
      const ageMs = Date.now() - stats.mtimeMs;
      needsRefresh = ageMs > CACHE_TTL_MS;
    }
  } catch (e) {
    needsRefresh = true;
  }

  if (needsRefresh) {
    console.log("🔄 本地数据已过期，正在从 GitHub 刷新...");
    const ghResult = await fetch26WorldCupData();
    if (ghResult.success && ghResult.data) {
      const ghData = ghResult.data as any;
      if (ghData.matches && ghData.matches.length > 0) {
        // Read existing data to preserve scorers/news
        let existingData = { matches: [], scorers: [], news: [] };
        try {
          if (fs.existsSync(dataPath)) {
            existingData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
          }
        } catch (e) { /* ignore */ }

        const convertedMatches = ghData.matches.map((m: any) => convert26WcMatch(m, ghData.teams || {}));
        const mergedData = { ...existingData, matches: convertedMatches };

        try {
          const dir = path.dirname(dataPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(dataPath, JSON.stringify(mergedData, null, 2), "utf-8");
          console.log(`✅ 已从 GitHub 更新 ${convertedMatches.length} 场比赛数据`);
        } catch (writeErr) {
          console.error("写入数据失败:", writeErr);
        }

        return res.json(mergedData);
      }
    }
    console.warn("⚠️ 从 GitHub 刷新失败，返回本地缓存数据");
  }

  try {
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, "utf-8");
      return res.json(JSON.parse(content));
    } else {
      return res.status(404).json({ error: "WorldCup data file not found" });
    }
  } catch (err: any) {
    console.error("Error reading worldcup.json:", err);
    return res.status(500).json({ error: "Failed to read database file" });
  }
});

// ============================================
// GitHub Open Source Data (26worldcup)
// - Source: FIFA Official API, scraped every 15 minutes
// - Free, no API key required, real match data
// ============================================
const GITHUB_26WC_BASE = "https://raw.githubusercontent.com/26worldcup/26worldcup.github.io/main/public/data";

type ApiHealthResult = { success: boolean; data?: unknown; error?: string; ts: number };
const apiCache: { lastFetch: ApiHealthResult } = { lastFetch: { success: false, ts: 0 } };
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const fetch26WorldCupData = async (): Promise<ApiHealthResult> => {
  const now = Date.now();
  if (apiCache.lastFetch.ts && now - apiCache.lastFetch.ts < CACHE_TTL_MS) {
    return apiCache.lastFetch;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    // Fetch matches + teams in parallel
    const [matchesRes, teamsRes] = await Promise.all([
      fetch(`${GITHUB_26WC_BASE}/matches.json`, { signal: controller.signal }),
      fetch(`${GITHUB_26WC_BASE}/teams.json`, { signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (!matchesRes.ok || !teamsRes.ok) {
      const err = `HTTP ${matchesRes.status} / ${teamsRes.status}`;
      console.warn(`⚠️ 26worldcup GitHub fetch failed: ${err}`);
      apiCache.lastFetch = { success: false, error: err, ts: now };
      return apiCache.lastFetch;
    }

    const matchesData = await matchesRes.json();
    const teamsData = await teamsRes.json();

    console.log(`✅ 26worldcup GitHub data loaded: ${matchesData.matches?.length || 0} matches, ${Object.keys(teamsData.teams || {}).length} teams`);

    const result = {
      matches: matchesData.matches || [],
      teams: teamsData.teams || {},
    };

    apiCache.lastFetch = { success: true, data: result, ts: now };
    return apiCache.lastFetch;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn("⚠️ 26worldcup GitHub fetch failed:", err.message || err);
    apiCache.lastFetch = { success: false, error: err.message || err, ts: now };
    return apiCache.lastFetch;
  }
};

// Convert 26worldcup match format to internal Match format (matches types.ts exactly)
const convert26WcMatch = (match: any, teamsMap: Record<string, any>) => {
  const statusMap: Record<string, 'Scheduled' | 'Live' | 'Completed'> = {
    "finished": "Completed",
    "live": "Live",
    "upcoming": "Scheduled",
    "postponed": "Scheduled",
    "suspended": "Live",
  };

  const stageMap: Record<string, Match['stage']> = {
    "group": "Group",
    "r32": "Round of 32",
    "r16": "Round of 16",
    "qf": "Quarterfinal",
    "sf": "Semifinal",
    "third": "Third Place",
    "final": "Final",
  };

  const homeCode = match.home?.code || "";
  const awayCode = match.away?.code || "";
  const homeTeam = teamsMap[homeCode] || {};
  const awayTeam = teamsMap[awayCode] || {};

  // Parse date/time - convert UTC to local date string
  const dateObj = new Date(match.date || "");
  const dateStr = dateObj.toISOString().split("T")[0];
  const timeStr = dateObj.toISOString().split("T")[1]?.slice(0, 5) || "12:00";

  // Parse minute from "time" field like "67'" or "HT" or "FT"
  let minute: number | undefined = undefined;
  const timeStrRaw = match.time || "";
  const minMatch = timeStrRaw.match(/(\d+)/);
  if (minMatch && match.status === "live") {
    minute = parseInt(minMatch[1], 10);
  }

  const stage: Match['stage'] = stageMap[match.stage] || "Group";

  return {
    id: `match-${match.id || match.n || Math.random()}`,
    stage: stage,
    group: match.group || undefined,
    homeTeamId: homeCode,
    awayTeamId: awayCode,
    homeScore: match.home?.score ?? 0,
    awayScore: match.away?.score ?? 0,
    status: statusMap[match.status] || "Scheduled",
    minute: minute,
    date: dateStr,
    time: timeStr,
    stadium: "",
    city: "",
    events: [],
    stats: {
      possession: [50, 50] as [number, number],
      shots: [10, 10] as [number, number],
      shotsOnTarget: [4, 4] as [number, number],
      fouls: [12, 12] as [number, number],
      corners: [5, 5] as [number, number],
      yellowCards: [1, 1] as [number, number],
      redCards: [0, 0] as [number, number],
    }
  };
};

// Helper to fetch from GitHub and return response
async function fetchAndReturnGithubData(res: express.Response) {
  const result = await fetch26WorldCupData();

  if (result.success && result.data) {
    const ghData = result.data as any;
    const convertedMatches = ghData.matches.map((m: any) => convert26WcMatch(m, ghData.teams || {}));
    return res.json({ matches: convertedMatches, scorers: [], news: [] });
  }

  return res.status(503).json({ 
    error: "无法从 GitHub 获取数据，请稍后重试",
    details: result.error 
  });
}

// POST endpoint to sync data from GitHub
app.post("/api/scrape-data", async (req, res) => {
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

  // Fetch from GitHub (free, no API key)
  console.log("🔍 正在从 26worldcup GitHub (FIFA 官方 API) 获取数据...");
  const ghResult = await fetch26WorldCupData();

  if (ghResult.success && ghResult.data) {
    const ghData = ghResult.data as any;
    if (ghData.matches && ghData.matches.length > 0) {
      console.log(`✅ 成功获取 ${ghData.matches.length} 场比赛数据！`);

      const convertedMatches = ghData.matches.map((m: any) => convert26WcMatch(m, ghData.teams || {}));

      const mergedData = {
        ...currentData,
        matches: convertedMatches,
      };

      // Save merged data
      try {
        const devDir = path.dirname(devPath);
        if (!fs.existsSync(devDir)) {
          fs.mkdirSync(devDir, { recursive: true });
        }
        fs.writeFileSync(devPath, JSON.stringify(mergedData, null, 2), "utf-8");
        console.log("✅ 数据已保存至:", devPath);
      } catch (writeErr) {
        console.error("Error writing worldcup.json:", writeErr);
      }

      return res.json({
        success: true,
        message: "实时数据已从 FIFA 官方 API 同步成功！",
        source: "26worldcup-github (FIFA Official API)",
        matchesFound: ghData.matches.length,
        data: mergedData
      });
    }
  }

  // GitHub fetch failed
  return res.status(503).json({
    success: false,
    error: "无法从 GitHub 获取数据",
    details: ghResult.error || "Unknown error",
    hint: "请检查网络连接，或稍后重试。数据源来自 https://github.com/26worldcup/26worldcup.github.io"
  });
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
    
    // SPA fallback - serve index.html for all unmatched routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 数据源: 26worldcup GitHub (FIFA 官方 API, 免费, 每15分钟更新)`);
    console.log(`🔗 数据地址: ${GITHUB_26WC_BASE}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup failed:", err);
  process.exit(1);
});
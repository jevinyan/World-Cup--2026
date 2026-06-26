import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import Parser from "rss-parser";

dotenv.config();

// Match interface (matches src/types.ts)
interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury';
  teamId: string;
  playerName: string;
  detail?: string;
}

interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

interface Match {
  id: string;
  stage: 'Group' | 'Round of 32' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
  group?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'Scheduled' | 'Live' | 'Completed';
  minute?: number;
  date: string;
  time: string;
  stadium: string;
  city: string;
  events: MatchEvent[];
  stats: MatchStats;
}

const app = express();
const PORT = 3000;
const rssParser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
});

app.use(express.json({ limit: '10mb' }));

// Helper to get local data paths
const getPaths = () => {
  const rootDir = process.cwd();
  const devPath = path.join(rootDir, "public", "api", "worldcup.json");
  const prodPath = path.join(rootDir, "dist", "api", "worldcup.json");
  return { devPath, prodPath };
};

// GET endpoint to retrieve the world cup data
// Primary: GitHub (26worldcup) -> Fallback: ESPN API -> Local cache
app.get("/api/worldcup.json", async (req, res) => {
  const { devPath, prodPath } = getPaths();
  let dataPath = devPath;

  if (process.env.NODE_ENV === "production" && fs.existsSync(prodPath)) {
    dataPath = prodPath;
  } else if (!fs.existsSync(devPath) && fs.existsSync(prodPath)) {
    dataPath = prodPath;
  }

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
    console.log("🔄 本地数据已过期，正在从 GitHub (主力) 刷新...");
    const ghResult = await fetch26WorldCupData();
    if (ghResult.success && ghResult.data) {
      const ghData = ghResult.data as any;
      if (ghData.matches && ghData.matches.length > 0) {
        let existingData = { matches: [], scorers: [], news: [] };
        try {
          if (fs.existsSync(dataPath)) {
            existingData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
          }
        } catch (e) { /* ignore */ }

        const convertedMatches = ghData.matches.map((m: any) => convert26WcMatch(m, ghData.teams || {}));
        const mergedData = { ...existingData, matches: convertedMatches, dataSource: "github-26worldcup" };

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

    console.warn("⚠️ GitHub 刷新失败，尝试 ESPN API (备用)...");
    const espnResult = await fetchEspnWorldCupData();
    if (espnResult.success && espnResult.matches && espnResult.matches.length > 0) {
      let existingData = { matches: [], scorers: [], news: [] };
      try {
        if (fs.existsSync(dataPath)) {
          existingData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        }
      } catch (e) { /* ignore */ }

      const convertedMatches = espnResult.matches.map((m: any) => convertEspnMatch(m));
      const mergedData = { ...existingData, matches: convertedMatches, dataSource: "espn" };

      try {
        const dir = path.dirname(dataPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(mergedData, null, 2), "utf-8");
        console.log(`✅ 已从 ESPN 更新 ${convertedMatches.length} 场比赛数据（备用源）`);
      } catch (writeErr) {
        console.error("写入数据失败:", writeErr);
      }

      return res.json(mergedData);
    }

    console.warn("⚠️ GitHub 和 ESPN 均失败，返回本地缓存数据");
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
// ESPN API (FIFA World Cup) - Backup Data Source
// - Free, no API key required
// - League ID: fifa.world
// - Used as fallback when GitHub data is unavailable
// ============================================
const ESPN_WORLD_CUP_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const ESPN_TEAMS_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams";

type EspnApiResult = { success: boolean; matches?: any[]; teams?: Record<string, any>; error?: string; ts: number };
const espnCache: { lastFetch: EspnApiResult } = { lastFetch: { success: false, ts: 0 } };
const ESPN_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const fetchEspnWorldCupData = async (): Promise<EspnApiResult> => {
  const now = Date.now();
  if (espnCache.lastFetch.ts && now - espnCache.lastFetch.ts < ESPN_CACHE_TTL_MS) {
    return espnCache.lastFetch;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const [scoreboardRes, teamsRes] = await Promise.all([
      fetch(ESPN_WORLD_CUP_URL, { signal: controller.signal }),
      fetch(ESPN_TEAMS_URL, { signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (!scoreboardRes.ok) {
      const err = `Scoreboard HTTP ${scoreboardRes.status}`;
      console.warn(`⚠️ ESPN scoreboard fetch failed: ${err}`);
      espnCache.lastFetch = { success: false, error: err, ts: now };
      return espnCache.lastFetch;
    }

    const scoreboardData: any = await scoreboardRes.json();
    const espnMatches = scoreboardData.events || [];

    let teamsMap: Record<string, any> = {};
    if (teamsRes.ok) {
      const teamsData: any = await teamsRes.json();
      const sports = teamsData.sports || [];
      for (const sport of sports) {
        for (const league of sport.leagues || []) {
          for (const t of league.teams || []) {
            const team = t.team || t;
            teamsMap[team.abbreviation] = {
              id: team.id,
              name: team.displayName,
              code: team.abbreviation,
              logo: team.logos?.[0]?.href || '',
            };
          }
        }
      }
    }

    console.log(`✅ ESPN data loaded: ${espnMatches.length} matches, ${Object.keys(teamsMap).length} teams`);

    espnCache.lastFetch = { success: true, matches: espnMatches, teams: teamsMap, ts: now };
    return espnCache.lastFetch;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn("⚠️ ESPN fetch failed:", err.message || err);
    espnCache.lastFetch = { success: false, error: err.message || err, ts: now };
    return espnCache.lastFetch;
  }
};

const convertEspnMatch = (event: any): Match => {
  const competition = event.competitions?.[0] || {};
  const competitors = competition.competitors || [];
  const homeTeam = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
  const awayTeam = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

  const statusState = event.status?.type?.state || '';
  let status: 'Scheduled' | 'Live' | 'Completed' = 'Scheduled';
  if (statusState === 'pre') status = 'Scheduled';
  else if (statusState === 'in') status = 'Live';
  else if (statusState === 'post') status = 'Completed';
  else status = 'Scheduled';

  let minute: number | undefined = undefined;
  if (status === 'Live') {
    const displayClock = event.status?.displayClock || '';
    const minMatch = displayClock.match(/(\d+)/);
    if (minMatch) minute = parseInt(minMatch[1], 10);
  }

  const dateObj = new Date(event.date || '');
  const dateStr = dateObj.toISOString().split('T')[0];
  const timeStr = dateObj.toISOString().split('T')[1]?.slice(0, 5) || '12:00';

  const venue = competition.venue || {};
  const stadium = venue.fullName || '';
  const city = venue.address?.city ? `${venue.address.city}${venue.address.state ? ', ' + venue.address.state : ''}` : '';

  const homeCode = homeTeam?.team?.abbreviation || '';
  const awayCode = awayTeam?.team?.abbreviation || '';
  const homeScore = parseInt(homeTeam?.score || '0', 10);
  const awayScore = parseInt(awayTeam?.score || '0', 10);

  const stage: Match['stage'] = 'Group';
  let group: string | undefined = undefined;
  const notes = competition.notes || [];
  for (const note of notes) {
    if (note.type === 'group' && note.headline) {
      group = note.headline.replace('Group ', '').trim();
    }
  }

  return {
    id: `espn-${event.id || Math.random()}`,
    stage,
    group,
    homeTeamId: homeCode,
    awayTeamId: awayCode,
    homeScore: isNaN(homeScore) ? 0 : homeScore,
    awayScore: isNaN(awayScore) ? 0 : awayScore,
    status,
    minute,
    date: dateStr,
    time: timeStr,
    stadium,
    city,
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

// ============================================
// GitHub Open Source Data (26worldcup) - Primary Data Source
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

// ============================================
// RSS News Feed Configuration (Football/Soccer)
// - Multiple sources for redundancy
// - Free, no API key required
// ============================================
const RSS_FEEDS = [
  { name: "BBC Sport Football", url: "http://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
  { name: "ESPN FC", url: "https://www.espn.com/espn/rss/soccer/news", source: "ESPN FC" },
  { name: "Goal.com", url: "https://www.goal.com/en-us/rss", source: "Goal.com" },
  { name: "Sky Sports", url: "https://www.skysports.com/rss/0,20514,11095,00.xml", source: "Sky Sports" },
];

const newsCache: { data: any[]; ts: number } = { data: [], ts: 0 };
const NEWS_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

const getNewsTags = (title: string): '战报' | '爆料' | '突发' | '伤停' | '分析' => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('goal') || lowerTitle.includes('score') || lowerTitle.includes('win') || lowerTitle.includes('beat')) return '战报';
  if (lowerTitle.includes('transfer') || lowerTitle.includes('sign') || lowerTitle.includes('deal')) return '爆料';
  if (lowerTitle.includes('breaking') || lowerTitle.includes('latest') || lowerTitle.includes('now')) return '突发';
  if (lowerTitle.includes('injury') || lowerTitle.includes('injured') || lowerTitle.includes('suspended')) return '伤停';
  if (lowerTitle.includes('analysis') || lowerTitle.includes('preview') || lowerTitle.includes('tactics')) return '分析';
  return '分析';
};

const formatTimeAgo = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  } catch {
    return '未知时间';
  }
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

const fetchNewsFromRSS = async (): Promise<any[]> => {
  const now = Date.now();
  if (newsCache.ts && now - newsCache.ts < NEWS_CACHE_TTL_MS && newsCache.data.length > 0) {
    return newsCache.data;
  }

  console.log("🔄 正在从 RSS 源获取最新体育新闻...");
  const allNews: any[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
      });
      
      const parsed = await Promise.race([
        rssParser.parseURL(feed.url),
        timeoutPromise,
      ]) as any;

      if (parsed.items && parsed.items.length > 0) {
        const feedNews = parsed.items.slice(0, 5).map((item: any) => ({
          id: `news-${feed.name}-${item.guid || item.link?.split('/').pop() || Date.now()}`,
          title: item.title || '',
          summary: stripHtml(item.summary || item.description || '').slice(0, 150),
          content: stripHtml(item.content || item.description || '').slice(0, 300),
          time: formatTimeAgo(item.pubDate || ''),
          source: feed.source,
          tag: getNewsTags(item.title || ''),
          image: (item.enclosure?.url || item['media:content']?.[0]?.$?.url || '').replace(/^http:/, 'https:'),
        }));
        allNews.push(...feedNews);
        console.log(`✅ ${feed.name}: ${feedNews.length} 条新闻`);
      }
    } catch (err: any) {
      console.warn(`⚠️ ${feed.name} RSS 获取失败: ${err.message}`);
    }
  }

  // Sort by time (newest first) and deduplicate
  allNews.sort((a, b) => {
    const timeMap: Record<string, number> = { '刚刚': 0 };
    const aMins = parseInt(a.time) || 0;
    const bMins = parseInt(b.time) || 0;
    return bMins - aMins || Math.random();
  });

  newsCache.data = allNews.slice(0, 15);
  newsCache.ts = now;
  return newsCache.data;
};

// GET endpoint for real-time news from RSS feeds
app.get("/api/news", async (req, res) => {
  try {
    const news = await fetchNewsFromRSS();
    return res.json({ news, source: "RSS Feeds (BBC Sport, ESPN, Goal.com, Sky Sports)", count: news.length });
  } catch (err: any) {
    console.error("Error fetching news:", err);
    return res.status(503).json({ news: [], error: "新闻获取失败", count: 0 });
  }
});

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

// POST endpoint to sync data
// Primary: GitHub (26worldcup) -> Fallback: ESPN API
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

  // Primary: Fetch from GitHub (26worldcup)
  console.log("🔍 正在从 26worldcup GitHub (FIFA 官方 API, 主力源) 获取数据...");
  const ghResult = await fetch26WorldCupData();

  if (ghResult.success && ghResult.data) {
    const ghData = ghResult.data as any;
    if (ghData.matches && ghData.matches.length > 0) {
      console.log(`✅ GitHub 主力源成功: ${ghData.matches.length} 场比赛`);

      const convertedMatches = ghData.matches.map((m: any) => convert26WcMatch(m, ghData.teams || {}));

      const mergedData = {
        ...currentData,
        matches: convertedMatches,
        dataSource: "github-26worldcup",
      };

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
        message: "实时数据已从 FIFA 官方 API (GitHub 主力源) 同步成功！",
        source: "26worldcup-github (FIFA Official API, Primary)",
        matchesFound: ghData.matches.length,
        data: mergedData
      });
    }
  }

  // Fallback: ESPN API
  console.warn("⚠️ GitHub 主力源失败，尝试 ESPN API (备用源)...");
  const espnResult = await fetchEspnWorldCupData();

  if (espnResult.success && espnResult.matches && espnResult.matches.length > 0) {
    console.log(`✅ ESPN 备用源成功: ${espnResult.matches.length} 场比赛`);

    const convertedMatches = espnResult.matches.map((m: any) => convertEspnMatch(m));

    const mergedData = {
      ...currentData,
      matches: convertedMatches,
      dataSource: "espn",
    };

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
      message: "实时数据已从 ESPN API (备用源) 同步成功！",
      source: "ESPN API (FIFA World Cup, Backup)",
      matchesFound: espnResult.matches.length,
      data: mergedData
    });
  }

  // Both failed
  return res.status(503).json({
    success: false,
    error: "无法从任何数据源获取数据",
    details: {
      github: ghResult.error || "Unknown error",
      espn: espnResult.error || "Unknown error",
    },
    hint: "请检查网络连接。主力数据源: https://github.com/26worldcup/26worldcup.github.io，备用数据源: ESPN API"
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
    console.log(`📊 主力数据源: 26worldcup GitHub (FIFA 官方 API, 每15分钟更新)`);
    console.log(`🔗 GitHub 地址: ${GITHUB_26WC_BASE}`);
    console.log(`🔄 备用数据源: ESPN API (fifa.world)`);
    console.log(`📰 新闻源: Google News + BBC Sport + ESPN FC + Sky Sports + 网易 + 搜狐`);
  });
}

startServer().catch((err) => {
  console.error("Server startup failed:", err);
  process.exit(1);
});
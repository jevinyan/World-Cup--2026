import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const DATA_PATH = path.join(process.cwd(), "public", "api", "worldcup.json");

// ============================================
// GitHub Open Source Data (26worldcup)
// - Source: FIFA Official API, scraped every 15 minutes
// - Free, no API key required
// ============================================
const GITHUB_26WC_BASE = "https://raw.githubusercontent.com/26worldcup/26worldcup.github.io/main/public/data";

async function fetch26WorldCup() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const [matchesRes, teamsRes] = await Promise.all([
      fetch(`${GITHUB_26WC_BASE}/matches.json`, { signal: controller.signal }),
      fetch(`${GITHUB_26WC_BASE}/teams.json`, { signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (!matchesRes.ok || !teamsRes.ok) {
      console.warn(`⚠️ 26worldcup GitHub fetch failed: HTTP ${matchesRes.status} / ${teamsRes.status}`);
      return null;
    }

    const matchesData = await matchesRes.json();
    const teamsData = await teamsRes.json();

    if (!matchesData.matches || matchesData.matches.length === 0) {
      console.warn("⚠️ 26worldcup GitHub returned no matches");
      return null;
    }

    console.log(`✅ 26worldcup GitHub 数据加载成功: ${matchesData.matches.length} 场比赛, ${Object.keys(teamsData.teams || {}).length} 支球队`);

    const convertedMatches = matchesData.matches.map((match: any) => {
      const homeCode = match.home?.code || "";
      const awayCode = match.away?.code || "";
      const homeTeam = teamsData.teams?.[homeCode] || {};
      const awayTeam = teamsData.teams?.[awayCode] || {};

      const dateObj = new Date(match.date || "");
      const dateStr = dateObj.toISOString().split("T")[0];
      const timeStr = dateObj.toISOString().split("T")[1]?.slice(0, 5) || "12:00";

      let minute: number | null = null;
      const timeStrRaw = match.time || "";
      const minMatch = timeStrRaw.match(/(\d+)/);
      if (minMatch && match.status === "live") {
        minute = parseInt(minMatch[1], 10);
      }

      const statusMap: Record<string, string> = {
        "finished": "Completed",
        "live": "Live",
        "upcoming": "Scheduled",
        "postponed": "Scheduled",
        "suspended": "Live",
      };

      return {
        id: `match-${match.id || match.n || Math.random()}`,
        date: dateStr,
        time: timeStr,
        status: statusMap[match.status] || "Scheduled",
        minute: match.status === "live" ? (minute || 0) : null,
        homeTeamId: homeTeam.fifaId || homeCode,
        homeTeam: homeTeam.name?.zh || homeTeam.name?.en || homeCode,
        awayTeamId: awayTeam.fifaId || awayCode,
        awayTeam: awayTeam.name?.zh || awayTeam.name?.en || awayCode,
        homeScore: match.home?.score ?? 0,
        awayScore: match.away?.score ?? 0,
        homeFlag: homeTeam.flag || `https://api.fifa.com/api/v3/picture/flags-sq-3/${homeCode}`,
        awayFlag: awayTeam.flag || `https://api.fifa.com/api/v3/picture/flags-sq-3/${awayCode}`,
        group: match.group ? `${match.group}组` : (match.stage === "group" ? "小组赛" : "淘汰赛"),
        venue: "",
        events: [],
        stats: {
          possession: { home: 50, away: 50 },
          shots: { home: 0, away: 0 },
          shotsOnTarget: { home: 0, away: 0 },
          corners: { home: 0, away: 0 },
          fouls: { home: 0, away: 0 }
        }
      };
    });

    return convertedMatches;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn("⚠️ 26worldcup GitHub fetch failed:", err.message || err);
    return null;
  }
}

async function main() {
  console.log("🚀 启动 2026 世界杯数据同步系统...");

  // Read existing data
  let currentData = { matches: [], scorers: [], news: [] };
  try {
    if (fs.existsSync(DATA_PATH)) {
      currentData = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    }
  } catch (e) {
    console.warn("读取现有数据失败，将从头开始。");
  }

  // Fetch from GitHub (free, no API key)
  console.log("🔍 正在从 26worldcup GitHub (FIFA 官方 API) 获取数据...");
  const ghMatches = await fetch26WorldCup();

  if (ghMatches && ghMatches.length > 0) {
    const mergedData = {
      ...currentData,
      matches: ghMatches,
    };

    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(mergedData, null, 2), "utf-8");

    console.log(`✅ 成功从 FIFA 官方 API 同步 ${ghMatches.length} 场比赛数据！`);
    console.log(`📝 数据已写入: ${DATA_PATH}`);
    process.exit(0);
  }

  console.error("❌ 无法从 GitHub 获取数据");
  console.log("ℹ️  请检查网络连接，或稍后重试。");
  console.log(`ℹ️  数据源: ${GITHUB_26WC_BASE}`);
  process.exit(1);
}

main();
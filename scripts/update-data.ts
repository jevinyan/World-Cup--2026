import fs from "fs";
import path from "path";

const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const DATA_PATH = path.join(process.cwd(), "public", "api", "worldcup.json");

async function main() {
  try {
    console.log("📡 正在抓取 ESPN 实时赛况...");
    const response = await fetch(ESPN_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const rawData = await response.json();

    const processedData = {
      lastUpdated: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
      matches: (rawData.events || []).map((e: any) => {
        const comp = e.competitions?.[0];
        const competitors = comp?.competitors || [];
        
        // 兼容处理：获取比分，如果没有则显示 0
        const scoreA = competitors[0]?.score?.displayValue || "0";
        const scoreB = competitors[1]?.score?.displayValue || "0";
        
        return {
          id: e.id,
          teamA: competitors[0]?.team?.displayName || "未知",
          teamB: competitors[1]?.team?.displayName || "未知",
          score: `${scoreA}-${scoreB}`,
          // 状态判断：in (比赛中), post (已结束), pre (未开始)
          status: e.status?.type?.state === 'in' ? 'Live' : 'Completed',
          minute: e.status?.type?.shortDetail || e.status?.type?.detail || "FT"
        };
      }),
      scorers: [],
      news: []
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(processedData, null, 2), "utf-8");
    console.log(`✅ 同步完成！当前时间: ${processedData.lastUpdated}`);
  } catch (error) {
    console.error("❌ 同步失败，请检查 API 结构:", error);
    process.exit(1);
  }
}

main();

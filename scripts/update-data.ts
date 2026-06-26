import fs from "fs";
import path from "path";

const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const DATA_PATH = path.join(process.cwd(), "public", "api", "worldcup.json");

async function main() {
  try {
    const response = await fetch(ESPN_URL);
    const rawData = await response.json();

    // 重新校准：深入解析 ESPN 的 API 结构
    const processedData = {
      matches: rawData.events.map((e: any) => {
        const comp = e.competitions?.[0];
        const competitors = comp?.competitors || [];
        
        return {
          id: e.id,
          // 确保字段名与你 types.ts 定义的完全匹配
          teamA: competitors[0]?.team?.displayName || "未知",
          teamB: competitors[1]?.team?.displayName || "未知",
          score: `${competitors[0]?.score || 0}-${competitors[1]?.score || 0}`,
          status: e.status?.type?.state === 'in' ? 'Live' : 'Completed',
          minute: e.status?.type?.detail || "FT"
        };
      }),
      scorers: [],
      news: []
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(processedData, null, 2), "utf-8");
    console.log("✅ 数据已强制校准并同步完成。");
  } catch (error) {
    console.error("❌ 数据转换失败，请检查 API 结构:", error);
    process.exit(1);
  }
}

main();

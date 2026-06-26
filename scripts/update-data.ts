import fs from "fs";
import path from "path";

const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const DATA_PATH = path.join(process.cwd(), "public", "api", "worldcup.json");

async function main() {
  console.log("📡 正在从 ESPN 获取实时数据...");
  try {
    const response = await fetch(ESPN_URL);
    if (!response.ok) throw new Error(`ESPN API 响应错误: ${response.status}`);
    const rawData = await response.json();

    // 转换逻辑：将 ESPN 复杂的原始数据转换为你的前端格式
    const processedData = {
      matches: rawData.events.map((event: any) => ({
        id: event.id,
        teamA: event.competitions[0].competitors[0].team.displayName,
        teamB: event.competitions[0].competitors[1].team.displayName,
        score: event.competitions[0].status.type.state === 'pre' 
               ? "0-0" 
               : `${event.competitions[0].competitors[0].score}-${event.competitions[0].competitors[1].score}`,
        status: event.competitions[0].status.type.state === 'in' ? 'Live' : 'Completed',
        minute: event.competitions[0].status.type.detail // 比如 "65'"
      })),
      scorers: [], // ESPN 射手榜逻辑较复杂，建议先留空或另行处理
      news: []
    };

    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(processedData, null, 2), "utf-8");
    
    console.log("✅ 转换完成，数据已同步到本地。");
  } catch (error: any) {
    console.error("❌ 同步失败:", error.message);
    process.exit(1);
  }
}

main();

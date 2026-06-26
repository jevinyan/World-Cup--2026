import fs from "fs";
import path from "path";

// 目标：将公共接口的数据直接同步到本地
const SOURCE_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const DATA_PATH = path.join(process.cwd(), "public", "api", "worldcup.json");

async function main() {
  console.log("🚀 正在从 ESPN 获取最新赛程...");
  try {
    const response = await fetch(SOURCE_URL);
    if (!response.ok) throw new Error(`HTTP 状态码: ${response.status}`);
    
    const data = await response.json();
    
    // 写入本地文件
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    
    console.log("✅ 数据同步成功！");
  } catch (error: any) {
    console.error("❌ 同步失败:", error.message);
    process.exit(1);
  }
}

main();

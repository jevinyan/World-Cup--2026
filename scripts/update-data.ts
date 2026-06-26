import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai"; // 确保导入的是这个包
import dotenv from "dotenv";

dotenv.config();

const DATA_PATH = path.join(process.cwd(), "public", "api", "worldcup.json");

async function main() {
  console.log("🚀 启动 2026 世界杯数据实时同步系统...");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ 错误: GEMINI_API_KEY 未设置");
    process.exit(1);
  }

  try {
    // 1. 初始化 AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // 建议使用 gemini-1.5-flash 稳定性更好

    const systemPrompt = `你是一个 2026 世界杯实时数据爬虫。请根据当前模拟的世界杯进展生成 matches, scorers, news 数据。
    必须返回如下格式的纯 JSON，不要包含任何 markdown 符号，不要包含说明文字：
    {
      "matches": [],
      "scorers": [],
      "news": []
    }`;

    console.log("🔍 正在请求 Gemini AI 生成最新赛况...");

    // 2. 发起请求
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    // 3. 【关键修改】获取文本的正确方式
    const responseText = result.response.text(); // 这里 text() 是一个函数
    if (!responseText) throw new Error("API 返回内容为空");

    const scrapedData = JSON.parse(responseText.replace(/```json|```/g, "").trim());

    // 4. 写入文件
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(scrapedData, null, 2), "utf-8");
    
    console.log("✅ 成功写入最新赛况至:", DATA_PATH);
    process.exit(0);

  } catch (error: any) {
    // 优雅降级：如果是 429 (配额耗尽)，正常退出，不报错
    if (error.status === 429 || error.message?.includes("429")) {
      console.warn("⚠️ [降级] API 配额已耗尽，已跳过本次更新。");
      process.exit(0); 
    } else {
      console.error("❌ 严重错误:", error.message || error);
      process.exit(1); 
    }
  }
}

main();

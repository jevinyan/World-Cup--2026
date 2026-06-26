import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
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
    const ai = new GoogleGenAI({ apiKey });
    
    // 你的核心 Prompt 逻辑
    const systemPrompt = `你是一个 2026 世界杯实时数据爬虫。请根据当前的比赛状况更新 JSON 数据。
    必须返回如下格式的纯 JSON：
    {
      "matches": [],
      "scorers": [],
      "news": []
    }
    不要包含任何 markdown 符号，不要包含说明文字，只返回 JSON。`;

    console.log("🔍 正在请求 Gemini AI 生成最新赛况...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: { responseMimeType: "application/json" }
    });

    const responseText = response.text();
    if (!responseText) throw new Error("API 返回内容为空");

    // 清洗并解析
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    const scrapedData = JSON.parse(cleanedJson);

    // 写入文件
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(scrapedData, null, 2), "utf-8");
    
    console.log("✅ 成功写入最新赛况至:", DATA_PATH);
    process.exit(0);

  } catch (error: any) {
    // 优雅降级：如果是 429 (配额耗尽)，正常退出流水线，显示为成功
    if (error.status === 429 || error.message?.includes("429")) {
      console.warn("⚠️ [降级] API 配额已耗尽，已自动跳过更新，保留旧数据。");
      process.exit(0); 
    } else {
      console.error("❌ 严重错误:", error.message || error);
      process.exit(1); // 真正的逻辑错误才报错
    }
  }
}

main();

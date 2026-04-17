import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { userId, relationshipId, scenario, myMbti, theirMbti, relationType } = await req.json();

    if (!userId || !relationshipId || !scenario) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let advice = "";
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `你是一个深谙心理学、MBTI 认知功能八维理论和非暴力沟通(NVC)的人际关系教练。
用户的关系档案：
- 用户的 MBTI: ${myMbti || "未知"}
- 对方的 MBTI: ${theirMbti || "未知"}
- 对方的特定身份: ${relationType || "亲友"}

用户触发了沟通场景: "${scenario}"

请为用户输出一份具备心理学深度的、针对此特定场景的沟通与破解指南（约200-300字）。
要求：
1. 语气温和、治愈、富有共情力。
2. 一针见血地指出由于双方 MBTI 性格底色和身份立场的碰撞，可能导致的信息不对称或误解。
3. 给出 1-2 句可以直接开口套用的话术。
注意：排版要干净清晰，分段落，请不要使用过于繁杂的 Markdown 格式，保持纯净阅读体验。`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        advice = response.text || "大脑短路了，无法生成建议，请重试。";
      } catch(e) {
        console.error("Gemini API Error:", e);
        advice = "Gemini AI 接口似乎由于网络波动或 Key 权限问题未能成功返回数据。请检查控制台报错。";
      }
    } else {
      advice = "⚠️ 哎呀！系统检测到尚未配置 GEMINI_API_KEY 环境变量，因此真正的 AI 引擎未能顺利启动。\n\n请在你的项目根目录下的 `.env.local` 文件里写入 GEMINI_API_KEY=你的密钥，然后重启程序，就能立刻获取属于你们之间的灵魂共振指南了！";
    }

    await prisma.actionLog.create({
      data: {
        userId,
        relationshipId,
        scenarioId: scenario, 
        adviceGiven: advice,
      }
    }).catch(e => console.warn("Failed to save action log, skipping."));

    return NextResponse.json({ success: true, advice });
  } catch (error) {
    console.error("Failed to generate advice", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

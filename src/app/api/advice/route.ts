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
        const prompt = `# Role
你是一款名为《Relate 同频》的私人人际关系教练 App 的核心引擎。你深谙长程心理咨询、MBTI 认知功能八维理论和 NVC（非暴力沟通）模型。

# Context
你正在解决一位用户的即时沟通困境。
- 用户的 MBTI: ${myMbti || "未提供"} 
- 对象的 MBTI: ${theirMbti || "未提供"}
- 对象与用户的关系: ${relationType || "未知亲友"}

用户遭遇的具体场景/困境: 
"${scenario}"

# Instructions
作为专业教练，请严格遵循以下结构，为用户提供一份 300 字左右的破冰指南（语气需温和、治愈且富有疗愈感，避免说教和生硬的机器感）：

1. 【核心频率解析】
如果提供了具体的双方 MBTI，请一针见血地指出在这个场景下，双方因“认知功能差异”可能导致的沟通信息不对称。如果缺少 MBTI，请基于特定身份属性剖析底层的隐性心理需求。

2. 【非暴力沟通 (NVC) 建议】
给出具体的行为建议。告诉用户应该先处理什么情绪，再处理什么事实。

3. 【直接可用的开口话术】
提供可以直接复制或开口说出来的“破冰台词”。台词必须极具高情商，能同时照顾对方的安全感并表达用户的真实诉求。

# Constraints
- 如果检测到用户的场景输入完全是不知所云的乱码，或与人际关系毫不相干，请温柔拒绝，并引导用户描述真实的感情困境。
- 请直接输出上述三个结构板块，不需要前置的寒暄，去除不杂乱的 Markdown 符号，保持视觉清爽。`;

        let response;
        let retries = 3;
        let delayMs = 1500;
        
        while (retries > 0) {
          try {
            response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            break; // Success
          } catch (e: any) {
            retries--;
            if (retries === 0) {
              console.error("Gemini API Final Error:", e);
              if (e?.status === 503 || e?.message?.includes('503')) {
                advice = "当前时段连接共振星系的人数过多 (AI 服务器繁忙)，请稍后再尝试联络。";
              } else {
                advice = "Gemini AI 接口似乎由于网络波动或 Key 权限问题未能成功返回数据。请检查控制台报错。";
              }
            } else {
              console.warn(`Gemini API 遭遇波动，准备在 ${delayMs}ms 后进行重试...剩余重试次数: ${retries}`);
              await new Promise(resolve => setTimeout(resolve, delayMs));
              delayMs *= 2; // Exponential backoff
            }
          }
        }
        
        if (response) {
          advice = response.text || "大脑短路了，无法生成建议，请重试。";
        }
      } catch (e) {
        console.error("Gemini API Init Error:", e);
        advice = "Gemini AI 引擎初始化失败。请检查密钥是否正确。";
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

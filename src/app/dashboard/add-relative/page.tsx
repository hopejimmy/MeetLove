"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Reuse styles from Onboarding mostly via global or local inline for simplicity in MVP
export default function AddRelativePage() {
  const router = useRouter();
  
  const [step, setStep] = useState<"info" | "method" | "quiz" | "submitting">("info");
  
  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("Partner");
  const [mbti, setMbti] = useState<string | null>(null);

  // Simple quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const SUBMIT_API = async (finalMbti: string) => {
    setStep("submitting");
    const userId = localStorage.getItem("meetlove_userId");
    if(!userId) {
      alert("Missing User ID");
      return;
    }

    try {
      const res = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name,
          relationType,
          mbti: finalMbti
        })
      });
      if(res.ok) {
        router.push("/dashboard");
      } else {
        alert("Ops, something went wrong.");
        setStep("info");
      }
    } catch(e) {
      console.error(e);
      setStep("info");
    }
  };

  const PROFILING_QUESTIONS = [
    { text: "TA平时休息时喜欢...", optA: { label: "出去玩、和朋友聚会", val: "E" }, optB: { label: "宅在家、享受独处", val: "I" } },
    { text: "TA看待世界的方式...", optA: { label: "关注眼下的细节和现实", val: "S" }, optB: { label: "天马行空、喜欢聊未来的可能性", val: "N" } },
    { text: "TA在做决定时...", optA: { label: "讲究逻辑、对错分明", val: "T" }, optB: { label: "在意别人的情绪和感受", val: "F" } },
    { text: "TA的生活习惯...", optA: { label: "喜欢按计划行事、井井有条", val: "J" }, optB: { label: "喜欢随性发挥、走到哪算哪", val: "P" } },
  ];

  const handleQuizAnswer = (val: string) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if(quizIndex < 3) {
      setQuizIndex(prev => prev + 1);
    } else {
      const computedMbti = newAnswers.join("");
      setMbti(computedMbti);
      SUBMIT_API(computedMbti);
    }
  };

  if(step === "info") {
    return (
      <main className="container animate-fade-in" style={{ marginTop: '5vh' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h1 className="heading-1" style={{ fontSize: '1.8rem' }}>新增一个共振频段</h1>
          <p className="text-subtitle">输入你想了解的那个人的基本信息，以便我们可以建立对应的专属档案。</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-primary)' }}>对方怎么称呼？</label>
            <input 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.5)', fontSize: '1rem', outline: 'none' }}
              placeholder="例如: 妈妈，老婆，老板..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '1rem' }}>你们是什么关系？</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.5)', fontSize: '1rem', outline: 'none' }}
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
            >
              <option value="Partner">伴侣 / 恋人</option>
              <option value="Parent">父母</option>
              <option value="Child">孩子</option>
              <option value="Friend">朋友 / 闺蜜</option>
              <option value="Colleague">同事 / 老板</option>
            </select>

            <button 
              className="glass-button" 
              style={{ marginTop: '2rem' }}
              onClick={() => {
                if(!name) return alert("请输入名字");
                setStep("method");
              }}
            >
              下一步
            </button>
            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '1rem' }}
              onClick={() => router.push("/dashboard")}
            >
              取消
            </button>
          </div>
        </div>
      </main>
    );
  }

  if(step === "method") {
    return (
      <main className="container animate-fade-in" style={{ marginTop: '5vh' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>你知道 TA 的 MBTI 吗？</h2>
          <p className="text-subtitle">如果你不清楚，我们可以通过 4 个小问题进行**行为特征侧写**来估测。</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <button className="glass-button" onClick={() => setStep("quiz")}>
              我不知道，帮我推演一下 (行为侧写)
            </button>
            <button 
              className="glass-button" 
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
              onClick={() => {
                const manual = prompt("请输入 TA 的 4 字母 MBTI (例如: ENFP):");
                if(manual && manual.length === 4) {
                  SUBMIT_API(manual.toUpperCase());
                }
              }}
            >
              我直接输入
            </button>
            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '1rem' }}
              onClick={() => setStep("info")}
            >
              返回修改信息
            </button>
          </div>
        </div>
      </main>
    );
  }

  if(step === "quiz") {
    const q = PROFILING_QUESTIONS[quizIndex];
    return (
      <main className="container animate-fade-in" style={{ marginTop: '5vh' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
            行为侧写推演: {quizIndex + 1} / 4
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '3rem', minHeight: '60px' }}>{q.text}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              className="glass-button" 
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--accent-color)', textAlign: 'left', padding: '1.5rem 1rem' }}
              onClick={() => handleQuizAnswer(q.optA.val)}
            >
              {q.optA.label}
            </button>
            <button 
               className="glass-button" 
               style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--accent-color)', textAlign: 'left', padding: '1.5rem 1rem' }}
               onClick={() => handleQuizAnswer(q.optB.val)}
            >
              {q.optB.label}
            </button>
          </div>
        </div>
      </main>
    )
  }

  if(step === "submitting") {
    return (
      <main className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: "center" }}>
          <div className="loader"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>正在生成专属的人际引力档案...</p>
        </div>
      </main>
    );
  }

  return null;
}

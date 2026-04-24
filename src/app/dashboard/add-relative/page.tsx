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
      <main className="animate-fade-in" style={{ padding: '14px 18px', maxWidth: '500px', margin: '0 auto' }}>
        <button 
          onClick={() => router.push("/dashboard")}
          style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)', cursor: 'pointer', marginBottom: 12, padding: 0, fontFamily:'"Nunito",sans-serif' }}
        >
          ← 返回
        </button>
        <div className="rs-card" style={{ padding: 22 }}>
          <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color:'var(--rs-ink)' }}>新的连接</h2>
          <p style={{ fontSize: 13, color: 'var(--rs-ink-soft)', margin: '0 0 20px', fontFamily:'"Nunito",sans-serif' }}>为 TA 建立一份共振档案</p>
          
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6, fontFamily:'"Nunito",sans-serif', color:'var(--rs-ink)' }}>怎么称呼 TA？</div>
          <input 
            placeholder="例如: 妈妈，老公，老板..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14,
              border: '2px solid var(--rs-ink)', borderRadius: 12, marginBottom: 16, fontFamily: '"Nunito",sans-serif', outline: 'none', background:'#fff', color:'var(--rs-ink)'
            }}
          />

          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8, fontFamily:'"Nunito",sans-serif', color:'var(--rs-ink)' }}>你们是什么关系？</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
            {[
              { val: 'Partner', label: '伴侣' },
              { val: 'Parent', label: '父母' },
              { val: 'Child', label: '孩子' },
              { val: 'Friend', label: '朋友' },
              { val: 'Colleague', label: '同事' },
              { val: 'Other', label: '其他' }
            ].map((r,i) => {
              const active = relationType === r.val;
              return (
                <button 
                  key={r.val}
                  onClick={() => setRelationType(r.val)}
                  style={{
                    fontFamily:'"Nunito",sans-serif', fontSize: 13, fontWeight: 800,
                    padding: '10px 0', borderRadius: 10,
                    border: '2px solid var(--rs-ink)',
                    background: active ? 'var(--rs-coral)' : 'var(--rs-cream)',
                    color: active ? '#fff' : 'var(--rs-ink)',
                    boxShadow: '0 3px 0 0 var(--rs-ink)', cursor: 'pointer',
                    transition: 'transform 0.1s, box-shadow 0.1s',
                    transform: active ? 'translateY(2px)' : 'translateY(0)',
                  }}
                >{r.label}</button>
              );
            })}
          </div>

          <button 
            className="rs-btn" 
            style={{ width: '100%', marginBottom: 12, padding: '14px 0', fontSize: 15 }}
            onClick={() => {
              if(!name) return alert("请输入名字");
              setStep("method");
            }}
          >
            下一步 →
          </button>
          <button 
            className="rs-btn ghost" 
            style={{ width: '100%', padding: '14px 0', fontSize: 15 }}
            onClick={() => router.push("/dashboard")}
          >
            取消
          </button>
        </div>
      </main>
    );
  }

  if(step === "method") {
    return (
      <main className="animate-fade-in" style={{ padding: '14px 18px', maxWidth: '500px', margin: '0 auto' }}>
        <button onClick={() => setStep("info")} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)', cursor: 'pointer', marginBottom: 12, padding: 0, fontFamily:'"Nunito",sans-serif' }}>← 返回</button>
        <div className="rs-card" style={{ padding: 22, textAlign: 'center' }}>
          <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color:'var(--rs-ink)' }}>你知道 TA 的 MBTI 吗？</h2>
          <p style={{ fontSize: 13, color: 'var(--rs-ink-soft)', margin: '0 0 24px', fontFamily:'"Nunito",sans-serif' }}>如果不清楚，我们可以通过 4 个小问题侧写估测。</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              className="rs-btn honey" 
              onClick={() => setStep("quiz")}
              style={{ padding: '14px 0', fontSize: 15 }}
            >
              我不知道，帮我推测
            </button>
            <button 
              className="rs-btn ghost" 
              onClick={() => {
                const manual = prompt("请输入 TA 的 4 字母 MBTI (例如: ENFP):");
                if(manual && manual.length === 4) SUBMIT_API(manual.toUpperCase());
              }}
              style={{ padding: '14px 0', fontSize: 15 }}
            >
              我知道，直接输入
            </button>
          </div>
        </div>
      </main>
    );
  }

  if(step === "quiz") {
    const q = PROFILING_QUESTIONS[quizIndex];
    return (
      <main className="animate-fade-in" style={{ padding: '16px 18px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => {
            if(quizIndex === 0) setStep("method");
            else { setQuizIndex(prev => prev - 1); setAnswers(prev => prev.slice(0, -1)); }
          }} style={{ background: 'none', border:'none', fontSize:12, fontWeight: 800, color:'var(--rs-ink)', cursor:'pointer', fontFamily:'"Nunito",sans-serif', padding:0 }}>←</button>
          
          <span style={{ fontFamily:'"Nunito",sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--rs-ink)' }}>推演进度 {quizIndex + 1} / 4</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2,3].map((_, i) => (
              <div key={i} style={{ width: 24, height: 7, borderRadius: 4, background: i <= quizIndex ? 'var(--rs-honey)' : 'var(--rs-cream)', border:'2px solid var(--rs-ink)' }}/>
            ))}
          </div>
        </div>

        <div className="rs-card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 19, fontWeight: 500, lineHeight: 1.35 }}>
            {q.text}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="rs-card" onClick={() => handleQuizAnswer(q.optA.val)} 
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 0 var(--rs-ink)'; }}
            style={{ padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: '"Nunito",sans-serif', transition:'transform .1s, box-shadow .1s', display: 'flex', gap: 12, alignItems: 'center' }}>
             <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--rs-honey)', color:'var(--rs-ink)', border: '2.5px solid var(--rs-ink)', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>A</div>
             <div style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 700, color: 'var(--rs-ink)' }}>{q.optA.label}</div>
          </button>
          
          <button className="rs-card" onClick={() => handleQuizAnswer(q.optB.val)} 
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 0 var(--rs-ink)'; }}
            style={{ padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: '"Nunito",sans-serif', transition:'transform .1s, box-shadow .1s', display: 'flex', gap: 12, alignItems: 'center' }}>
             <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--rs-lilac)', color:'#fff', border: '2.5px solid var(--rs-ink)', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>B</div>
             <div style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 700, color: 'var(--rs-ink)' }}>{q.optB.label}</div>
          </button>
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

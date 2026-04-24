"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDialog } from "@/context/DialogContext";
import { generateQuiz, calculateMbtiScore, QuestionDef } from "@/lib/questionBank";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

export default function AddRelativePage() {
  const router = useRouter();
  const { showAlert, showConfirm } = useDialog();
  
  const [step, setStep] = useState<"info" | "method" | "select" | "length_select" | "quiz" | "submitting">("info");
  
  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("Partner");
  const [mbti, setMbti] = useState<string | null>(null);

  // User status
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("meetlove_userId");
      if (userId) {
        const res = await fetch(`/api/user?id=${userId}`);
        const data = await res.json();
        if (data.success) setIsPremium(data.user.isPremium || false);
      }
    };
    fetchUser();
  }, []);

  // Simple quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuestionDef[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const SUBMIT_API = async (finalMbti: string) => {
    setStep("submitting");
    const userId = localStorage.getItem("meetlove_userId");
    if(!userId) {
      await showAlert("Missing User ID");
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
        await showAlert("Ops, something went wrong.");
        setStep("info");
      }
    } catch(e) {
      console.error(e);
      await showAlert("Network error");
      setStep("info");
    }
  };

  const startQuiz = async (length: 8 | 16 | 32 | 64) => {
    if (length > 8 && !isPremium) {
      const proceed = await showConfirm("👑 解锁高阶深度分析模型。\n\n目前的基础侧写(8题)只能提供模糊定性，而更长的题卷能精准锁定 TA 的潜意识频段。\n\n[内测演示层] 确定模拟开通永久 PRO 权限？");
      if (!proceed) return;
      
      const userId = localStorage.getItem("meetlove_userId");
      if (userId) {
        await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        setIsPremium(true);
      }
    }
    setQuizQuestions(generateQuiz(length));
    setQuizIndex(0);
    setAnswers([]);
    setStep("quiz");
  };

  const handleQuizAnswer = (val: string) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if(quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      const computedMbti = calculateMbtiScore(newAnswers);
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
            onClick={async () => {
              if(!name) {
                await showAlert("请输入名字");
                return;
              }
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
              onClick={() => setStep("length_select")}
              style={{ padding: '14px 0', fontSize: 15 }}
            >
              我不知道，帮我推测
            </button>
            <button 
              className="rs-btn ghost" 
              onClick={() => setStep("select")}
              style={{ padding: '14px 0', fontSize: 15 }}
            >
              我知道，直接选择
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === "select") {
    const colors = ['var(--rs-coral)', 'var(--rs-mint)', 'var(--rs-cobalt)', 'var(--rs-honey)', 'var(--rs-lilac)'];
    
    return (
      <main className="animate-fade-in" style={{ padding: '14px 18px', maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => setStep("method")} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)', cursor: 'pointer', marginBottom: 12, padding: 0, fontFamily:'"Nunito",sans-serif' }}>← 返回</button>
        
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color:'var(--rs-ink)' }}>选择TA的频率</h2>
          <p style={{ fontSize: 12, color: 'var(--rs-ink-soft)', margin: 0, fontFamily:'"Nunito",sans-serif' }}>点击下方的十六型人格卡片，直接开启档案</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {MBTI_TYPES.map((type, i) => (
            <button 
              key={type} 
              onClick={() => SUBMIT_API(type)}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 1px 0 0 var(--rs-ink)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
              style={{
                fontFamily:'"Nunito",sans-serif', fontWeight: 900, fontSize: 12,
                padding: '12px 0', color: i%5===3 ? 'var(--rs-ink)' : '#fff',
                background: colors[i % colors.length],
                border: '2px solid var(--rs-ink)', borderRadius: 10,
                boxShadow: '0 3px 0 0 var(--rs-ink)', cursor: 'pointer',
                transition: 'transform .1s, box-shadow .1s'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (step === "length_select") {
    return (
      <main className="animate-fade-in" style={{ padding: '14px 18px', maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => setStep("method")} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)', cursor: 'pointer', marginBottom: 12, padding: 0, fontFamily:'"Nunito",sans-serif' }}>← 返回</button>
        <div className="rs-card" style={{ padding: 22 }}>
          <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color:'var(--rs-ink)' }}>推演深度选择</h2>
          <p style={{ fontSize: 13, color: 'var(--rs-ink-soft)', margin: '0 0 24px', fontFamily:'"Nunito",sans-serif' }}>更丰富的采样将大大提高性格侧写的精度。</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="rs-btn" onClick={() => startQuiz(8)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>基础快速侧写 (8题)</span>
              <span style={{ fontSize: 11, background: 'var(--rs-honey)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>免费</span>
            </button>
            <button className="rs-btn ghost" onClick={() => startQuiz(16)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>高阶精准侧写 (16题)</span>
              <span style={{ fontSize: 11, background: isPremium ? 'var(--rs-honey)' : 'var(--rs-cream)', border: '1px solid var(--rs-ink)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>👑 PRO</span>
            </button>
            <button className="rs-btn ghost" onClick={() => startQuiz(32)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>深度潜意识探测 (32题)</span>
              <span style={{ fontSize: 11, background: isPremium ? 'var(--rs-honey)' : 'var(--rs-cream)', border: '1px solid var(--rs-ink)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>👑 PRO</span>
            </button>
            <button className="rs-btn ghost" onClick={() => startQuiz(64)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>终极灵魂解码 (64题)</span>
              <span style={{ fontSize: 11, background: isPremium ? 'var(--rs-honey)' : 'var(--rs-cream)', border: '1px solid var(--rs-ink)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>👑 PRO</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if(step === "quiz" && quizQuestions.length > 0) {
    const q = quizQuestions[quizIndex];
    return (
      <main className="animate-fade-in" style={{ padding: '16px 18px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => {
            if(quizIndex === 0) setStep("length_select");
            else { setQuizIndex(prev => prev - 1); setAnswers(prev => prev.slice(0, -1)); }
          }} style={{ background: 'none', border:'none', fontSize:12, fontWeight: 800, color:'var(--rs-ink)', cursor:'pointer', fontFamily:'"Nunito",sans-serif', padding:0 }}>← 返回</button>
          
          <span style={{ fontFamily:'"Nunito",sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--rs-ink)' }}>推演进度 {quizIndex + 1} / {quizQuestions.length}</span>
          <div style={{ display: 'flex', gap: 2, flex: 1, maxWidth: 100, marginLeft: 16 }}>
            {quizQuestions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= quizIndex ? 'var(--rs-honey)' : 'var(--rs-cream)', border:'1px solid var(--rs-ink)' }}/>
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

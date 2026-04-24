"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { RsOrb, RsStar, RsMedal, RsPetal } from "@/components/icons/ResonanceIcons";
import styles from "./OnboardingForm.module.css";
import { generateQuiz, calculateMbtiScore, QuestionDef } from "@/lib/questionBank";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];
export default function OnboardingForm() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [step, setStep] = useState<"hero" | "select" | "quiz" | "completing">("hero");
  
  // 基础首页免费题库 (8题)
  const [quizQuestions] = useState<QuestionDef[]>(() => generateQuiz(8));
  
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selectedMbti, setSelectedMbti] = useState<string | null>(null);

  const saveMbtiAndRedirect = async (mbti: string) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mbti }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("meetlove_userId", data.userId);
        localStorage.setItem("meetlove_mbti", data.mbti);
        router.push("/dashboard");
      } else {
        console.error("Failed to save MBTI");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectMbtiType = (type: string) => {
    setSelectedMbti(type);
    setStep("completing");
    saveMbtiAndRedirect(type);
  };

  const handleQuizAnswer = (typeResult: string) => {
    const newAnswers = [...quizAnswers, typeResult];
    setQuizAnswers(newAnswers);

    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Finished quiz! Calculate result
      const resultMbti = calculateMbtiScore(newAnswers);
      setSelectedMbti(resultMbti);
      setStep("completing");
      saveMbtiAndRedirect(resultMbti);
    }
  };

  // 1. Hero State
  if (step === "hero") {
    return (
      <div style={{ padding: '20px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, position:'relative' }}>
          <div style={{ animation: 'bob 2.2s ease-in-out infinite' }}><RsOrb size={52} color="coral" /></div>
          <div style={{ animation: 'bob 2s ease-in-out infinite .3s', marginTop: 12 }}><RsStar size={38} color="#F2C14E"/></div>
          <div style={{ animation: 'bob 2.4s ease-in-out infinite .6s' }}><RsOrb size={52} color="mint" /></div>
        </div>
        <div className="rs-card" style={{ textAlign: 'center', padding: '22px 18px', maxWidth: '400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#C7482A', letterSpacing: 3, marginBottom: 6 }}>· RELATE ·</div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize: 26, fontWeight: 500, fontStyle:'italic', margin: '2px 0 10px', lineHeight: 1.15, letterSpacing: -0.3 }}>
            {lang === 'en' ? 'Relate to' : '找到和你'}<br/><em>{lang === 'en' ? 'your resonance' : '同频的灵魂'}</em>
          </h1>
          <p style={{ fontSize: 12, color: '#5A4A3E', lineHeight: 1.6, margin: '6px 0 18px', fontFamily:'Nunito,sans-serif' }}>
            {t.heroSubtitle}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="rs-btn" onClick={() => setStep("quiz")}>
              {t.beginTest}
            </button>
            <button className="rs-btn ghost" onClick={() => setStep("select")}>
              {t.knowMbti}
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 70, right: '10vw', animation: 'bob 1.8s ease-in-out infinite' }}><RsMedal size={26} /></div>
        <div style={{ position: 'absolute', top: 140, left: '5vw', animation: 'bob 1.5s ease-in-out infinite .4s' }}><RsPetal size={20} color="#B49BE8"/></div>
      </div>
    );
  }

  // 2. Direct Select State
  if (step === "select") {
    const colors = ['var(--rs-coral)', 'var(--rs-mint)', 'var(--rs-cobalt)', 'var(--rs-honey)', 'var(--rs-lilac)'];
    
    return (
      <div className="animate-fade-in" style={{ padding: '16px 18px', maxWidth: 500, margin: '0 auto' }}>
        <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color:'var(--rs-ink)', textAlign:'center' }}>选择你的频率</h2>
        <p style={{ fontSize: 12, color: 'var(--rs-ink-soft)', margin: '0 0 20px', fontFamily:'"Nunito",sans-serif', textAlign:'center' }}>点击下方的十六型人格卡片，直接开启档案</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {MBTI_TYPES.map((type, i) => (
            <button 
              key={type} 
              onClick={() => handleSelectMbtiType(type)}
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
        
        <div style={{ textAlign:'center', marginTop: 30 }}>
          <button style={{ background: 'none', border:'none', fontSize: 13, fontFamily:'"Nunito",sans-serif', color:'var(--rs-ink-soft)', textDecoration:'underline', cursor:'pointer' }} onClick={() => setStep("quiz")}>
            不知道？做一次测试
          </button>
        </div>
      </div>
    );
  }

  // 3. Quiz State
  if (step === "quiz") {
    const currentQ = quizQuestions[quizIndex];
    return (
      <div className="animate-fade-in" style={{ padding: '16px 18px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => {
            if(quizIndex === 0) setStep("hero");
            else { setQuizIndex(prev => prev - 1); setQuizAnswers(prev => prev.slice(0, -1)); }
          }} style={{ background: 'none', border:'none', fontSize:12, fontWeight: 800, color:'var(--rs-ink)', cursor:'pointer', fontFamily:'"Nunito",sans-serif', padding:0 }}>← 返回</button>
          
          <span style={{ fontFamily:'"Nunito",sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--rs-ink)' }}>问题 {quizIndex + 1} / {quizQuestions.length}</span>
          
          <div style={{ display: 'flex', gap: 2, flex: 1, maxWidth: 100, marginLeft: 16 }}>
            {quizQuestions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= quizIndex ? 'var(--rs-honey)' : 'var(--rs-cream)', border:'1px solid var(--rs-ink)' }}/>
            ))}
          </div>
        </div>

        <div className="rs-card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--rs-coral-dk)', marginBottom: 8, letterSpacing:1 }}>{currentQ.axis.replace(/(E|I|S|N|T|F|J|P)/g, '$1 ').trim().replace(' ', ' / ')}</div>
          <div style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 19, fontWeight: 500, lineHeight: 1.35 }}>
            {currentQ.text}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="rs-card" onClick={() => handleQuizAnswer(currentQ.optA.val)} 
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 0 var(--rs-ink)'; }}
            style={{ padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: '"Nunito",sans-serif', transition:'transform .1s, box-shadow .1s', display: 'flex', gap: 12, alignItems: 'center' }}>
             <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--rs-honey)', color:'var(--rs-ink)', border: '2.5px solid var(--rs-ink)', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>A</div>
             <div style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 700, color: 'var(--rs-ink)' }}>{currentQ.optA.label}</div>
          </button>
          
          <button className="rs-card" onClick={() => handleQuizAnswer(currentQ.optB.val)} 
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 0 var(--rs-ink)'; }}
            style={{ padding: 14, textAlign: 'left', cursor: 'pointer', fontFamily: '"Nunito",sans-serif', transition:'transform .1s, box-shadow .1s', display: 'flex', gap: 12, alignItems: 'center' }}>
             <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--rs-lilac)', color:'#fff', border: '2.5px solid var(--rs-ink)', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>B</div>
             <div style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 700, color: 'var(--rs-ink)' }}>{currentQ.optB.label}</div>
          </button>
        </div>
      </div>
    );
  }

  // 4. Completing State
  if (step === "completing") {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: '30px 20px', maxWidth: 400, margin: '0 auto' }}>
        <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 28, fontWeight: 600, color: 'var(--rs-ink)', marginBottom: '8px' }}>解码完成！</h2>
        <p style={{ fontFamily:'"Nunito",sans-serif', fontSize: 14, color: 'var(--rs-ink-soft)', marginBottom: 24 }}>
          你的性格频率是: <strong style={{ color: 'var(--rs-coral-dk)', fontSize: 18 }}>{selectedMbti}</strong>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, animation: 'bob 2s ease-in-out infinite' }}>
          <RsOrb size={72} color="lilac" />
        </div>
        <p style={{ fontFamily:'"Nunito",sans-serif', fontSize: 12, color: 'var(--rs-ink-soft)', fontWeight: 700 }}>正在进入个人档案...</p>
      </div>
    );
  }

  return null;
}

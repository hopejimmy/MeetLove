"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import styles from "./OnboardingForm.module.css";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const QUIZ_QUESTIONS = [
  {
    id: "E_I",
    text: "周末终于有空休息了，你倾向于怎么度过？",
    optionA: { text: "去参加个聚会或者和朋友去热闹的局", type: "E" },
    optionB: { text: "自己一个人在家宅着，看书追剧或者睡觉", type: "I" }
  },
  {
    id: "S_N",
    text: "你在看一部悬疑电影时，你更倾向于注意：",
    optionA: { text: "角色的微表情和实际的线索细节", type: "S" },
    optionB: { text: "隐藏的暗号和导演想要表达的深层隐喻", type: "N" }
  },
  {
    id: "T_F",
    text: "如果你的好朋友向你诉苦抱怨一件事，你通常的第一反应是：",
    optionA: { text: "帮 TA 梳理问题出在哪，并给出解决思路", type: "T" },
    optionB: { text: "先给 TA 共情和安慰，照顾 TA 此刻的情绪", type: "F" }
  },
  {
    id: "J_P",
    text: "准备出去长途旅行，你的行李和行程往往是：",
    optionA: { text: "提前做好详细的攻略，列好行李清单并按计划执行", type: "J" },
    optionB: { text: "有个大概的目的地就行，根据当天的心情和意外惊喜决定行程", type: "P" }
  }
];

export default function OnboardingForm() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [step, setStep] = useState<"hero" | "select" | "quiz" | "completing">("hero");
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

    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Finished quiz! Calculate result
      const resultMbti = newAnswers.join("");
      setSelectedMbti(resultMbti);
      setStep("completing");
      saveMbtiAndRedirect(resultMbti);
    }
  };

  // 1. Hero State
  if (step === "hero") {
    return (
      <div className={`glass-panel ${styles.formContainer} animate-fade-in`}>
        <h1 className="heading-1">{lang === 'en' ? 'Relate' : 'Relate 共振'} <span style={{ fontSize: '0.6em', opacity: 0.8 }}></span></h1>
        <p className="text-subtitle">
          {t.heroSubtitle}
        </p>
        <div className={styles.buttonGroup}>
          <button className="glass-button" onClick={() => setStep("quiz")}>
            {t.beginTest}
          </button>
          <button 
            className="glass-button" 
            style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
            onClick={() => setStep("select")}
          >
            {t.knowMbti}
          </button>
        </div>
      </div>
    );
  }

  // 2. Direct Select State
  if (step === "select") {
    return (
      <div className={`glass-panel ${styles.formContainer} animate-fade-in`}>
        <h2 className={styles.title}>选择你的固有频率</h2>
        <p className={styles.subtitle}>点击下方的十六型人格卡片，直接开启你的共振档案。</p>
        
        <div className={styles.mbtiGrid}>
          {MBTI_TYPES.map(type => (
            <button 
              key={type} 
              className={styles.mbtiCard}
              onClick={() => handleSelectMbtiType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        
        <button className={styles.backButton} onClick={() => setStep("hero")}>← 返回</button>
      </div>
    );
  }

  // 3. Quiz State
  if (step === "quiz") {
    const currentQ = QUIZ_QUESTIONS[quizIndex];
    return (
      <div className={`glass-panel ${styles.formContainer} animate-fade-in`}>
        <div className={styles.progressCounter}>
          题目 {quizIndex + 1} / {QUIZ_QUESTIONS.length}
        </div>
        <h2 className={styles.questionText}>{currentQ.text}</h2>
        
        <div className={styles.optionGroup}>
          <button 
            className={styles.optionCard} 
            onClick={() => handleQuizAnswer(currentQ.optionA.type)}
          >
            {currentQ.optionA.text}
          </button>
          <button 
            className={styles.optionCard} 
            onClick={() => handleQuizAnswer(currentQ.optionB.type)}
          >
            {currentQ.optionB.text}
          </button>
        </div>

        <button className={styles.backButton} onClick={() => {
          if(quizIndex === 0) setStep("hero");
          else {
            setQuizIndex(prev => prev - 1);
            setQuizAnswers(prev => prev.slice(0, -1));
          }
        }}>← 返回上一层</button>
      </div>
    );
  }

  // 4. Completing State
  if (step === "completing") {
    return (
      <div className={`glass-panel ${styles.formContainer} animate-fade-in`} style={{ textAlign: "center" }}>
        <h2 className="heading-1">解码完成！</h2>
        <p className="text-subtitle">
          你的性格频率是: <strong>{selectedMbti}</strong>
        </p>
        <p className={styles.subtext}>正在为你开启个人档案并连接共振星系...</p>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return null;
}

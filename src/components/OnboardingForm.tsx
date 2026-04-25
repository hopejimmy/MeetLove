"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useDialog } from "@/context/DialogContext";
import { RsOrb, RsStar, RsMedal, RsPetal } from "@/components/icons/ResonanceIcons";
import styles from "./OnboardingForm.module.css";
import { generateQuiz, calculateMbtiScore, QuestionDef } from "@/lib/questionBank";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const SCENARIOS = [
  {
    tag: '💔 吵架冷战',
    title: '冷战3天，不知道怎么开口',
    sub: '想缓和气氛，但怕一开口又吵起来',
    userMbti: 'INFJ', userColor: 'var(--rs-coral)',
    contactLabel: '伴侣', contactMbti: 'ESTP', contactColor: 'var(--rs-cobalt)',
    advice: '「我知道你现在可能还需要空间。我不是来继续争的——只是想让你知道，我在乎我们，也在乎你的感受。等你准备好，我想好好聊聊。」',
  },
  {
    tag: '👨‍👩‍👧 孩子教育',
    title: '孩子不肯尝试新东西，一说就叛逆',
    sub: '想让孩子放下手机、尝试新活动，说什么都没用',
    userMbti: 'ESTJ', userColor: 'var(--rs-mint)',
    contactLabel: '孩子', contactMbti: 'INFP', contactColor: 'var(--rs-lilac)',
    advice: '「我不是要强迫你，我只是有点担心你最近的状态。你愿意跟我说说，现在什么事让你最有意思吗？」',
  },
  {
    tag: '🌪️ 父母控制',
    title: '父母说"为你好"，句句是控制',
    sub: '爱他们，但每次通话后都精神内耗半天',
    userMbti: 'INFP', userColor: 'var(--rs-lilac)',
    contactLabel: '父母', contactMbti: 'ESTJ', contactColor: 'var(--rs-honey)',
    advice: '「妈，我知道你说这些是因为在乎我。但这件事我需要按自己的节奏来决定，这样我才能对结果负责。我会认真考虑你的意见的。」',
  },
  {
    tag: '💼 职场压力',
    title: '老板说"你好好想想"，彻夜未眠',
    sub: '不知道他什么意思，不知道自己哪里出了问题',
    userMbti: 'INFJ', userColor: 'var(--rs-coral)',
    contactLabel: '上司', contactMbti: 'ENTJ', contactColor: 'var(--rs-cobalt)',
    advice: '「您好，关于昨天的反馈，我想确认一下我的理解是否正确。您希望我在哪个方向上做调整？这样我能更有针对性地改进。」',
  },
];

export default function OnboardingForm() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { showConfirm } = useDialog();
  const [step, setStep] = useState<"hero" | "select" | "length_select" | "quiz" | "completing">("hero");
  
  // 动态题库
  const [quizQuestions, setQuizQuestions] = useState<QuestionDef[]>([]);
  
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selectedMbti, setSelectedMbti] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const startQuiz = async (length: 8 | 16 | 32 | 64) => {
    if (length > 8) {
      const proceed = await showConfirm(
        "👑 解锁高阶深度分析模型。\n\n由于你目前处于游客状态，建议体验基础版。不过作为演示特权，你可以破例直接体验这套深潜量表。\n\n是否继续？"
      );
      if (!proceed) return;
    }
    setQuizQuestions(generateQuiz(length));
    setQuizIndex(0);
    setQuizAnswers([]);
    setStep("quiz");
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
      <div style={{ padding: '10px 16px 60px', position: 'relative', zIndex: 2, maxWidth: 500, margin: '0 auto' }}>
        
        {/* Comic cloud speech bubble (SVG) */}
        <Link
          href="/mbti"
          aria-label="不了解 MBTI？点这里了解"
          style={{
            position: 'absolute',
            top: 8,
            right: -4,
            textDecoration: 'none',
            animation: 'bob 2.8s ease-in-out infinite',
            zIndex: 10,
            display: 'block',
          }}
        >
          <div style={{ position: 'relative', width: 100, height: 82 }}>
            <svg viewBox="0 0 125 100" width="100" height="82" style={{ display: 'block' }}>
              {/* White offset shadow */}
              <path
                transform="translate(5,5)"
                d="M95,68 Q106,68 112,58 Q120,48 112,38 Q112,22 96,18 Q94,8 80,10 Q72,2 60,10 Q52,2 44,10 Q32,4 26,16 Q14,16 12,28 Q4,36 8,48 Q6,62 18,68 Q28,78 46,70 Q56,76 66,70 L72,86 L95,68 Z"
                fill="white"
                stroke="#2A1F1A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Main cloud bubble */}
              <path
                d="M95,68 Q106,68 112,58 Q120,48 112,38 Q112,22 96,18 Q94,8 80,10 Q72,2 60,10 Q52,2 44,10 Q32,4 26,16 Q14,16 12,28 Q4,36 8,48 Q6,62 18,68 Q28,78 46,70 Q56,76 66,70 L72,86 L95,68 Z"
                fill="var(--rs-honey)"
                stroke="#2A1F1A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 5,
              bottom: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 900,
              color: '#2A1F1A',
              fontFamily: '"Nunito", sans-serif',
              lineHeight: 1.4,
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 15, marginBottom: 2 }}>💡</div>
              <div>不了解<br />MBTI？<br />点这里</div>
            </div>
          </div>
        </Link>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10, position:'relative', paddingTop: 20 }}>
          <div style={{ animation: 'bob 2.2s ease-in-out infinite' }}><RsOrb size={42} color="coral" /></div>
          <div style={{ animation: 'bob 2s ease-in-out infinite .3s', marginTop: 10 }}><RsStar size={30} color="#F2C14E"/></div>
          <div style={{ animation: 'bob 2.4s ease-in-out infinite .6s' }}><RsOrb size={42} color="mint" /></div>
        </div>

        {/* HOOK Section */}
        <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--rs-coral-dk)', letterSpacing: 2, marginBottom: 10 }}>· RELATE 同频 ·</div>
          <h1 style={{ fontFamily:'"Fraunces",serif', fontSize: 26, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.35, color: 'var(--rs-ink)' }}>
            为什么最亲密的人，<br/>总是产生最深的<u style={{textDecorationColor: 'var(--rs-coral)', textUnderlineOffset: 4}}>精神内耗？</u>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.6, fontFamily:'"Nunito",sans-serif', marginBottom: 16 }}>
            其实，你们并没有错。<br/>只是你们的沟通方式天生不同。<br/>Relate 分析双方性格，告诉你<strong>用什么方式说、说什么话</strong>，TA 才听得进去。
          </p>

          {/* Social proof bar */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--rs-cream)', border: '1.5px solid var(--rs-ink)',
            borderRadius: 30, padding: '6px 16px', marginBottom: 18,
            fontSize: 12, fontWeight: 900, color: 'var(--rs-ink)',
          }}>
            <span><span style={{ color: 'var(--rs-coral-dk)' }}>2,800+</span> 人已找到频率</span>
            <span style={{ color: 'var(--rs-ink-soft)' }}>·</span>
            <span>⭐ <span style={{ color: 'var(--rs-coral-dk)' }}>4.9</span> 分</span>
          </div>

          {/* Hero CTA buttons */}
          <button
            className="rs-btn coral"
            style={{ width: '100%', marginBottom: 10, padding: '14px 0', fontSize: 15 }}
            onClick={() => setStep("length_select")}
          >
            免费开始测试 →
          </button>
          <button
            className="rs-btn ghost"
            style={{ width: '100%', fontSize: 13, padding: '10px 0' }}
            onClick={() => setStep("select")}
          >
            我已知道我的 MBTI 型
          </button>

        </div>

        {/* PAIN POINTS Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
          <div className="rs-card" style={{ padding: '18px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 26, marginTop: -2 }}>💔</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6, color: 'var(--rs-ink)' }}>伴侣的频段错位</div>
              <div style={{ fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                “我歇斯底里地想要一个回应，TA 却冷暴力一言不发地想要自己的空间。”
              </div>
            </div>
          </div>

          <div className="rs-card" style={{ padding: '18px 16px', display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--rs-paper)' }}>
            <div style={{ fontSize: 26, marginTop: -2 }}>🌪️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6, color: 'var(--rs-ink)' }}>代际的沟通黑洞</div>
              <div style={{ fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                “父母的一句明明是‘为你好’，听在耳朵里全是令人窒息的控制与绑架。”
              </div>
            </div>
          </div>

          <div className="rs-card" style={{ padding: '18px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 26, marginTop: -2 }}>💼</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6, color: 'var(--rs-ink)' }}>职场的无效内耗</div>
              <div style={{ fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                “上司随意的一句话，让我彻夜未眠怀疑人生，不知道接下来怎么做。”
              </div>
            </div>
          </div>
        </div>

        {/* AI SCENARIO CAROUSEL Section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ height: 2, background: 'var(--rs-ink)', width: 30 }}></div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--rs-ink)', margin: 0 }}>真实场景，实时生成</h2>
            <div style={{ height: 2, background: 'var(--rs-ink)', width: 30 }}></div>
          </div>

          {/* Slide */}
          {(() => {
            const s = SCENARIOS[carouselIndex];
            return (
              <div className="rs-card" style={{ padding: '16px 14px', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 900,
                    color: 'var(--rs-coral-dk)', background: 'var(--rs-cream)',
                    border: '1.5px solid var(--rs-ink)', borderRadius: 20,
                    padding: '3px 10px', marginBottom: 8,
                  }}>
                    {s.tag} &nbsp;{carouselIndex + 1} / {SCENARIOS.length}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--rs-ink)', marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)' }}>{s.sub}</div>
                </div>

                {/* Personas */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--rs-cream)', borderRadius: 10,
                  padding: '10px 12px', marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.userColor, border: '2px solid var(--rs-ink)', flexShrink: 0 }} />
                    <div style={{ fontSize: 11 }}>
                      <div style={{ color: 'var(--rs-ink-soft)', fontSize: 10 }}>你</div>
                      <div style={{ fontWeight: 900 }}>{s.userMbti}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--rs-ink-soft)', padding: '0 4px' }}>×</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.contactColor, border: '2px solid var(--rs-ink)', flexShrink: 0 }} />
                    <div style={{ fontSize: 11 }}>
                      <div style={{ color: 'var(--rs-ink-soft)', fontSize: 10 }}>{s.contactLabel}</div>
                      <div style={{ fontWeight: 900 }}>{s.contactMbti}</div>
                    </div>
                  </div>
                </div>

                {/* Advice bubble */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--rs-coral-dk)', letterSpacing: 1, marginBottom: 6 }}>🤖 AI 破冰建议</div>
                  <div style={{
                    background: 'var(--rs-cream)', borderLeft: '3px solid var(--rs-mint)',
                    borderRadius: '0 10px 10px 10px', padding: '10px 12px',
                    fontSize: 13, lineHeight: 1.65, color: 'var(--rs-ink)', fontStyle: 'italic', fontWeight: 600,
                  }}>
                    {s.advice}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--rs-ink-soft)', textAlign: 'right', marginTop: 6 }}>
                    基于 {s.userMbti} × {s.contactMbti} 模型生成 ✦
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '0 4px' }}>
            <button
              onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
              disabled={carouselIndex === 0}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#fff', border: '2px solid var(--rs-ink)',
                boxShadow: '0 3px 0 0 var(--rs-ink)',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: carouselIndex === 0 ? 0.3 : 1,
                cursor: carouselIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >←</button>

            <div style={{ display: 'flex', gap: 6 }}>
              {SCENARIOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  aria-label={`场景 ${i + 1}`}
                  style={{
                    width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
                    background: i === carouselIndex ? 'var(--rs-coral)' : 'var(--rs-cream)',
                    border: '1.5px solid var(--rs-ink)',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCarouselIndex(i => Math.min(SCENARIOS.length - 1, i + 1))}
              disabled={carouselIndex === SCENARIOS.length - 1}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#fff', border: '2px solid var(--rs-ink)',
                boxShadow: '0 3px 0 0 var(--rs-ink)',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: carouselIndex === SCENARIOS.length - 1 ? 0.3 : 1,
                cursor: carouselIndex === SCENARIOS.length - 1 ? 'not-allowed' : 'pointer',
              }}
            >→</button>
          </div>
        </div>

        {/* SOLUTION Section */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ height: 2, background: 'var(--rs-ink)', width: 30 }}></div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--rs-ink)', margin: 0 }}>Relate 如何帮你扭转局面？</h2>
            <div style={{ height: 2, background: 'var(--rs-ink)', width: 30 }}></div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            <div className="rs-card" style={{ padding: '16px 14px', background: 'var(--rs-honey)', borderColor: 'var(--rs-ink)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 30, marginTop: -4 }}>📖</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>1. 提前拿到底牌，不再瞎猜</div>
                <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontWeight: 700 }}>
                  为TA建立专属测试档案。无需反复试探，系统直接呈上 TA 的「恋爱羁绊」与「绝对雷区」，把无效踩雷降至冰点。
                </div>
              </div>
            </div>
            
            <div className="rs-card" style={{ padding: '16px 14px', background: 'var(--rs-lilac)', borderColor: 'var(--rs-ink)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 30, marginTop: -4 }}>⚡️</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6, color: '#fff' }}>2. 找出你们吵架的根本原因</div>
                <div style={{ fontSize: 12, color: '#fff', lineHeight: 1.5, fontWeight: 700 }}>
                  为什么父母觉得是爱，你却觉得是控制？雷达精准对比你们的人格差异，帮你跳出情绪漩涡，彻底看透矛盾深层的本质。
                </div>
              </div>
            </div>

            <div className="rs-card" style={{ padding: '16px 14px', background: 'var(--rs-mint)', borderColor: 'var(--rs-ink)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 30, marginTop: -4 }}>🤖</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>3. 拥有一个实战级破冰军师</div>
                <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontWeight: 700 }}>
                  “刚刚大吵一架，第一句话怎么开口？” 进入 AI 推演，它会结合你俩特有的性格模型，替你定制一句让对方瞬间软化的高情商回复。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOW TO USE Section (Step-by-step guide) */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ height: 2, background: 'var(--rs-ink)', width: 30 }}></div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--rs-ink)', margin: 0 }}>极简上手指南</h2>
            <div style={{ height: 2, background: 'var(--rs-ink)', width: 30 }}></div>
          </div>

          <div style={{ position: 'relative', paddingLeft: 24, marginLeft: 16 }}>
            {/* 纵向时间轴线条 */}
            <div style={{ position: 'absolute', left: 5, top: 10, bottom: 10, width: 2, background: 'var(--rs-ink)' }}></div>

            <div style={{ position: 'relative', marginBottom: 28 }}>
              <div style={{ position: 'absolute', left: -26, top: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--rs-coral)', border: '2px solid var(--rs-ink)' }}></div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--rs-ink)', marginBottom: 4 }}>Step 1: 确立自身频段</div>
              <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                花 2 分钟完成基础推演测试，拿到专属你的 MBTI 核心光谱。
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: 28 }}>
              <div style={{ position: 'absolute', left: -26, top: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--rs-honey)', border: '2px solid var(--rs-ink)' }}></div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--rs-ink)', marginBottom: 4 }}>Step 2: 添加你在意的人</div>
              <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                在个人大厅点击「添加档案」，添加你在意的人到你的人际网络。
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: 28 }}>
              <div style={{ position: 'absolute', left: -26, top: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--rs-lilac)', border: '2px solid var(--rs-ink)' }}></div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--rs-ink)', marginBottom: 4 }}>Step 3: 查看 TA 的相处说明书</div>
              <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                随时点开任意一张亲友小卡片，即可快速获得与 TA 的「避雷生存指南」。
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -26, top: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--rs-mint)', border: '2px solid var(--rs-ink)' }}></div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--rs-ink)', marginBottom: 4 }}>Step 4: 遇到冲突？让 AI 给你出招</div>
              <div style={{ fontSize: 12, color: 'var(--rs-ink-soft)', lineHeight: 1.5, fontFamily:'"Nunito",sans-serif' }}>
                遇到实际的沟通问题？直接进入实战演练输入场景，AI 立刻为你输出定制高情商话术。
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rs-card" style={{ textAlign: 'center', padding: '24px 20px', background: 'var(--rs-cream)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--rs-ink)', marginBottom: 8 }}>2 分钟，找到你们问题的根源</div>
          <p style={{ fontSize: 12, color: 'var(--rs-ink-soft)', marginBottom: 20, lineHeight: 1.5 }}>
            免费完成 8 题测试，立刻获得你的专属沟通建议。
          </p>

          <button
            className="rs-btn coral"
            style={{ width: '100%', marginBottom: 12, padding: '14px 0', fontSize: 15 }}
            onClick={() => setStep("length_select")}
          >
            {t.beginTest}
          </button>

          <button
            className="rs-btn ghost"
            style={{ width: '100%', fontSize: 13, padding: '10px 0' }}
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
          <button style={{ background: 'none', border:'none', fontSize: 13, fontFamily:'"Nunito",sans-serif', color:'var(--rs-ink-soft)', textDecoration:'underline', cursor:'pointer' }} onClick={() => setStep("length_select")}>
            不知道？要做一次测试
          </button>
        </div>
      </div>
    );
  }

  // 2.5. Length Select State
  if (step === "length_select") {
    return (
      <div className="animate-fade-in" style={{ padding: '14px 18px', maxWidth: 500, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <button onClick={() => setStep("hero")} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)', cursor: 'pointer', marginBottom: 12, padding: 0, fontFamily:'"Nunito",sans-serif' }}>← 返回</button>
        <div className="rs-card" style={{ padding: 22 }}>
          <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color:'var(--rs-ink)' }}>选择推演深度</h2>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: 'var(--rs-ink-soft)', margin: '0 0 12px', fontFamily:'"Nunito",sans-serif', lineHeight: 1.5 }}>
              免费版的 8 道题往往只能测出你外在的<strong>“社交面具”</strong>，极易产生误判。想要剥离社交伪装，看清自己内心深处最真实的模样吗？
            </p>
            <div style={{ background: 'rgba(255,180,162, 0.15)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--rs-coral-dk)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--rs-coral-dk)', marginBottom: 4, letterSpacing: 0.5 }}>👑 升级 PRO 的决定性优势：</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--rs-ink)', fontFamily:'"Nunito",sans-serif', lineHeight: 1.6 }}>
                <li><strong>击穿伪装：</strong>最高 64 个尖锐情境，直逼你的底层潜意识。</li>
                <li><strong>告别平局：</strong>专业防平局算法，100% 锁定真实匹配类型。</li>
                <li><strong>高阶档案：</strong>全面解锁你独有的情感雷达图与超长万字解析。</li>
              </ul>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="rs-btn" onClick={() => startQuiz(8)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>基础快速侧写 (8题)</span>
              <span style={{ fontSize: 11, background: 'var(--rs-honey)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>免费</span>
            </button>
            <button className="rs-btn ghost" onClick={() => startQuiz(16)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>高阶精准侧写 (16题)</span>
              <span style={{ fontSize: 11, background: 'var(--rs-cream)', border: '1px solid var(--rs-ink)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>👑 PRO</span>
            </button>
            <button className="rs-btn ghost" onClick={() => startQuiz(32)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>深度潜意识探测 (32题)</span>
              <span style={{ fontSize: 11, background: 'var(--rs-cream)', border: '1px solid var(--rs-ink)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>👑 PRO</span>
            </button>
            <button className="rs-btn ghost" onClick={() => startQuiz(64)} style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>终极灵魂解码 (64题)</span>
              <span style={{ fontSize: 11, background: 'var(--rs-cream)', border: '1px solid var(--rs-ink)', color: 'var(--rs-ink)', padding: '2px 6px', borderRadius: 6 }}>👑 PRO</span>
            </button>
          </div>
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
            if(quizIndex === 0) setStep("length_select");
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
            {currentQ.text.replace(/TA/g, "你")}
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

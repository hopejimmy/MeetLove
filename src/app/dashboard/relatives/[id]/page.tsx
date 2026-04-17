"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function RelativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [relative, setRelative] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [myMbti, setMyMbti] = useState<string | null>(null);

  const [adviceRequested, setAdviceRequested] = useState<string | null>(null);
  const [adviceResponse, setAdviceResponse] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [customScenario, setCustomScenario] = useState("");

  useEffect(() => {
    const savedMbti = localStorage.getItem("meetlove_mbti");
    const userId = localStorage.getItem("meetlove_userId");
    
    if(!savedMbti || !userId) {
      router.push("/");
      return;
    }
    setMyMbti(savedMbti);

    // Fetch the specific relationship details
    // In a real app we'd fetch it by ID. For MVP we fetch all and filter.
    fetch(`/api/relationships?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if(data.success) {
          const rel = data.relationships.find((r: any) => r.id === id);
          if(rel) setRelative(rel);
        }
      })
      .finally(() => setLoading(false));

  }, [id, router]);

  const askForAdvice = async (scenario: string) => {
    setAdviceRequested(scenario);
    setLoadingAdvice(true);
    setAdviceResponse(null);

    const userId = localStorage.getItem("meetlove_userId");

    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          relationshipId: relative.id,
          scenario,
          myMbti,
          theirMbti: relative.mbti,
          relationType: relative.relationType
        })
      });
      const data = await res.json();
      if(data.success) {
        setAdviceResponse(data.advice);
      } else {
        setAdviceResponse("分析引擎遇到了波动，无法获取建议。");
      }
    } catch(e) {
      setAdviceResponse("遭遇了未知错误。");
    } finally {
      setLoadingAdvice(false);
    }
  };

  if(loading) return <div className="container" style={{display:'flex', justifyContent:'center'}}><div className="loader"></div></div>

  if(!relative) return <div className="container" style={{textAlign:'center', marginTop:'5vh'}}>未找到该亲友资料</div>

  const getDynamicScenarios = (relation: string) => {
    switch(relation) {
      case "Partner":
      case "伴侣 / 恋人":
        return [
          { label: "如何开口哄TA开心？", value: "partner_cheer_up" },
          { label: "我们刚大吵了一架，怎么破冰？", value: "partner_conflict" },
          { label: "怎么向TA表达我的真实需求？", value: "partner_needs" },
          { label: "策划一个让TA惊喜的浪漫约会", value: "partner_surprise" }
        ];
      case "Parent":
      case "父母":
        return [
          { label: "怎么向他们委婉解释我的不同观念？", value: "parent_boundaries" },
          { label: "如何在不激怒他们的情况下拒绝安排？", value: "parent_reject" },
          { label: "怎么哄长辈开心？送什么？", value: "parent_cheer" },
          { label: "他们对我干涉太多，怎么温柔画界限？", value: "parent_independence" }
        ];
      case "Colleague":
      case "同事 / 老板":
        return [
          { label: "怎么委婉地拒绝对方不合理的工作安排？", value: "work_reject" },
          { label: "刚才会上我们意见相左，怎么修复关系？", value: "work_conflict" },
          { label: "怎么跟TA高效高情商地聊升职加薪？", value: "work_raise" },
          { label: "TA总是不回消息，怎么得体地催推进？", value: "work_push" }
        ];
      case "Child":
      case "孩子":
        return [
          { label: "怎么安抚TA刚才巨大的情绪崩溃？", value: "child_tantrum" },
          { label: "怎么鼓励TA去自信尝试不熟悉的事物？", value: "child_encourage" },
          { label: "怎么耐心却又坚决地设定边界和规矩？", value: "child_rules" },
          { label: "TA到了叛逆期不想跟我说话，怎么破冰？", value: "child_rebel" }
        ];
      case "Friend":
      case "朋友 / 闺蜜":
      default:
        return [
          { label: "TA刚刚跟我大吐苦水，我该怎么接话？", value: "friend_comfort" },
          { label: "我们刚才有了点意见分歧，怎么解决？", value: "friend_conflict" },
          { label: "我想给TA挑选一件直击灵魂的礼物", value: "friend_gift" },
          { label: "怎么鼓励正处于人生低谷的TA？", value: "friend_encourage" }
        ];
    }
  };

  const scenarios = getDynamicScenarios(relative.relationType);

  return (
    <main className="container animate-fade-in" style={{ marginTop: '5vh' }}>
      <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', fontSize: '1rem', outline: 'none' }} onClick={() => router.push("/dashboard")}>
        ← 返回控制台
      </button>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2rem' }}>{relative.name} 的频道</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: '99px', fontSize: '0.9rem', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
            身份: {relative.relationType}
          </span>
          <span style={{ padding: '4px 12px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '99px', fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
            MBTI频率: {relative.mbti || "未知"}
          </span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>场景分析引擎</h2>
        <p className="text-subtitle" style={{ marginBottom: '1.5rem' }}>
          遇到以下沟通障碍？点击获取基于你们性格底色的专属破解方案：
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {scenarios.map(s => (
            <button 
              key={s.value} 
              className="glass-button" 
              style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', fontSize: '0.95rem' }}
              onClick={() => askForAdvice(s.label)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="或者输入你目前遇到的具体沟通困境..." 
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && customScenario.trim() !== '') {
                 askForAdvice(customScenario);
              }
            }}
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              borderRadius: '12px', 
              border: '1px solid var(--accent-color)', 
              background: 'rgba(255,255,255,0.6)', 
              fontSize: '1rem', 
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button 
            className="glass-button"
            style={{ padding: '0 1.5rem' }}
            onClick={() => {
              if (customScenario.trim() !== '') {
                 askForAdvice(customScenario);
              }
            }}
          >
            发送
          </button>
        </div>
        
        {adviceRequested && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              正在解析: <span style={{ color: 'var(--accent-color)' }}>{adviceRequested}</span>
            </h3>
            
            {loadingAdvice ? (
              <div className="loader"></div>
            ) : (
              <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                {adviceResponse?.split('\n').map((line, i) => <p key={i} style={{marginBottom:'0.5rem'}}>{line}</p>)}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.5rem' }}>
                  <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', padding:'4px' }}>👍</button>
                  <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', padding:'4px' }}>👎</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

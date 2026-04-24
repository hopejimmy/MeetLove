"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { RsOrb } from "@/components/icons/ResonanceIcons";
import { useDialog } from "@/context/DialogContext";
import { MBTI_DATA } from "@/lib/mbtiData";

export default function RelativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { showAlert } = useDialog();
  
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
    <main className="animate-fade-in" style={{ padding: '14px 16px 20px', maxWidth: '600px', margin: '0 auto', height: 'calc(100vh - 50px)', overflowY: 'auto' }}>
      <button 
        style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)', cursor: 'pointer', marginBottom: 12, padding: 0, fontFamily:'"Nunito",sans-serif' }} 
        onClick={() => router.push("/dashboard")}
      >
        ← 返回控制台
      </button>

      <div 
        className="rs-card" 
        onClick={() => {
          if (relative.mbti && MBTI_DATA[relative.mbti]) {
            showAlert(`【${relative.mbti} - ${MBTI_DATA[relative.mbti].role}】\n\n${MBTI_DATA[relative.mbti].description}`);
          }
        }}
        style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20, cursor: relative.mbti && MBTI_DATA[relative.mbti] ? 'pointer' : 'default' }}
      >
        <RsOrb size={52} color="mint" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <div style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 19, fontWeight: 600, color: 'var(--rs-ink)' }}>{relative.name}</div>
            <div style={{ fontSize: 11, color: 'var(--rs-ink-soft)', fontFamily:'"Nunito",sans-serif', fontWeight: 700 }}>{relative.relationType}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="rs-chip">{relative.mbti || "未知"}</span>
            {relative.mbti && MBTI_DATA[relative.mbti] && (
              <span style={{ fontSize: 12, color: 'var(--rs-ink)', fontWeight: 800 }}>{MBTI_DATA[relative.mbti].role}</span>
            )}
          </div>
          {relative.mbti && MBTI_DATA[relative.mbti] && (
            <div style={{ fontSize: 11, color: 'var(--rs-ink-soft)', marginTop: 4, fontFamily:'"Nunito",sans-serif' }}>{MBTI_DATA[relative.mbti].short}</div>
          )}
        </div>
      </div>

      {relative.mbti && MBTI_DATA[relative.mbti] && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily:'"Nunito",sans-serif', fontSize: 13, fontWeight: 900, marginBottom: 12, color:'var(--rs-ink-soft)', letterSpacing:1 }}>灵魂深层说明书</div>
          
          <div className="rs-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>❤️</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)' }}>情感羁绊模式</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.6, paddingLeft: 24, fontFamily:'"Nunito",sans-serif' }}>
                {MBTI_DATA[relative.mbti].loveStyle}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--rs-cream)', margin: '0 8px' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>🤜</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)' }}>友情相处模式</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.6, paddingLeft: 24, fontFamily:'"Nunito",sans-serif' }}>
                {MBTI_DATA[relative.mbti].friendStyle}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--rs-cream)', margin: '0 8px' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>💣</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--rs-ink)' }}>绝对踩雷区</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 38, fontSize: 13, color: 'var(--rs-ink-soft)', lineHeight: 1.6, fontFamily:'"Nunito",sans-serif' }}>
                {MBTI_DATA[relative.mbti].minefields.map((mine: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{mine}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontFamily:'"Nunito",sans-serif', fontSize: 13, fontWeight: 900, marginBottom: 12, color:'var(--rs-ink-soft)', letterSpacing:1 }}>遇到困境怎么办？发给 AI 推演</div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {scenarios.map((s, i) => {
          const colors = ['#F27A5A', '#4A7AC9', '#6ECFB0', '#F2C14E'];
          const isLight = i % 4 === 3;
          return (
            <button 
              key={s.value} 
              style={{
                fontFamily:'"Nunito",sans-serif', fontSize: 12, fontWeight: 800, textAlign: 'left',
                padding: '12px 14px', borderRadius: 12,
                border: '2px solid var(--rs-ink)', background: colors[i % 4], color: isLight ? 'var(--rs-ink)' : '#fff',
                boxShadow: '0 3px 0 0 var(--rs-ink)', cursor: 'pointer', lineHeight: 1.35,
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 1px 0 0 var(--rs-ink)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
              onClick={() => askForAdvice(s.label)}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input 
          type="text" 
          placeholder="输入你的具体困境..." 
          value={customScenario}
          onChange={(e) => setCustomScenario(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter' && customScenario.trim() !== '') askForAdvice(customScenario);
          }}
          style={{ 
            flex: 1, padding: '10px 14px', fontSize: 13,
            border: '2px solid var(--rs-ink)', borderRadius: 10, fontFamily: '"Nunito",sans-serif', outline: 'none', background:'#fff', color: 'var(--rs-ink)'
          }}
        />
        <button 
          className="rs-btn honey" 
          style={{ padding: '8px 18px', fontSize:13 }}
          onClick={() => {
            if (customScenario.trim() !== '') askForAdvice(customScenario);
          }}
        >
          发送
        </button>
      </div>
      
      {adviceRequested && (
        <div style={{ marginTop: '1rem', animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--rs-ink-soft)', marginBottom: 8, fontFamily:'"Nunito",sans-serif' }}>
            正在解析: <span style={{ color: 'var(--rs-coral-dk)' }}>{adviceRequested}</span>
          </div>
          
          {loadingAdvice ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <RsOrb size={40} color="lilac" />
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--rs-ink-soft)', fontFamily:'"Nunito",sans-serif', fontWeight: 700 }}>AI 引波中...</div>
            </div>
          ) : (
            <div className="rs-card" style={{ padding: 18, background: '#FFF1D9', border: '2.5px dashed var(--rs-ink)', boxShadow:'0 3px 0 0 var(--rs-ink)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--rs-coral-dk)', marginBottom: 8, letterSpacing:2, fontFamily:'"Nunito",sans-serif' }}>✦ 今日灵感</div>
              <div style={{ fontFamily:'"Nunito",sans-serif', fontSize: 13, lineHeight: 1.6, color: 'var(--rs-ink)' }}>
                {adviceResponse?.split('\n').map((line, i) => <p key={i} style={{marginBottom:'0.5rem'}}>{line}</p>)}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', padding:'4px', opacity: 0.7 }}>👍</button>
                <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', padding:'4px', opacity: 0.7 }}>👎</button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

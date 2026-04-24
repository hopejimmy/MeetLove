"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { RsOrb, RsMedal } from "@/components/icons/ResonanceIcons";
import { useDialog } from "@/context/DialogContext";
import { MBTI_DATA } from "@/lib/mbtiData";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLang();
  const { showAlert } = useDialog();
  const [mbti, setMbti] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [relationships, setRelationships] = useState<any[]>([]);

  // Progressive Profiling bindings
  const [isGuest, setIsGuest] = useState(false);
  const [emailToBind, setEmailToBind] = useState("");
  const [passwordToBind, setPasswordToBind] = useState("");
  const [binding, setBinding] = useState(false);

  useEffect(() => {
    const savedMbti = localStorage.getItem("meetlove_mbti");
    const userId = localStorage.getItem("meetlove_userId");
    
    if (!mbti && !savedMbti) {
      router.push("/");
    } else {
      setMbti(savedMbti);
      
      // Fetch user profile and relationships
      if (userId) {
        Promise.all([
          fetch(`/api/relationships?userId=${userId}`).then(res => res.json()),
          fetch(`/api/user?id=${userId}`).then(res => res.json())
        ])
        .then(([relData, userData]) => {
          if (relData.success) {
            setRelationships(relData.relationships);
          }
          if (userData.success && !userData.user.email) {
            setIsGuest(true);
          }
        })
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [mbti, router]);

  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </main>
    );
  }

  const handleBindEmail = async () => {
    if(!emailToBind.includes("@")) {
      await showAlert("请输入有效的邮箱地址");
      return;
    }
    if(passwordToBind.length < 6) {
      await showAlert("密码至少需要 6 个字符");
      return;
    }
    setBinding(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: localStorage.getItem("meetlove_userId"), 
          email: emailToBind,
          password: passwordToBind
        })
      });
      const data = await res.json();
      if(data.success) {
        setIsGuest(false);
        await showAlert("绑定成功！你的星系档案已永久保存。");
      } else {
        await showAlert(data.error || "绑定失败");
      }
    } catch(e) {
      await showAlert("网络错误");
    } finally {
      setBinding(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ padding: '16px 18px', maxWidth: '600px', margin: '0 auto' }}>
      
      {isGuest && (
        <div className="rs-card" style={{ padding: '16px', marginBottom: 24, background: 'var(--rs-honey)', borderColor: 'var(--rs-ink)', animation: 'bob 3s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 24 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily:'"Nunito",sans-serif', fontWeight: 900, fontSize: 13, color: 'var(--rs-ink)', marginBottom: 2 }}>你的档案处于游客状态！</div>
              <div style={{ fontFamily:'"Nunito",sans-serif', fontSize: 11, color: 'var(--rs-ink-soft)', marginBottom: 12 }}>为了防止换手机后遗失这些辛辛苦苦建立的亲友档案，请立刻绑定邮箱及密码以作同步凭证：</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={emailToBind}
                  onChange={(e) => setEmailToBind(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', boxSizing: 'border-box', fontSize: 12, border: '2px solid var(--rs-ink)', borderRadius: 8, outline: 'none', fontFamily:'"Nunito",sans-serif'
                  }}
                />
                <input 
                  type="password" 
                  placeholder="设置密码 (至少6位)"
                  value={passwordToBind}
                  onChange={(e) => setPasswordToBind(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', boxSizing: 'border-box', fontSize: 12, border: '2px solid var(--rs-ink)', borderRadius: 8, outline: 'none', fontFamily:'"Nunito",sans-serif'
                  }}
                />
                <button 
                  className="rs-btn" 
                  disabled={binding}
                  onClick={handleBindEmail}
                  style={{ padding: '8px 16px', fontSize: 13, width: '100%' }}
                >
                  {binding ? "..." : "加盐绑定"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div 
        className="rs-card" 
        onClick={() => {
          if (mbti && MBTI_DATA[mbti]) {
            showAlert(`【${mbti} - ${MBTI_DATA[mbti].role}】\n\n${MBTI_DATA[mbti].description}`);
          }
        }}
        style={{ padding: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
      >
        <RsOrb size={54} color="lilac"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--rs-ink-soft)', fontWeight: 800, fontFamily:'"Nunito",sans-serif', letterSpacing:1, marginBottom: 2 }}>你的频率</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 24, fontStyle:'italic', fontWeight: 600, color: 'var(--rs-coral-dk)', letterSpacing: 0.5 }}>{mbti}</div>
            {mbti && MBTI_DATA[mbti] && <div style={{ fontSize: 13, color: 'var(--rs-ink)', fontWeight: 800 }}>{MBTI_DATA[mbti].role}</div>}
          </div>
          {mbti && MBTI_DATA[mbti] && <div style={{ fontSize: 11, color: 'var(--rs-ink-soft)', marginTop: 2, fontFamily:'"Nunito",sans-serif' }}>{MBTI_DATA[mbti].short}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <RsMedal size={26} label="♡"/>
          <span style={{ fontWeight: 900, fontSize:15, fontFamily:'"Nunito",sans-serif', color: 'var(--rs-ink)' }}>{relationships.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--rs-ink)' }}>你在意的人 ({relationships.length})</h3>
        <span style={{ fontSize: 11, color: 'var(--rs-ink-soft)', fontWeight: 700, fontFamily:'"Nunito",sans-serif' }}>按相性排序</span>
      </div>

      {relationships.length === 0 ? (
        <div className="rs-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--rs-paper)', borderStyle: 'dashed' }}>
          <p style={{ fontSize: '13px', color: 'var(--rs-ink-soft)', fontFamily: '"Nunito",sans-serif', fontWeight: 700 }}>
            你暂时还没有添加共振档案。
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          {relationships.map((rel, i) => {
            const colors = ['coral', 'mint', 'cobalt', 'honey', 'lilac', 'blush'];
            const color = colors[i % colors.length];
            return (
              <Link 
                href={`/dashboard/relatives/${rel.id}`} 
                key={rel.id} 
                className="rs-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  padding: '16px 12px', 
                  textDecoration: 'none', 
                  transition: 'transform 0.1s, box-shadow 0.1s'
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 3px 0 0 var(--rs-ink)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 0 var(--rs-ink)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 0 var(--rs-ink)'; }}
              >
                <div style={{ marginBottom: 8 }}>
                  <RsOrb size={46} color={color} />
                </div>
                <div style={{ fontFamily:'"Nunito",sans-serif', fontSize: 14, fontWeight: 900, textAlign: 'center', color: 'var(--rs-ink)', marginBottom: 2 }}>{rel.name}</div>
                <div style={{ fontSize: 11, color: 'var(--rs-ink-soft)', textAlign: 'center', marginBottom: 10, fontFamily:'"Nunito",sans-serif', fontWeight: 700 }}>{rel.relationType}</div>
                <div 
                  className="rs-chip" 
                  onClick={(e) => {
                    if (rel.mbti && MBTI_DATA[rel.mbti]) {
                      e.preventDefault();
                      e.stopPropagation();
                      showAlert(`【${rel.mbti} - ${MBTI_DATA[rel.mbti].role}】\n\n${MBTI_DATA[rel.mbti].description}`);
                    }
                  }}
                  style={{ cursor: rel.mbti && MBTI_DATA[rel.mbti] ? 'pointer' : 'default' }}
                >
                  {rel.mbti || "未知"}
                </div>
                {rel.mbti && MBTI_DATA[rel.mbti] && (
                  <div style={{ fontSize: 10, color: 'var(--rs-ink-soft)', marginTop: 6, textAlign: 'center', fontFamily:'"Nunito",sans-serif', fontWeight: 700 }}>
                    {MBTI_DATA[rel.mbti].role}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <button 
        className="rs-btn mint" 
        style={{ width: '100%', marginTop: 24, padding: '14px 0', fontSize: 14 }}
        onClick={() => router.push("/dashboard/add-relative")}
      >
        ＋ {t.addContact}
      </button>
    </main>
  );
}

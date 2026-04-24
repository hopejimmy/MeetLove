"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { RsOrb, RsMedal } from "@/components/icons/ResonanceIcons";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLang();
  const [mbti, setMbti] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [relationships, setRelationships] = useState<any[]>([]);

  useEffect(() => {
    const savedMbti = localStorage.getItem("meetlove_mbti");
    const userId = localStorage.getItem("meetlove_userId");
    
    if (!mbti && !savedMbti) {
      router.push("/");
    } else {
      setMbti(savedMbti);
      
      // Fetch relationships
      if (userId) {
        fetch(`/api/relationships?userId=${userId}`)
          .then(res => res.json())
          .then(data => {
            if(data.success) {
              setRelationships(data.relationships);
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

  return (
    <main className="animate-fade-in" style={{ padding: '16px 18px', maxWidth: '600px', margin: '0 auto' }}>
      
      <div className="rs-card" style={{ padding: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <RsOrb size={54} color="lilac"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--rs-ink-soft)', fontWeight: 800, fontFamily:'"Nunito",sans-serif', letterSpacing:1, marginBottom: 2 }}>你的频率</div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 24, fontStyle:'italic', fontWeight: 600, color: 'var(--rs-coral-dk)', letterSpacing: 0.5 }}>{mbti}</div>
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
                <div className="rs-chip">{rel.mbti || "未知"}</div>
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

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
    <main className="container animate-fade-in" style={{ marginTop: '5vh' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 className="heading-1">{t.dashboardWelcome} {mbti}</h1>
        <p className="text-subtitle" style={{ marginBottom: '1rem' }}>
          {t.dashboardSubtitle}
        </p>
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)' }}>
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {t.dashboardDesc1} <strong>{mbti}</strong> {t.dashboardDesc2}
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{t.surroundingGalaxies}</h2>
        
        {relationships.length === 0 ? (
          <p className="text-subtitle" style={{ fontSize: '0.95rem' }}>
            你暂时还没有添加亲友档案。
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
            {relationships.map(rel => (
              <Link 
                href={`/dashboard/relatives/${rel.id}`} 
                key={rel.id} 
                className="glass-panel" 
                style={{ 
                  display: 'block', 
                  padding: '1.5rem', 
                  textDecoration: 'none', 
                  textAlign: 'left', 
                  background: 'rgba(255,255,255,0.4)', 
                  borderColor: 'var(--accent-color)',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{rel.name}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{rel.relationType}</div>
                <div style={{ display: 'inline-block', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-color)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 600 }}>
                  {rel.mbti || "未知"}
                </div>
              </Link>
            ))}
          </div>
        )}

        <button 
          className="glass-button" 
          style={{ marginTop: '1rem' }}
          onClick={() => router.push("/dashboard/add-relative")}
        >
          {t.addContact}
        </button>
      </div>
    </main>
  );
}

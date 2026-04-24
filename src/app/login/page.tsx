"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { RsLogo } from "@/components/icons/ResonanceIcons";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if(!email) return;
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      
      if(data.success) {
        localStorage.setItem("meetlove_userId", data.userId);
        if(data.mbti) localStorage.setItem("meetlove_mbti", data.mbti);
        router.push("/dashboard");
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '26px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <RsLogo size={64} />
      </div>
      
      <div className="rs-card" style={{ width: '100%', maxWidth: '380px', padding: 24 }}>
        <h2 style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 22, fontWeight: 600, textAlign: 'center', margin: '0 0 4px', color:'var(--rs-ink)' }}>欢迎回来</h2>
        <p style={{ fontSize: 13, color: 'var(--rs-ink-soft)', textAlign: 'center', margin: '0 0 20px', fontFamily:'"Nunito",sans-serif' }}>
          使用邮箱极速找回档案
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6, fontFamily:'"Nunito",sans-serif', color:'var(--rs-ink)' }}>邮箱</div>
          <input 
            type="email" 
            placeholder={t.placeholderEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14,
              border: '2px solid var(--rs-ink)', borderRadius: 12, marginBottom: 14,
              fontFamily: '"Nunito",sans-serif', outline: 'none', background:'#fff', color:'var(--rs-ink)'
            }}
          />
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6, fontFamily:'"Nunito",sans-serif', color:'var(--rs-ink)' }}>称呼 <span style={{ opacity: .5 }}>(选填)</span></div>
          <input 
            type="text" 
            placeholder={t.placeholderName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14,
              border: '2px solid var(--rs-ink)', borderRadius: 12, marginBottom: 22,
              fontFamily: '"Nunito",sans-serif', outline: 'none', background:'#fff', color:'var(--rs-ink)'
            }}
          />

          <button 
            className="rs-btn" 
            style={{ width: '100%', padding: '14px 0', fontSize: 15 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "..." : t.loginAction} →
          </button>
        </div>
      </div>
    </main>
  );
}

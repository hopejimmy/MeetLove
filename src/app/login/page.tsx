"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

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
    <main className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '2rem', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)' }} />
      
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 className="heading-1" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.login} {t.appName}</h1>
        <p className="text-subtitle" style={{ marginBottom: '2rem' }}>使用邮箱极速找回你的共振档案</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <input 
            type="email" 
            placeholder={t.placeholderEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.6)', fontSize: '1rem', outline: 'none' }}
          />
          <input 
            type="text" 
            placeholder={t.placeholderName + " (选填)"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.6)', fontSize: '1rem', outline: 'none' }}
          />

          <button 
            className="glass-button" 
            style={{ marginTop: '1rem' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "..." : t.loginAction}
          </button>
        </div>
      </div>
    </main>
  );
}

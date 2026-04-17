"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogged(!!localStorage.getItem("meetlove_userId"));
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("meetlove_userId");
    localStorage.removeItem("meetlove_mbti");
    setIsLogged(false);
    router.push("/");
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: 'rgba(255, 255, 255, 0.2)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link href={isLogged ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          {t.appName}
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          style={{ background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>

        {isLogged ? (
          <button 
            onClick={handleLogout}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
          >
            {t.logout}
          </button>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem' }}>
            {t.login}
          </Link>
        )}
      </div>
    </nav>
  );
}

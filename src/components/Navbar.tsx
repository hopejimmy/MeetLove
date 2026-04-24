"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RsLogo } from "@/components/icons/ResonanceIcons";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogged(!!localStorage.getItem("meetlove_userId"));
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

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
      padding: '10px 14px', 
      background: 'var(--rs-cream)', 
      borderBottom: '2.5px solid var(--rs-ink)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link href={isLogged ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <RsLogo size={26} />
        <span style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontWeight: 600, fontSize: 19, letterSpacing: '-0.4px', color: 'var(--rs-ink)' }}>
          {t.appName}
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          style={{ 
            fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 10,
            padding: '3px 9px', border: '2px solid var(--rs-ink)', borderRadius: 999,
            background: 'var(--rs-honey)', cursor: 'pointer', color: 'var(--rs-ink)'
          }}
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>

        {pathname !== '/login' && (
          isLogged ? (
            <button 
              onClick={handleLogout}
              style={{ background: 'transparent', border: 'none', color: 'var(--rs-ink-soft)', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
            >
              {t.logout}
            </button>
          ) : (
            <Link href="/login" style={{ textDecoration: 'none', color: 'var(--rs-ink-soft)', fontWeight: 700, fontSize: 11 }}>
              {t.login}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

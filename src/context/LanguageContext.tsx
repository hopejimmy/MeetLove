"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { dict, Lang } from "@/i18n/locales";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof dict.zh;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("relate_lang") as Lang;
    if (saved && (saved === "zh" || saved === "en")) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("relate_lang", newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within LangProvider");
  return context;
}

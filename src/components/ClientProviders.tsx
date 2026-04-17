"use client";

import { LangProvider } from "@/context/LanguageContext";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      {children}
    </LangProvider>
  );
}

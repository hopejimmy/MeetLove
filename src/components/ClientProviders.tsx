"use client";

import { LangProvider } from "@/context/LanguageContext";
import { DialogProvider } from "@/context/DialogContext";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <DialogProvider>
      <LangProvider>
        {children}
      </LangProvider>
    </DialogProvider>
  );
}

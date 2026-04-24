"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AlertOptions = {
  message: string;
  resolve: () => void;
};

type ConfirmOptions = {
  message: string;
  resolve: (value: boolean) => void;
};

interface DialogContextProps {
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmOptions | null>(null);

  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      setAlertConfig({ message, resolve });
    });
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmConfig({ message, resolve });
    });
  };

  const handleAlertClose = () => {
    if (alertConfig) {
      alertConfig.resolve();
      setAlertConfig(null);
    }
  };

  const handleConfirmClose = (result: boolean) => {
    if (confirmConfig) {
      confirmConfig.resolve(result);
      setConfirmConfig(null);
    }
  };

  const Overlay = ({ children }: { children: ReactNode }) => (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      {children}
    </div>
  );

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {alertConfig && (
        <Overlay>
          <div className="rs-card animate-fade-in" style={{ padding: '24px 24px', width: '100%', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🔔</div>
            <p style={{ fontFamily:'"Nunito",sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--rs-ink)', marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {alertConfig.message}
            </p>
            <button className="rs-btn" onClick={handleAlertClose} style={{ width: '100%', padding: '12px 0' }}>
              我知道了
            </button>
          </div>
        </Overlay>
      )}

      {confirmConfig && (
        <Overlay>
          <div className="rs-card animate-fade-in" style={{ padding: '24px 24px', width: '100%', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
            <p style={{ fontFamily:'"Nunito",sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--rs-ink)', marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {confirmConfig.message}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="rs-btn ghost" onClick={() => handleConfirmClose(false)} style={{ flex: 1, padding: '12px 0' }}>
                取消
              </button>
              <button className="rs-btn mint" onClick={() => handleConfirmClose(true)} style={{ flex: 1, padding: '12px 0' }}>
                确认
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

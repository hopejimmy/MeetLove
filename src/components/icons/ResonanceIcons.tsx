import React from 'react';

export const RsOrb = ({ size = 54, color = 'coral' }: { size?: number, color?: string }) => {
  const palette: Record<string, { fill: string; dk: string; ring: string }> = {
    coral: { fill: '#F27A5A', dk: '#C7482A', ring: 'rgba(242,122,90,.3)' },
    mint: { fill: '#6ECFB0', dk: '#2E8F74', ring: 'rgba(110,207,176,.3)' },
    honey: { fill: '#F2C14E', dk: '#B08418', ring: 'rgba(242,193,78,.3)' },
    lilac: { fill: '#B49BE8', dk: '#7255B8', ring: 'rgba(180,155,232,.3)' },
    cobalt: { fill: '#4A7AC9', dk: '#1F4890', ring: 'rgba(74,122,201,.3)' },
    blush: { fill: '#F4B8B8', dk: '#C77070', ring: 'rgba(244,184,184,.3)' },
  };
  const activePalette = palette[color] || palette.coral;
  
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="32" cy="32" r="30" fill="none" stroke={activePalette.dk} strokeWidth="1.5" opacity=".35" strokeDasharray="2 3" />
      <circle cx="32" cy="32" r="22" fill={activePalette.fill} stroke="#2A1F1A" strokeWidth="2.5" />
      <ellipse cx="24" cy="24" rx="7" ry="5" fill="rgba(255,255,255,.55)" />
      <circle cx="27" cy="34" r="2" fill="#2A1F1A" />
      <circle cx="37" cy="34" r="2" fill="#2A1F1A" />
      <path d="M27 40 Q32 43 37 40" fill="none" stroke="#2A1F1A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

export const RsMedal = ({ size = 36, label = '♡' }: { size?: number, label?: string }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }}>
    <path d="M20 3 L25 7 L31 7 L33 13 L37 17 L33 22 L33 28 L28 31 L25 36 L20 34 L15 36 L12 31 L7 28 L7 22 L3 17 L7 13 L9 7 L15 7 Z"
      fill="#F2C14E" stroke="#2A1F1A" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="20" cy="20" r="9" fill="#FFF8EC" stroke="#2A1F1A" strokeWidth="1.5" />
    <text x="20" y="25" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="12" fill="#C7482A">{label}</text>
  </svg>
);

export const RsStar = ({ size = 32, color = '#F2C14E' }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'block' }}>
    <path d="M16 2 L20 12 L30 12 L22 18 L25 28 L16 22 L7 28 L10 18 L2 12 L12 12 Z"
      fill={color} stroke="#2A1F1A" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="11" cy="10" r="1.4" fill="rgba(255,255,255,.7)" />
  </svg>
);

export const RsLogo = ({ size = 56 }: { size?: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }}>
    <circle cx="32" cy="32" r="28" fill="#F27A5A" stroke="#2A1F1A" strokeWidth="3" />
    <circle cx="32" cy="32" r="20" fill="#FFF8EC" stroke="#2A1F1A" strokeWidth="2" />
    <text x="32" y="42" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="600" fontSize="26" fill="#C7482A">R</text>
  </svg>
);

export const RsPetal = ({ size = 24, color = '#B49BE8' }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
    <path d="M12 2 Q18 8 12 22 Q6 8 12 2 Z" fill={color} stroke="#2A1F1A" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

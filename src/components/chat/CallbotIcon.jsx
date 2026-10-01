import React from 'react';

export default function CallbotIcon({ size = 32, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Headset Arc */}
      <path 
        d="M14 34V28C14 18.0589 22.0589 10 32 10C41.9411 10 50 18.0589 50 28V34" 
        stroke="#D4AF37" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />

      {/* Headset Left Pad */}
      <rect 
        x="10" 
        y="28" 
        width="6" 
        height="14" 
        rx="3" 
        fill="#D4AF37" 
      />

      {/* Headset Right Pad */}
      <rect 
        x="48" 
        y="28" 
        width="6" 
        height="14" 
        rx="3" 
        fill="#D4AF37" 
      />

      {/* Robot Head Body */}
      <rect 
        x="18" 
        y="18" 
        width="28" 
        height="26" 
        rx="8" 
        fill="#181B26" 
        stroke="#D4AF37" 
        strokeWidth="2.5" 
      />

      {/* Visor Screen */}
      <rect 
        x="22" 
        y="23" 
        width="20" 
        height="10" 
        rx="4" 
        fill="#0B0C10" 
      />

      {/* Robot Eyes (Glowing Gold) */}
      <circle cx="27" cy="28" r="2.2" fill="#F7DF88" />
      <circle cx="37" cy="28" r="2.2" fill="#F7DF88" />

      {/* Friendly Smile / Indicator */}
      <path 
        d="M28 38C29.5 39.5 34.5 39.5 36 38" 
        stroke="#D4AF37" 
        strokeWidth="2" 
        strokeLinecap="round"
      />

      {/* Microphone Arm */}
      <path 
        d="M49 38C49 46 42 49 35 49H32" 
        stroke="#D4AF37" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />

      {/* Microphone Tip */}
      <circle cx="31" cy="49" r="3.5" fill="#F7DF88" />

      {/* Top Antenna Accent */}
      <path d="M32 10V6" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="5" r="2" fill="#FFE082" />
    </svg>
  );
}

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'modern' | 'badge' | 'minimal';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const badgeDimensions = {
    sm: 'h-9 px-2.5',
    md: 'h-11 px-3.5',
    lg: 'h-14 px-5',
    xl: 'h-18 px-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl',
  };

  return (
    <div 
      aria-label="Go Coffee - Trang Chủ"
      className={`inline-flex items-center gap-2.5 select-none transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* Highlands-inspired Oval Emblem for Go Coffee */}
      <div 
        className={`relative ${badgeDimensions[size]} rounded-full bg-gradient-to-r from-[#8c141c] via-[#b22830] to-[#8c141c] flex items-center justify-center gap-2.5 shadow-lg shadow-red-950/25 border-2 border-amber-300/80 ring-1 ring-red-900/60 overflow-hidden group`}
      >
        {/* Subtle radial inner glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(253,230,138,0.35),_transparent_65%)]" />

        {/* Mountain & Coffee Bean Icon SVG */}
        <svg 
          viewBox="0 0 36 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-auto relative z-10 shrink-0 drop-shadow-sm"
        >
          {/* Mountain Peaks (Tây Nguyên) */}
          <path 
            d="M2 24 L10 10 L16 19 L21 11 L29 24 Z" 
            fill="#FDE68A" 
            opacity="0.95" 
          />
          {/* Coffee Sun / Bean Arc */}
          <ellipse cx="18" cy="8" rx="4.5" ry="3.5" fill="#FFFBEB" />
          <path d="M18 5 C17 7 19 9 18 11" stroke="#B22830" strokeWidth="1.2" strokeLinecap="round" />
          {/* River Waves below */}
          <path d="M4 25 Q10 23 18 25 T32 25" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Brand Text inside badge: GO COFFEE */}
        <div className="relative z-10 flex flex-col items-start leading-none pr-1">
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-white uppercase font-display ${textSizes[size]}`}>
              GO
            </span>
            <span className={`font-black tracking-wider text-amber-300 uppercase font-display ${textSizes[size]}`}>
              COFFEE®
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[8px] sm:text-[9px] font-bold text-amber-200/90 tracking-tight leading-none mt-0.5">
              CÀ PHÊ NGUYÊN CHẤT • SPECIALTY
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

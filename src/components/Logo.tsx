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
  variant = 'modern',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Icon SVG: Modern Specialty Coffee Seal & Takeaway Cup */}
      <div 
        className={`relative ${iconSizes[size]} rounded-2xl bg-gradient-to-br from-[#2c140a] via-[#3a1d0f] to-[#1c0c06] flex items-center justify-center shadow-lg shadow-stone-900/15 ring-1 ring-amber-500/25 overflow-hidden group shrink-0 transition-transform duration-300 hover:scale-105`}
      >
        {/* Ambient radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(245,158,11,0.25),_transparent_70%)]" />
        
        {/* Precision Vector Emblem */}
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 relative z-10"
        >
          {/* Subtle Outer Dial Ring */}
          <circle cx="24" cy="24" r="22" stroke="#d97706" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
          
          {/* Aromatic Steam Waves */}
          <path 
            d="M19 11C19 8.5 21 7.5 21 5.5" 
            stroke="#FDE68A" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          <path 
            d="M24 12C24 9.5 26 8.5 26 6" 
            stroke="#FDE68A" 
            strokeWidth="2.2" 
            strokeLinecap="round"
          />
          <path 
            d="M29 11C29 8.5 31 7.5 31 5.5" 
            stroke="#FDE68A" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            opacity="0.9"
          />

          {/* Specialty Coffee Mug Body */}
          <path 
            d="M12 16H34C35.8 16 36.8 17.5 36.5 19.5L34 32C33.2 35.8 30 38.5 26.2 38.5H19.8C16 38.5 12.8 35.8 12 32L9.5 19.5C9.2 17.5 10.2 16 12 16Z" 
            fill="#FFFBEB" 
          />
          
          {/* Ergonomic Mug Handle */}
          <path 
            d="M34 20H38.5C40.5 20 42 21.6 42 23.6V24.4C42 26.4 40.5 28 38.5 28H33" 
            stroke="#FFFBEB" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
          />
          
          {/* Coffee Surface Crema */}
          <ellipse cx="23" cy="18" rx="10" ry="2.5" fill="#B45309" />

          {/* Iconic Center "G" & Bean Monogram Symbol */}
          <circle cx="23" cy="28" r="5.5" fill="#2C140A" />
          <path 
            d="M24.5 25.5H21.5C20.2 25.5 19.5 26.4 19.5 28C19.5 29.6 20.2 30.5 21.5 30.5H24.5V28H22.5" 
            stroke="#F59E0B" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>

        {/* Gloss highlight */}
        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-amber-300/30 via-white/10 to-transparent rounded-bl-xl pointer-events-none" />
      </div>

      {/* Typography: Premium Vietnamese/International Specialty Coffee Brand */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span 
            className={`font-black tracking-tight text-stone-900 font-display ${textSizes[size]}`}
            style={{ fontFamily: "'Montserrat', 'Outfit', sans-serif", letterSpacing: '-0.03em' }}
          >
            GO<span className="text-amber-800 font-bold mx-0.5">&</span>GRAB
          </span>
          <span className="inline-flex items-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-800 text-amber-100 shadow-2xs">
            COFFEE
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span 
              className={`font-bold uppercase tracking-[0.25em] text-stone-500 ${subTextSizes[size]}`}
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              Cà Phê Đặc Sản Mang Đi
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-700">5 Phút</span>
          </div>
        )}
      </div>
    </div>
  );
};

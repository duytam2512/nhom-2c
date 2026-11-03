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
      aria-label="Go Coffee - Quán Cà Phê Sài Gòn Xưa"
      className={`inline-flex items-center gap-2.5 select-none transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* Authentic Vintage Saigon Coffee House Seal Emblem */}
      <div 
        className={`relative ${badgeDimensions[size]} rounded-md bg-[#801419] flex items-center justify-center gap-2.5 shadow-md shadow-amber-950/20 border-2 border-[#d4af37] ring-1 ring-[#52090c] overflow-hidden group`}
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255,248,220,0.2), 0 3px 8px rgba(0,0,0,0.25)'
        }}
      >
        {/* Subtle vintage texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(253,230,138,0.25),_transparent_70%)] pointer-events-none" />

        {/* Vintage Phin & Coffee Bean Emblem SVG */}
        <svg 
          viewBox="0 0 36 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-auto relative z-10 shrink-0 drop-shadow-sm"
        >
          {/* Phin lid */}
          <path d="M11 5 C11 4 13 3 18 3 C23 3 25 4 25 5 L24 8 L12 8 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="0.8" />
          {/* Phin body */}
          <path d="M9 8 H27 L25 21 H11 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
          {/* Phin plate */}
          <rect x="5" y="21" width="26" height="2.5" rx="1" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
          {/* Coffee cup */}
          <path d="M8 23.5 L10 29 C10.5 30.5 12 31 18 31 C24 31 25.5 30.5 26 29 L28 23.5 Z" fill="#FFFBEB" stroke="#92400E" strokeWidth="0.8" />
          {/* Coffee steam ribbons */}
          <path d="M14 1 C14.5 2 13.5 2.5 14 3.5 M18 0.5 C18.5 1.5 17.5 2 18 3 M22 1 C22.5 2 21.5 2.5 22 3.5" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
        </svg>

        {/* Brand Text: Classic Saigon Typography */}
        <div className="relative z-10 flex flex-col items-start leading-none pr-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider text-[#fffdfa] uppercase font-serif ${textSizes[size]}`}>
              GO COFFEE
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded-xs bg-[#d4af37] text-[#52090c] font-black uppercase tracking-tighter">
              1986
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[8px] sm:text-[9px] font-serif italic text-amber-200 tracking-wider leading-none mt-0.5">
              Phin Sài Gòn Xưa • 120 Pasteur
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


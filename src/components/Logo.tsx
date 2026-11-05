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
}) => {
  const imgHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11 lg:h-12',
    lg: 'h-11 sm:h-13',
    xl: 'h-13 sm:h-16',
  };

  return (
    <div
      aria-label="GO.COFFEE - Một ly đúng GU, rạng rỡ chuẩn YOU"
      className={`inline-flex items-center select-none transition-transform duration-300 hover:scale-[1.02] shrink-0 max-w-full ${className}`}
    >
      <div className="relative rounded-lg bg-[#fffdfa] border-2 border-[#801419]/30 shadow-xs px-2 py-1 flex items-center justify-center shrink-0">
        <img
          src="/images/drive/Logo-ca-phe-GO.COFFEE-thanh-lich.png"
          alt="GO.COFFEE - Một ly đúng GU, rạng rỡ chuẩn YOU"
          className={`${imgHeights[size]} w-auto object-contain transition-all duration-300`}
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/logo.png';
          }}
        />
      </div>
    </div>
  );
};

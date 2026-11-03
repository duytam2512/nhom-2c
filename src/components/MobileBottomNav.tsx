import React from 'react';
import { Home, Coffee, MapPin, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTableBooking: () => void;
  onScrollToMenu: () => void;
  onScrollToStores: () => void;
  onGoHome: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onScrollToMenu,
  onScrollToStores,
  onGoHome,
}) => {
  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#faf5ec]/98 backdrop-blur-lg border-t-2 border-[#801419]/30 shadow-[0_-4px_25px_rgba(43,29,20,0.12)] pb-[env(safe-area-inset-bottom,6px)] pt-1.5 transition-all font-serif"
    >
      <div className="grid grid-cols-5 items-center justify-around px-2 max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-700 hover:text-[#801419] transition active:scale-95 cursor-pointer group"
        >
          <Home className="w-5 h-5 group-hover:scale-105 transition-transform text-stone-700 group-hover:text-[#801419]" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Trang Chủ</span>
        </button>

        {/* 2. Menu */}
        <button
          onClick={onScrollToMenu}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-700 hover:text-[#801419] transition active:scale-95 cursor-pointer group"
        >
          <Coffee className="w-5 h-5 group-hover:scale-105 transition-transform text-stone-700 group-hover:text-[#801419]" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Thực Đơn</span>
        </button>

        {/* 3. Center Order CTA */}
        <button
          onClick={onScrollToMenu}
          className="flex flex-col items-center justify-center -mt-4 transition active:scale-90 cursor-pointer group"
          title="Đặt món mang đi ngay"
        >
          <div className="w-12 h-12 rounded-sm bg-[#801419] text-amber-200 flex items-center justify-center shadow-md border-2 border-[#d4af37] group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 text-amber-300" />
          </div>
          <span className="text-[10px] font-bold mt-1 text-[#801419] tracking-tight uppercase">
            Đặt Món
          </span>
        </button>

        {/* 4. Stores */}
        <button
          onClick={onScrollToStores}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-700 hover:text-[#801419] transition active:scale-95 cursor-pointer group"
        >
          <MapPin className="w-5 h-5 group-hover:scale-105 transition-transform text-stone-700 group-hover:text-[#801419]" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Ghé Quán</span>
        </button>

        {/* 5. Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-700 hover:text-[#801419] transition active:scale-95 cursor-pointer relative group"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform text-stone-700 group-hover:text-[#801419]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#d4af37] text-[#52090c] text-[10px] font-mono font-black w-4 h-4 rounded-xs flex items-center justify-center shadow-xs border border-[#801419]">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Phiếu Chọn</span>
        </button>

      </div>
    </nav>
  );
};


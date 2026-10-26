import React from 'react';
import { Home, Coffee, Armchair, MapPin, ShoppingBag } from 'lucide-react';

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
  onOpenTableBooking,
  onScrollToMenu,
  onScrollToStores,
  onGoHome,
}) => {
  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom,6px)] pt-1.5 transition-all"
    >
      <div className="grid grid-cols-5 items-center justify-around px-2 max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-600 hover:text-[#b22830] transition active:scale-95 cursor-pointer group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform text-stone-600 group-hover:text-[#b22830]" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Trang chủ</span>
        </button>

        {/* 2. Menu */}
        <button
          onClick={onScrollToMenu}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-600 hover:text-[#b22830] transition active:scale-95 cursor-pointer group"
        >
          <Coffee className="w-5 h-5 group-hover:scale-110 transition-transform text-stone-600 group-hover:text-[#b22830]" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Thực đơn</span>
        </button>

        {/* 3. Đặt bàn (Center Signature Highlands Red Action) */}
        <button
          onClick={onOpenTableBooking}
          className="flex flex-col items-center justify-center -mt-4 transition active:scale-90 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8c141c] via-[#b22830] to-[#c41e27] text-white flex items-center justify-center shadow-lg shadow-red-950/30 border-2 border-white ring-2 ring-red-400/40 group-hover:scale-105 transition-transform">
            <Armchair className="w-6 h-6 text-amber-200" />
          </div>
          <span className="text-[10px] font-extrabold mt-1 text-[#8c141c] tracking-tight">
            Đặt Bàn
          </span>
        </button>

        {/* 4. Stores */}
        <button
          onClick={onScrollToStores}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-600 hover:text-[#b22830] transition active:scale-95 cursor-pointer group"
        >
          <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform text-stone-600 group-hover:text-[#b22830]" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Cửa hàng</span>
        </button>

        {/* 5. Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-1 text-stone-600 hover:text-[#b22830] transition active:scale-95 cursor-pointer relative group"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-stone-600 group-hover:text-[#b22830]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Giỏ hàng</span>
        </button>

      </div>
    </nav>
  );
};

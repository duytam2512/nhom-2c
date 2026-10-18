import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Share2, 
  Menu, 
  X, 
  Coffee, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { StoreLocation } from '../types/coffee';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSeoShare: () => void;
  selectedStore: StoreLocation;
  onOpenStoreModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSeoShare,
  selectedStore,
  onOpenStoreModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (path: string, id?: string) => {
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur-md border-b border-amber-950/10 transition-all">
      {/* Top micro banner for SEO and announcement */}
      <div className="bg-amber-950 text-amber-200 text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Đặt trước cà phê, ghé lấy sau 5 phút • Nhập mã <strong>GRAB20</strong> giảm 20%</span>
        </span>
        <span className="text-amber-500 hidden sm:inline">•</span>
        <button
          onClick={onOpenSeoShare}
          className="underline text-amber-300 hover:text-white font-semibold cursor-pointer hidden sm:inline-flex items-center gap-1"
        >
          <Share2 className="w-3 h-3" /> Chia sẻ link có URL & SEO
        </button>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/', 'top');
            }}
            className="flex items-center gap-2"
            title="Go & Grab Coffee"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Store Pill */}
          <button
            onClick={() => handleLinkClick('/cua-hang', 'stores')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/60 hover:bg-amber-100 border border-amber-300/60 text-xs text-amber-950 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span className="font-semibold">{selectedStore.district}:</span>
            <span className="text-stone-600 truncate max-w-[130px]">{selectedStore.name}</span>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <a
            href="/thuc-don"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/thuc-don', 'menu');
            }}
            className="hover:text-amber-800 transition cursor-pointer"
          >
            Thực Đơn Cà Phê
          </a>
          <a
            href="/cau-chuyen"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/cau-chuyen', 'story');
            }}
            className="hover:text-amber-800 transition cursor-pointer"
          >
            Hạt Cầu Đất
          </a>
          <a
            href="/cua-hang"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/cua-hang', 'stores');
            }}
            className="hover:text-amber-800 transition cursor-pointer"
          >
            Điểm Lấy Hàng
          </a>
          <button
            onClick={onOpenSeoShare}
            className="text-amber-800 hover:text-amber-950 transition flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            SEO & URL Share
          </button>
        </nav>

        {/* Right: Actions (Cart & Share & Mobile Hamburger) */}
        <div className="flex items-center gap-2.5">
          {/* Quick Share Link CTA */}
          <button
            onClick={onOpenSeoShare}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 bg-white text-xs font-semibold transition shadow-2xs"
            title="Xem trước link khi gửi Zalo / Facebook / GitHub"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Gửi Link</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-800" /> Điểm nhận gần nhất:
            </span>
            <span className="text-xs font-bold text-stone-900">{selectedStore.name}</span>
          </div>

          <div className="space-y-2 pt-1 text-sm font-semibold text-stone-800">
            <a
              href="/thuc-don"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/thuc-don', 'menu');
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              Thực Đơn Cà Phê
            </a>
            <a
              href="/cau-chuyen"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/cau-chuyen', 'story');
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              Hạt Cà Phê Cầu Đất & Rang Mộc
            </a>
            <a
              href="/cua-hang"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/cua-hang', 'stores');
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              Điểm Lấy Hàng Go & Grab
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSeoShare();
              }}
              className="block w-full text-left py-2 px-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-800" />
                Chia sẻ link (SEO & Preview)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

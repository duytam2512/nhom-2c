import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Share2, 
  Menu, 
  X, 
  Coffee, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  Armchair,
  CupSoda,
  Leaf,
  Croissant,
  BookOpen,
  Zap,
  Flame,
  Star,
  Tag,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { CoffeeCategory, StoreLocation } from '../types/coffee';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSeoShare: () => void;
  onOpenTableBooking: () => void;
  selectedStore: StoreLocation;
  onOpenStoreModal?: () => void;
  onSelectCategory?: (category: CoffeeCategory) => void;
  onOpenChatbot?: () => void;
  onResetHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSeoShare,
  onOpenTableBooking,
  selectedStore,
  onOpenStoreModal,
  onSelectCategory,
  onOpenChatbot,
  onResetHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'menu' | 'services' | 'explore' | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<'menu' | 'services' | 'explore' | null>('services');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path: string, id?: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
    if (id && id !== 'top') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onResetHome) {
      onResetHome();
    } else if (onSelectCategory) {
      onSelectCategory('all');
    }
  };

  const handleCategoryClick = (category: CoffeeCategory) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    handleLinkClick('/thuc-don', 'menu');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf5ec]/95 backdrop-blur-md border-b-2 border-[#801419]/30 transition-all shadow-xs">
      {/* Top retro bulletin banner */}
      <div className="bg-[#781318] text-amber-200 text-[11px] py-1.5 px-4 text-center font-serif tracking-wider flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap border-b border-[#4d0c10] shadow-inner">
        <span className="flex items-center gap-1.5">
          <span className="text-amber-400">❖</span>
          <span>QUÁN CÀ PHÊ PHIN SÀI GÒN XƯA • 120 PASTEUR • GIAO HOẢ TỐC 5 PHÚT • MÃ ƯU ĐÃI: <strong className="text-white underline decoration-amber-300 font-mono">GOCOFFEE20</strong> (-20%)</span>
          <span className="text-amber-400">❖</span>
        </span>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer transition hover:opacity-90 active:scale-95"
            title="Go Coffee - Về trang bắt đầu"
          >
            <Logo size="md" />
          </a>
        </div>

        {/* Center: Vintage Saigon Navigation Menu */}
        <nav
          ref={dropdownRef}
          className="hidden md:flex items-center justify-center flex-1 max-w-3xl mx-auto gap-2 lg:gap-5 xl:gap-7 text-xs sm:text-sm font-serif font-bold text-stone-800"
        >
          {/* MENU 1: THỰC ĐƠN */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('menu')}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'menu' ? null : 'menu')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition cursor-pointer uppercase tracking-wider text-xs font-bold border ${
                activeDropdown === 'menu'
                  ? 'bg-[#ede2cb] text-[#52090c] border-[#801419]/40 shadow-xs'
                  : 'hover:bg-[#f2e7d3] hover:text-[#52090c] border-transparent text-stone-800'
              }`}
            >
              <Coffee className="w-4 h-4 text-[#801419]" />
              <span>Thực Đơn Quán Xưa</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'menu' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel: Thực Đơn */}
            {activeDropdown === 'menu' && (
              <div 
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute top-full left-0 mt-2 w-80 bg-[#fffdfa] rounded-lg shadow-xl border-2 border-[#801419]/30 p-3 animate-in fade-in zoom-in-95 duration-150 z-50 font-sans"
              >
                <div className="px-3 py-2 border-b border-[#e8dac1] flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-serif font-bold text-[#801419] uppercase tracking-wider">Danh Mục Cà Phê & Điểm Tâm</span>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="text-[11px] font-serif font-bold text-[#801419] hover:underline cursor-pointer"
                  >
                    Xem tất cả món →
                  </button>
                </div>

                <div className="space-y-1">
                  {/* 1. Cà Phê Phin Việt */}
                  <button
                    onClick={() => handleCategoryClick('phin')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-[#faf2e3] text-left transition group cursor-pointer border border-transparent hover:border-[#dfc8a5]"
                  >
                    <div className="w-8 h-8 rounded-md bg-[#801419]/10 text-[#801419] flex items-center justify-center shrink-0 group-hover:bg-[#801419] group-hover:text-amber-200 transition">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#801419]">Cà Phê Phin Sài Gòn</div>
                      <div className="text-[11px] text-stone-500">Phin Sữa Đá, Phin Đen Đá, Bạc Xỉu Xưa, Cà Phê Muối Cố Đô</div>
                    </div>
                  </button>

                  {/* 2. Bánh Mì & Điểm Tâm */}
                  <button
                    onClick={() => handleCategoryClick('pastry')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-[#faf2e3] text-left transition group cursor-pointer border border-transparent hover:border-[#dfc8a5]"
                  >
                    <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-800 group-hover:text-amber-100 transition">
                      <Croissant className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#801419]">Bánh Mì Chấm Cà Phê & Điểm Tâm</div>
                      <div className="text-[11px] text-stone-500">Bánh mì chấm sữa đá, bánh mì không nóng giòn, pate que cay</div>
                    </div>
                  </button>

                  {/* 3. PhinDi Thế Hệ Mới */}
                  <button
                    onClick={() => handleCategoryClick('phindi')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-[#faf2e3] text-left transition group cursor-pointer border border-transparent hover:border-[#dfc8a5]"
                  >
                    <div className="w-8 h-8 rounded-md bg-[#ede2cb] text-[#52090c] flex items-center justify-center shrink-0 group-hover:bg-[#801419] group-hover:text-amber-200 transition">
                      <Sparkles className="w-4 h-4 text-[#b45309]" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#801419]">PhinDi Sáng Tạo</div>
                      <div className="text-[11px] text-stone-500">PhinDi Hạnh Nhân bùi béo, PhinDi Kem Sữa, PhinDi Choco</div>
                    </div>
                  </button>

                  {/* 4. Freeze Đá Xay & Thạch Giòn */}
                  <button
                    onClick={() => handleCategoryClick('freeze')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-[#faf2e3] text-left transition group cursor-pointer border border-transparent hover:border-[#dfc8a5]"
                  >
                    <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-emerald-100 transition">
                      <CupSoda className="w-4 h-4 text-[#047857]" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-emerald-900">Freeze Đá Xay & Thạch</div>
                      <div className="text-[11px] text-stone-500">Freeze Trà Xanh Thạch Giòn, Freeze Cà Phê Phin</div>
                    </div>
                  </button>

                  {/* 5. Trà Sen Vàng & Trà Đào */}
                  <button
                    onClick={() => handleCategoryClick('tea')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-[#faf2e3] text-left transition group cursor-pointer border border-transparent hover:border-[#dfc8a5]"
                  >
                    <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-800 group-hover:text-amber-100 transition">
                      <Leaf className="w-4 h-4 text-[#d97706]" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#801419]">Trà Sen Vàng & Đào Xưa</div>
                      <div className="text-[11px] text-stone-500">Trà Sen Vàng Hạt Sen Huế, Trà Thạch Đào thanh mát</div>
                    </div>
                  </button>

                  {/* 6. Combo Ưu Đãi Tiết Kiệm */}
                  <button
                    onClick={() => handleCategoryClick('combo')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-[#faf2e3] text-left transition group cursor-pointer border border-transparent hover:border-[#dfc8a5]"
                  >
                    <div className="w-8 h-8 rounded-md bg-red-100 text-[#801419] flex items-center justify-center shrink-0 group-hover:bg-[#801419] group-hover:text-amber-200 transition">
                      <Zap className="w-4 h-4 text-[#801419]" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#801419]">Combo Sáng Sài Gòn</div>
                      <div className="text-[11px] text-stone-500">Phin Đen Đá + Bánh Mì Không, Combo Trà Chiều Thư Thái</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MENU 2: ĐỊA CHỈ QUÁN (QUẬN 1) */}
          <button
            onClick={() => handleLinkClick('/cua-hang', 'stores')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-[#ede2cb] hover:text-[#52090c] text-stone-800"
            title="Địa chỉ quán: 120 Pasteur, P. Bến Nghé, Quận 1, TP.HCM"
          >
            <MapPin className="w-4 h-4 text-[#801419]" />
            <span>Ghé Quán</span>
          </button>

          {/* MENU 3: CÂU CHUYỆN */}
          <button
            onClick={() => handleLinkClick('/cau-chuyen', 'story')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-[#ede2cb] hover:text-[#52090c] text-stone-800"
            title="Ký ức cà phê phin Sài Gòn xưa"
          >
            <BookOpen className="w-4 h-4 text-[#801419]" />
            <span>Ký Ức Quán</span>
          </button>

          {/* MENU 4: ƯU ĐÃI */}
          <button
            onClick={() => {
              if (onSelectCategory) {
                onSelectCategory('combo');
              }
              handleLinkClick('/uu-dai', 'menu');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-[#ede2cb] hover:text-[#52090c] text-stone-800"
            title="Xem mã giảm giá & combo ưu đãi hôm nay"
          >
            <Tag className="w-4 h-4 text-[#801419]" />
            <span>Phiếu Giảm Giá</span>
            <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#801419] text-amber-200 font-mono font-bold lowercase tracking-normal">
              -20%
            </span>
          </button>

        </nav>

        {/* Right: Action Buttons in Vintage Saigon Styling */}
        <div className="flex items-center gap-2.5">
          {/* Direct CTA: Đặt Món Nhanh (Vintage Ticket style) */}
          <button
            onClick={() => handleLinkClick('/thuc-don', 'menu')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#801419] hover:bg-[#660e12] text-amber-100 font-serif font-bold text-xs uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-sm border border-[#d4af37]"
            title="Đặt món mang đi, nhận sau 5 phút"
          >
            <Coffee className="w-4 h-4 text-amber-300" />
            <span>Đặt Món Ngay</span>
          </button>

          {/* Cart Button: Vintage Docket Style */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-md bg-[#23150d] hover:bg-[#150c07] border border-amber-900/60 text-amber-100 font-mono font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline font-serif text-xs font-bold uppercase tracking-wider">Phiếu Chọn</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-xs bg-[#d4af37] text-[#52090c] text-[10px] font-mono font-black min-w-5 text-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-stone-800 hover:bg-[#ede2cb] transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Grouped Accordion Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          {/* Current store summary */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-800" /> Quán tại Quận 1:
            </span>
            <span className="text-xs font-bold text-stone-900 truncate max-w-[200px]">120 Pasteur, Q.1</span>
          </div>

          {/* GROUP 1: THỰC ĐƠN ACCORDION */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'menu' ? null : 'menu')}
              className="w-full flex items-center justify-between p-3.5 bg-stone-50 font-bold text-xs text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-800" />
                <span>Thực Đơn Cà Phê & Đồ Uống</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${mobileExpandedGroup === 'menu' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'menu' && (
              <div className="p-2 space-y-1 bg-white border-t border-stone-100 text-xs">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 font-bold text-amber-900 flex items-center justify-between"
                >
                  <span>Xem Toàn Bộ Menu (18 món)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-800" />
                </button>
                <button
                  onClick={() => handleCategoryClick('phin')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-50 text-stone-700 flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-[#8c141c]" />
                  <span>Cà Phê Phin Việt (Phin Sữa Đá, Bạc Xỉu, Muối...)</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('phindi')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>PhinDi Thế Hệ Mới (Hạnh Nhân, Kem Sữa, Choco)</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('freeze')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50 text-stone-700 flex items-center gap-2"
                >
                  <CupSoda className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Freeze Đá Xay & Thạch Giòn (Trà Xanh, Caramel...)</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('tea')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <Leaf className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Trà Sen Vàng & Trà Đào</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('pastry')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-stone-700 flex items-center gap-2"
                >
                  <Croissant className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Bánh Mì Que Pate Cay Hải Phòng & Bánh Ngọt</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('combo')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-50 text-stone-700 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-[#b22830]" />
                  <span>Combo Tiết Kiệm (Phin + Bánh Mì, Trà + Bánh)</span>
                </button>
              </div>
            )}
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="space-y-1.5 pt-1">
            {/* Direct CTA: Đặt Món Mang Đi */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLinkClick('/thuc-don', 'menu');
              }}
              className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] text-white font-black text-xs flex items-center justify-between shadow-md ring-2 ring-amber-400/50 active:scale-95 transition"
            >
              <span className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-300" />
                <span>Đặt Món Mang Đi (Lấy Sau 5 Phút)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-stone-950 font-black">
                Hot
              </span>
            </button>

            {/* Địa Chỉ Quán (Quận 1) */}
            <button
              onClick={() => handleLinkClick('/cua-hang', 'stores')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-stone-800 font-bold text-xs flex items-center justify-between border border-stone-100 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Địa Chỉ Quán (120 Pasteur, Quận 1)</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Câu Chuyện Cầu Đất */}
            <button
              onClick={() => handleLinkClick('/cau-chuyen', 'story')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-stone-800 font-bold text-xs flex items-center justify-between border border-stone-100"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>Câu Chuyện Di Sản Cà Phê</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Mã Giảm Giá & Ưu Đãi */}
            <button
              onClick={() => handleLinkClick('/thuc-don', 'menu')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-stone-800 font-bold text-xs flex items-center justify-between border border-stone-100"
            >
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-800" />
                <span>Mã Giảm Giá & Ưu Đãi Hôm Nay</span>
              </span>
              <span className="text-[10px] bg-red-100 text-[#b22830] font-black px-1.5 py-0.5 rounded">
                -20%
              </span>
            </button>

          </div>
        </div>
      )}
    </header>
  );
};

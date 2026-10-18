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
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSeoShare,
  onOpenTableBooking,
  selectedStore,
  onOpenStoreModal,
  onSelectCategory,
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
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-amber-950/10 transition-all">
      {/* Top micro banner */}
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
          <Share2 className="w-3 h-3" /> Chia sẻ link quán & SEO
        </button>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Store pill */}
        <div className="flex items-center gap-5">
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

          {/* Desktop Store Location Pill */}
          <button
            onClick={() => handleLinkClick('/cua-hang', 'stores')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/60 hover:bg-amber-100 border border-amber-300/60 text-xs text-amber-950 transition cursor-pointer"
            title="Bấm để xem các điểm lấy hàng"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span className="font-semibold">{selectedStore.district}:</span>
            <span className="text-stone-600 truncate max-w-[120px]">{selectedStore.name}</span>
          </button>
        </div>

        {/* Center: Clean Grouped Dropdown Navigation */}
        <nav ref={dropdownRef} className="hidden md:flex items-center gap-2 text-xs font-semibold text-stone-700">
          
          {/* MENU GROUP 1: THỰC ĐƠN */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('menu')}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'menu' ? null : 'menu')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold ${
                activeDropdown === 'menu'
                  ? 'bg-amber-100/80 text-amber-900 shadow-2xs'
                  : 'hover:bg-amber-100/50 hover:text-amber-900'
              }`}
            >
              <Coffee className="w-4 h-4 text-amber-800" />
              <span>Thực Đơn</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'menu' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel: Thực Đơn */}
            {activeDropdown === 'menu' && (
              <div 
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-3 animate-in fade-in zoom-in-95 duration-150 z-50"
              >
                <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Danh Mục Cà Phê & Đồ Uống</span>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    Xem tất cả món →
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryClick('traditional')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-200">
                      <Flame className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Cà Phê Việt & Muối Biển</div>
                      <div className="text-[11px] text-stone-500">Cà phê muối xứ Huế, Bạc xỉu ba tầng, Phin sữa đá</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCategoryClick('espresso')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-900 flex items-center justify-center shrink-0 group-hover:bg-orange-200">
                      <Sparkles className="w-4 h-4 text-orange-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Espresso & Sữa Hạt</div>
                      <div className="text-[11px] text-stone-500">Oatly vanilla latte, Americano Cầu Đất, Cappuccino</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCategoryClick('coldbrew')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-900 flex items-center justify-center shrink-0 group-hover:bg-sky-200">
                      <CupSoda className="w-4 h-4 text-sky-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Cold Brew Ủ Lạnh 24H</div>
                      <div className="text-[11px] text-stone-500">Cold brew cam sả thanh mát, ủ chậm 24 giờ</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCategoryClick('tea')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 group-hover:bg-emerald-200">
                      <Leaf className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Trà Tươi & Macchiato</div>
                      <div className="text-[11px] text-stone-500">Trà sen vàng Cố Đô, Macchiato béo mịn</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCategoryClick('pastry')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-200">
                      <Croissant className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Bánh Ngọt & Pastry</div>
                      <div className="text-[11px] text-stone-500">Croissant bơ Pháp giòn tan, bánh chuối nướng</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MENU GROUP 2: DỊCH VỤ & ĐẶT CHỖ */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('services')}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold ${
                activeDropdown === 'services'
                  ? 'bg-amber-100/80 text-amber-900 shadow-2xs'
                  : 'hover:bg-amber-100/50 hover:text-amber-900'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-800" />
              <span>Dịch Vụ & Đặt Chỗ</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel: Dịch Vụ */}
            {activeDropdown === 'services' && (
              <div 
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute top-full left-0 mt-2 w-84 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-3 animate-in fade-in zoom-in-95 duration-150 z-50"
              >
                <div className="px-3 py-2 border-b border-stone-100 mb-1.5">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Dịch Vụ Khách Hàng</span>
                </div>

                <div className="space-y-1">
                  {/* Option 1: Đặt bàn */}
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onOpenTableBooking();
                      handleLinkClick('/dat-ban');
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 text-left transition border border-amber-200/70 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Armchair className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <span>Đặt Bàn Giữ Chỗ Trước</span>
                        <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">Miễn phí</span>
                      </div>
                      <div className="text-[11px] text-stone-600 mt-0.5">
                        Điền tên, số người, tự động đồng bộ Google Sheets & Bot Telegram
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Đặt món mang đi */}
                  <button
                    onClick={() => handleLinkClick('/thuc-don', 'menu')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-900">
                      <Zap className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Đặt Món Mang Đi (5 Phút)</div>
                      <div className="text-[11px] text-stone-500">Đặt trước, tới quầy lấy liền không cần xếp hàng</div>
                    </div>
                  </button>

                  {/* Option 3: Điểm lấy hàng */}
                  <button
                    onClick={() => handleLinkClick('/cua-hang', 'stores')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-900">
                      <MapPin className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Điểm Lấy Hàng & Chi Nhánh</div>
                      <div className="text-[11px] text-stone-500">4 điểm nhận tại TP.HCM & Hà Nội, giờ mở cửa</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MENU GROUP 3: KHÁM PHÁ & TIỆN ÍCH */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('explore')}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold ${
                activeDropdown === 'explore'
                  ? 'bg-amber-100/80 text-amber-900 shadow-2xs'
                  : 'hover:bg-amber-100/50 hover:text-amber-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-800" />
              <span>Khám Phá</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel: Khám Phá */}
            {activeDropdown === 'explore' && (
              <div 
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-3 animate-in fade-in zoom-in-95 duration-150 z-50"
              >
                <div className="px-3 py-2 border-b border-stone-100 mb-1.5">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Thông Tin & Tiện Ích</span>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => handleLinkClick('/cau-chuyen', 'story')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                      <Coffee className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Câu Chuyện Hạt Cầu Đất</div>
                      <div className="text-[11px] text-stone-500">Nông trại độ cao 1600m, rang mộc 100% không hương liệu</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onOpenSeoShare();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-900">
                      <Share2 className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Chia Sẻ Link & SEO Preview</div>
                      <div className="text-[11px] text-stone-500">Xem trước link trên Zalo/Facebook, mã QR chia sẻ</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Right: Quick Action Buttons (Neat & Clean) */}
        <div className="flex items-center gap-2.5">
          {/* Direct CTA: Đặt Bàn Nhanh */}
          <button
            onClick={() => {
              onOpenTableBooking();
              handleLinkClick('/dat-ban');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
            title="Đặt bàn trước, giữ chỗ miễn phí"
          >
            <Armchair className="w-4 h-4 text-amber-800" />
            <span>Đặt Bàn</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
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
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
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
              <MapPin className="w-3.5 h-3.5 text-amber-800" /> Điểm lấy gần nhất:
            </span>
            <span className="text-xs font-bold text-stone-900 truncate max-w-[180px]">{selectedStore.name}</span>
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
                  <span>Xem Toàn Bộ Menu</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-800" />
                </button>
                <button
                  onClick={() => handleCategoryClick('traditional')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cà Phê Việt & Muối Biển</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('espresso')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Espresso & Sữa Hạt</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('coldbrew')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <CupSoda className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cold Brew Ủ Lạnh 24H</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('tea')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <Leaf className="w-3.5 h-3.5 text-amber-700" />
                  <span>Trà Tươi & Macchiato</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('pastry')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-stone-700 flex items-center gap-2"
                >
                  <Croissant className="w-3.5 h-3.5 text-amber-700" />
                  <span>Bánh Ngọt & Pastry</span>
                </button>
              </div>
            )}
          </div>

          {/* GROUP 2: DỊCH VỤ & ĐẶT CHỖ ACCORDION */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'services' ? null : 'services')}
              className="w-full flex items-center justify-between p-3.5 bg-stone-50 font-bold text-xs text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-800" />
                <span>Dịch Vụ & Đặt Chỗ</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${mobileExpandedGroup === 'services' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'services' && (
              <div className="p-2 space-y-1.5 bg-white border-t border-stone-100 text-xs">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTableBooking();
                    handleLinkClick('/dat-ban');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-amber-100/80 text-amber-950 font-bold border border-amber-300/80 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-amber-800" />
                    <span>Đặt Bàn Giữ Chỗ (Miễn phí)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-800" />
                </button>

                <button
                  onClick={() => handleLinkClick('/thuc-don', 'menu')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  <span>Đặt Món Mang Đi (Lấy sau 5 phút)</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/cua-hang', 'stores')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Danh Sách 4 Điểm Nhận Hàng</span>
                </button>
              </div>
            )}
          </div>

          {/* GROUP 3: KHÁM PHÁ & TIỆN ÍCH ACCORDION */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'explore' ? null : 'explore')}
              className="w-full flex items-center justify-between p-3.5 bg-stone-50 font-bold text-xs text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>Khám Phá & Tiện Ích</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${mobileExpandedGroup === 'explore' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'explore' && (
              <div className="p-2 space-y-1 bg-white border-t border-stone-100 text-xs">
                <button
                  onClick={() => handleLinkClick('/cau-chuyen', 'story')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Nông Trại Hạt Cầu Đất 1600m</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSeoShare();
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Chia Sẻ Link Quán & SEO</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

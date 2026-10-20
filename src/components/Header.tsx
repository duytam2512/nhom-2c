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
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { Logo } from './Logo';
import { CoffeeCategory, StoreLocation } from '../types/coffee';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSeoShare: () => void;
  onOpenTableBooking: (initialTab?: 'form' | 'sheets' | 'telegram') => void;
  selectedStore: StoreLocation;
  onOpenStoreModal?: () => void;
  onSelectCategory?: (category: CoffeeCategory) => void;
  onOpenChatbot?: () => void;
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
      {/* Top micro banner in Highlands Signature Crimson Red */}
      <div className="bg-gradient-to-r from-[#7f131a] via-[#9e1c24] to-[#7f131a] text-amber-200 text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap border-b border-[#630f14] shadow-xs">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>⚡ Nhận cà phê sau 5 phút • Giữ chỗ bàn miễn phí • Giảm 20% đơn đầu tiên: <strong className="text-white underline decoration-amber-400">GOCOFFEE20</strong></span>
        </span>
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
            title="Go Coffee"
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
                  {/* 1. Cà Phê Phin Việt */}
                  <button
                    onClick={() => handleCategoryClick('phin')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-red-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-[#8c141c] flex items-center justify-center shrink-0 group-hover:bg-red-200">
                      <Flame className="w-4 h-4 text-[#8c141c]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Cà Phê Phin Việt</div>
                      <div className="text-[11px] text-stone-500">Phin Sữa Đá, Phin Đen Đá, Bạc Xỉu, Cà Phê Muối Cố Đô</div>
                    </div>
                  </button>

                  {/* 2. PhinDi Thế Hệ Mới */}
                  <button
                    onClick={() => handleCategoryClick('phindi')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-200">
                      <Sparkles className="w-4 h-4 text-[#b45309]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">PhinDi Thế Hệ Mới</div>
                      <div className="text-[11px] text-stone-500">PhinDi Hạnh Nhân bùi béo, PhinDi Kem Sữa, PhinDi Choco</div>
                    </div>
                  </button>

                  {/* 3. Freeze Đá Xay & Thạch Giòn */}
                  <button
                    onClick={() => handleCategoryClick('freeze')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 group-hover:bg-emerald-200">
                      <CupSoda className="w-4 h-4 text-[#047857]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">Freeze Đá Xay & Thạch Giòn</div>
                      <div className="text-[11px] text-stone-500">Freeze Trà Xanh Thạch Giòn, Caramel Phin, Cookies & Cream</div>
                    </div>
                  </button>

                  {/* 4. Trà Sen Vàng & Trà Đào */}
                  <button
                    onClick={() => handleCategoryClick('tea')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-200">
                      <Leaf className="w-4 h-4 text-[#d97706]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Trà Sen Vàng & Trà Đào</div>
                      <div className="text-[11px] text-stone-500">Trà Sen Vàng Hạt Sen Huế, Trà Thạch Đào, Trà Thanh Đào</div>
                    </div>
                  </button>

                  {/* 5. Bánh Mì Que & Bánh Ngọt */}
                  <button
                    onClick={() => handleCategoryClick('pastry')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-900 flex items-center justify-center shrink-0 group-hover:bg-orange-200">
                      <Croissant className="w-4 h-4 text-[#ea580c]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">Bánh Mì Que & Bánh Ngọt</div>
                      <div className="text-[11px] text-stone-500">Bánh Mì Que Pate Cay Hải Phòng, Cheesecake Cà Phê, Mousse Cacao</div>
                    </div>
                  </button>

                  {/* 6. Combo Ưu Đãi Tiết Kiệm */}
                  <button
                    onClick={() => handleCategoryClick('combo')}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-red-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-[#b22830] flex items-center justify-center shrink-0 group-hover:bg-red-200">
                      <Zap className="w-4 h-4 text-[#b22830]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-red-900">Combo Tiết Kiệm</div>
                      <div className="text-[11px] text-stone-500">Combo Sáng (Phin + Bánh Mì Que), Combo Trà Chiều Thư Thái</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MENU 2: QUÁN CÀ PHÊ (HỆ THỐNG QUÁN) */}
          <button
            onClick={() => handleLinkClick('/cua-hang', 'stores')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-amber-100/50 hover:text-amber-900"
          >
            <MapPin className="w-4 h-4 text-amber-800" />
            <span>Quán Cà Phê</span>
          </button>

          {/* MENU 3: CÂU CHUYỆN DI SẢN */}
          <button
            onClick={() => handleLinkClick('/cau-chuyen', 'story')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-amber-100/50 hover:text-amber-900"
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Câu Chuyện</span>
          </button>

          {/* MENU 4: ƯU ĐÃI & VOUCHER */}
          <button
            onClick={() => handleLinkClick('/thuc-don', 'menu')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-amber-100/50 hover:text-amber-900 text-stone-700"
          >
            <Tag className="w-4 h-4 text-amber-800" />
            <span>Ưu Đãi</span>
          </button>

          {/* MENU 5: CHIA SẺ & SEO PREVIEW */}
          <button
            onClick={onOpenSeoShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-amber-100/50 hover:text-amber-900 text-stone-700"
            title="Xem chuẩn SEO & Chia sẻ link"
          >
            <Share2 className="w-4 h-4 text-amber-800" />
            <span>Chia Sẻ</span>
          </button>

          {/* MENU 6: KẾT NỐI GOOGLE SHEET & TELEGRAM */}
          <button
            onClick={() => onOpenTableBooking('sheets')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer uppercase tracking-wider text-xs font-bold hover:bg-emerald-100/60 hover:text-emerald-900 text-stone-700"
            title="Quản lý đồng bộ tệp khách hàng về Google Sheet & Telegram Bot"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Sheet & Bot</span>
          </button>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Direct CTA: Đặt Bàn Nhanh */}
          <button
            onClick={() => {
              onOpenTableBooking();
              handleLinkClick('/dat-ban');
            }}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] hover:from-[#c41e27] hover:to-[#9b1c24] text-white font-black text-xs transition cursor-pointer active:scale-95 shadow-md shadow-red-950/20 ring-2 ring-amber-400/50"
            title="Đặt bàn trước, giữ chỗ miễn phí"
          >
            <Armchair className="w-4 h-4 text-amber-300" />
            <span>Đặt Bàn</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2.5 rounded-xl bg-[#2a170d] hover:bg-stone-900 border border-amber-900/40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#701217] text-[10px] font-black min-w-5 text-center shadow-xs">
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
            {/* Direct CTA: Đặt bàn giữ chỗ */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTableBooking();
                handleLinkClick('/dat-ban');
              }}
              className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] text-white font-black text-xs flex items-center justify-between shadow-md ring-2 ring-amber-400/50 active:scale-95 transition"
            >
              <span className="flex items-center gap-2">
                <Armchair className="w-4 h-4 text-amber-300" />
                <span>Đặt Bàn Giữ Chỗ Trước (Miễn phí)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-stone-950 font-black">
                Hot
              </span>
            </button>

            {/* Quán Cà Phê */}
            <button
              onClick={() => handleLinkClick('/cua-hang', 'stores')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-stone-800 font-bold text-xs flex items-center justify-between border border-stone-100"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Hệ Thống Quán Go Coffee</span>
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

            {/* Chia Sẻ Link & SEO */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSeoShare();
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 text-xs flex items-center justify-between border border-stone-100"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-700" />
                <span>Chia Sẻ Link Quán & Chuẩn SEO</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Đồng Bộ Google Sheet & Telegram Bot */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTableBooking('sheets');
              }}
              className="w-full text-left p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-between border border-emerald-200/80"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Kết Nối Google Sheet & Telegram</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-black px-1.5 py-0.5 rounded">
                Tự động
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

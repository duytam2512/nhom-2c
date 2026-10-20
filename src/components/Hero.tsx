import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Zap, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  QrCode,
  Armchair,
  Tag,
  Flame,
  Check,
  Copy
} from 'lucide-react';

import { MenuItem } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface HeroProps {
  onOrderNow: () => void;
  onCustomizeItem?: (item: MenuItem) => void;
  onOpenSeoShare: () => void;
  onOpenTableBooking?: () => void;
  onOpenChatbot?: () => void;
}

const SLIDE_ITEM_MAP: Record<string, string> = {
  phin: 'hl-phin-sua-da',
  freeze: 'hl-freeze-tra-xanh',
  'tra-sen': 'hl-tra-sen-vang',
  'banh-mi': 'hl-banh-mi-que',
};

const HERO_FEATURED_SLIDES = [
  {
    id: 'phin',
    tag: 'TỰ HÀO CÀ PHÊ VIỆT',
    title: 'Phin Sữa Đá Đậm Vị',
    subtitle: 'Hạt Robusta & Arabica rang xay theo bí quyết Go Coffee, chiết xuất từng giọt phin chậm rãi kết hợp sữa đặc béo ngậy.',
    price: '39.000đ',
    badge: 'Best Seller #1',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    color: 'from-[#8c141c] to-[#b22830]',
  },
  {
    id: 'freeze',
    tag: 'ĐÁ XAY SẢNG KHOÁI',
    title: 'Freeze Trà Xanh Thạch Giòn',
    subtitle: 'Matcha Nhật Bản xay tuyết mát lạnh cùng sữa tươi, lót lớp thạch trà xanh giòn dai sần sật và phủ bông kem whipped cream béo ngậy.',
    price: '55.000đ',
    badge: 'Biểu Tượng Go Coffee',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=85',
    color: 'from-[#065f46] to-[#047857]',
  },
  {
    id: 'tra-sen',
    tag: 'TINH HOA TRÀ VIỆT',
    title: 'Trà Sen Vàng Hạt Sen Huế',
    subtitle: 'Trà Oolong thượng hạng ngát hương sen, hạt sen tươi hầm mềm bùi dẻo, củ năng giòn rụm và lớp kem phô mai Macchiato béo mịn.',
    price: '52.000đ',
    badge: 'Món Yêu Thích',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=85',
    color: 'from-[#b45309] to-[#d97706]',
  },
  {
    id: 'banh-mi',
    tag: 'BỮA PHỤ GIÒN RỤM',
    title: 'Bánh Mì Que Pate Cay Hải Phòng',
    subtitle: 'Bánh mì nướng nóng hổi giòn tan, pate gan béo đậm đà kết hợp chí chương ớt cay nồng đúng điệu ăn kèm cà phê phin.',
    price: '25.000đ',
    badge: 'Combo Tiết Kiệm',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=85',
    color: 'from-[#7c2d12] to-[#c2410c]',
  },
];

export const Hero: React.FC<HeroProps> = ({ 
  onOrderNow, 
  onCustomizeItem,
  onOpenSeoShare,
  onOpenTableBooking,
  onOpenChatbot 
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % HERO_FEATURED_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_FEATURED_SLIDES[activeSlideIndex];

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-14 lg:py-16 bg-[#faf7f2] border-b border-amber-950/10">
      {/* Decorative background Highlands glow */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[400px] bg-gradient-to-br from-red-600/10 via-amber-300/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Highlands Promos & Interactive Vouchers Bar */}
        <div className="mb-6 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#8c141c] via-[#b22830] to-[#8c141c] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border border-amber-400/40">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-100 text-center sm:text-left">
            <Tag className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Mã giảm giá độc quyền hôm nay:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Voucher 1 */}
            <button
              onClick={() => handleCopyCode('GOCOFFEE20')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 border border-amber-300/50 text-[11px] font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95"
              title="Bấm để sao chép mã giảm 20%"
            >
              <span>GOCOFFEE20</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 px-1 py-0.2 rounded font-black">-20%</span>
              {copiedCode === 'GOCOFFEE20' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300/70" />}
            </button>

            {/* Voucher 2 */}
            <button
              onClick={() => handleCopyCode('FREESHIP')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 border border-amber-300/50 text-[11px] font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95"
              title="Bấm để sao chép mã freeship"
            >
              <span>FREESHIP</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 px-1 py-0.2 rounded font-black">Free</span>
              {copiedCode === 'FREESHIP' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300/70" />}
            </button>

            {/* Voucher 3 */}
            <button
              onClick={() => handleCopyCode('GOCOFFEE30')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 border border-amber-300/50 text-[11px] font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95"
              title="Bấm để sao chép mã tri ân 30k"
            >
              <span>GOCOFFEE30</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 px-1 py-0.2 rounded font-black">-30K</span>
              {copiedCode === 'GOCOFFEE30' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300/70" />}
            </button>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Highlands-style Typography & High-converting CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Go Coffee Heritage Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-300 text-[#8c141c] text-xs font-black shadow-2xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#b22830] animate-ping" />
              <span>Go Coffee • Tinh Hoa Cà Phê Việt</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-stone-900 tracking-tight leading-[1.12]">
              Hương Vị Go Coffee <br />
              <span className="text-[#b22830] underline decoration-amber-400 decoration-wavy decoration-2">
                Đậm Đà Bản Sắc
              </span>{' '}
              Tiện Lợi Mọi Nơi
            </h1>

            {/* Description */}
            <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Thưởng thức tinh hoa Cà phê Phin Sữa Đá truyền thống, Freeze Trà Xanh mát lạnh, Trà Sen Vàng dẻo bùi và Bánh mì que giòn rụm. Đặt trước nhận hàng sau 5 phút hoặc đặt bàn giữ chỗ không gian thoải mái.
            </p>

            {/* Interactive Slide Selector Tabs (like Highlands Website) */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 overflow-x-auto pb-1">
              {HERO_FEATURED_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSlideIndex === index
                      ? 'bg-[#b22830] text-white shadow-md shadow-red-950/20 scale-105'
                      : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {slide.title.split(' ')[0]} {slide.title.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* Context-aware Featured Product Action (Optimized & Non-repetitive) */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                {/* 1. Direct Customize & Add Current Featured Drink */}
                <button
                  onClick={() => {
                    const targetItem =
                      MENU_ITEMS.find((m) => m.id === SLIDE_ITEM_MAP[currentSlide.id]) || MENU_ITEMS[0];
                    if (onCustomizeItem) {
                      onCustomizeItem(targetItem);
                    } else {
                      onOrderNow();
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] hover:from-[#c41e27] hover:to-[#9b1c24] text-white font-black text-sm shadow-xl shadow-red-950/25 ring-2 ring-amber-400/50 flex items-center justify-center gap-2.5 transition active:scale-95 group cursor-pointer"
                  title={`Bấm để chọn size, đá, đường cho ${currentSlide.title}`}
                >
                  <Coffee className="w-4 h-4 text-amber-300" />
                  <span>Thưởng Thức {currentSlide.title.split(' ')[0]} {currentSlide.title.split(' ')[1]} ({currentSlide.price})</span>
                  <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. Find Nearest Store (Distinct from Menu & Booking) */}
                <button
                  onClick={() => {
                    const el = document.getElementById('stores');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
                  title="Tìm điểm quán Go Coffee gần bạn nhất"
                >
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <span>Tìm Quán Gần Bạn</span>
                </button>
              </div>

              {/* Sub-bar: Chat với Barista . Go Coffee Callout */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs">
                {onOpenChatbot && (
                  <button
                    onClick={onOpenChatbot}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-[#8c141c] font-bold text-xs cursor-pointer transition active:scale-95 shadow-2xs group"
                    title="Bấm để mở Chat với Barista . Go Coffee tư vấn món hợp khẩu vị"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#b22830] group-hover:rotate-12 transition-transform" />
                    <span>Chat với <strong>Barista . Go Coffee</strong></span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#b22830] text-amber-200 font-black uppercase tracking-wider">
                      Gemini AI
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Highlands Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[#b22830] font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Hơn 500+ quán toàn quốc</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-stone-900 font-bold text-sm sm:text-base">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>5 Phút</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Lấy đồ nhanh không chờ</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100%</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Cà phê rang mộc Tây Nguyên</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Product Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Product Card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 aspect-4/5 relative group transition-all duration-500">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#b22830] text-amber-200 text-xs font-black uppercase tracking-wider shadow-md">
                    {currentSlide.badge}
                  </span>
                </div>

                {/* Hero Card Bottom Overlay */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-1">
                    {currentSlide.tag}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-serif leading-tight">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                    <span className="text-xl font-black text-amber-300">
                      {currentSlide.price}
                    </span>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.history.pushState(null, '', '/thuc-don');
                        }
                        onOrderNow();
                      }}
                      className="text-xs bg-gradient-to-r from-[#b22830] to-[#8c141c] hover:from-[#c41e27] hover:to-[#9b1c24] text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md active:scale-95"
                    >
                      Tùy Biến & Đặt Ngay →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: 5-minute Grab-and-go */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-[#b22830] flex items-center justify-center font-bold text-base">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Go Coffee Quick Pickup</div>
                  <div className="text-[11px] text-stone-500">Chuẩn bị sau 5 phút</div>
                </div>
              </div>

              {/* Floating Badge 2: VietQR Fast Pay */}
              <div className="absolute -bottom-3 -right-3 sm:-right-5 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">VietQR NAPAS 24/7</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Tự động nhận đơn trong 1s</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

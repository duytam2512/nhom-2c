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
  'banh-mi-cham': 'hl-banh-mi-cham-cafe',
  combo: 'hl-combo-sang-saigon',
  phin: 'hl-phin-sua-da',
  'tra-sen': 'hl-tra-sen-vang',
};

const HERO_FEATURED_SLIDES = [
  {
    id: 'banh-mi-cham',
    tag: 'MÓN XƯA TRUYỀN THỐNG SÀI GÒN',
    title: 'Bánh Mì Chấm Cà Phê Sữa Đá',
    subtitle: 'Ký ức Sài Gòn xưa mộc mạc: Ổ bánh mì nóng giòn rụm xé chấm ngập trong ly phin sữa đá béo ngọt đậm đà khó quên.',
    price: '39.000đ',
    badge: 'Món Xưa Độc Đáo',
    image: '/images/banh_mi_cham_cafe_sua_da.jpg',
    color: 'from-[#801419] to-[#4a080c]',
  },
  {
    id: 'combo',
    tag: 'BỮA SÁNG SÀI GÒN XƯA',
    title: 'Combo Phin Đen Đá & Bánh Mì',
    subtitle: 'Một ly phin đen đá đậm đà rang mộc thơm lừng kèm một ổ bánh mì không nóng giòn - khởi đầu ngày mới chuẩn phong vị phố thị xưa.',
    price: '38.000đ',
    badge: 'Combo Buổi Sáng',
    image: '/images/combo_phin_den_banh_mi.jpg',
    color: 'from-[#3b1e10] to-[#1c0d06]',
  },
  {
    id: 'phin',
    tag: 'TỰ HÀO CÀ PHÊ PHIN VIỆT',
    title: 'Phin Sữa Đá Cầu Đất Đậm Vị',
    subtitle: 'Robusta & Arabica rang mộc theo bí quyết thủ công gia truyền, chiết xuất từng giọt phin chậm rãi kết hợp sữa đặc ngọt béo.',
    price: '39.000đ',
    badge: 'Gia Truyền #1',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    color: 'from-[#801419] to-[#9b1c24]',
  },
  {
    id: 'tra-sen',
    tag: 'TINH HOA TRÀ CỐ ĐÔ',
    title: 'Trà Sen Vàng Hạt Sen Huế',
    subtitle: 'Trà Oolong thượng hạng ngát hương sen hồ Tịnh Tâm, hạt sen tươi hầm mềm bùi dẻo, củ năng giòn rụm và lớp kem phô mai béo ngậy.',
    price: '52.000đ',
    badge: 'Thanh Mát Thư Thái',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=85',
    color: 'from-[#b45309] to-[#78350f]',
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

  const currentSlide = HERO_FEATURED_SLIDES[activeSlideIndex] || HERO_FEATURED_SLIDES[0];

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-14 lg:py-16 bg-[#faf5ec] border-b-2 border-[#801419]/20">
      {/* Subtle warm nostalgic background glow */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[400px] bg-gradient-to-br from-[#d4af37]/15 via-[#801419]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Retro Vouchers Docket Bar */}
        <div className="mb-6 p-3 rounded-lg bg-[#801419] text-amber-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-[#d4af37]/70">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-amber-200 text-center sm:text-left">
            <Tag className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Phiếu quà tặng ưu đãi quán xưa hôm nay:</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {/* Voucher 1 */}
            <button
              onClick={() => handleCopyCode('GOCOFFEE20')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#52090c] hover:bg-[#3d0608] border border-dashed border-[#d4af37] text-xs font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95 shadow-inner"
              title="Bấm để sao chép mã giảm 20%"
            >
              <span>GOCOFFEE20</span>
              <span className="text-[10px] bg-[#d4af37] text-[#52090c] px-1 py-0.2 rounded font-black">-20%</span>
              {copiedCode === 'GOCOFFEE20' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300/70" />}
            </button>

            {/* Voucher 2 */}
            <button
              onClick={() => handleCopyCode('FREESHIP')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#52090c] hover:bg-[#3d0608] border border-dashed border-[#d4af37] text-xs font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95 shadow-inner"
              title="Bấm để sao chép mã freeship"
            >
              <span>FREESHIP</span>
              <span className="text-[10px] bg-[#d4af37] text-[#52090c] px-1 py-0.2 rounded font-black">Miễn Phí</span>
              {copiedCode === 'FREESHIP' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300/70" />}
            </button>

            {/* Voucher 3 */}
            <button
              onClick={() => handleCopyCode('GOCOFFEE30')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#52090c] hover:bg-[#3d0608] border border-dashed border-[#d4af37] text-xs font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95 shadow-inner"
              title="Bấm để sao chép mã tri ân 30k"
            >
              <span>GOCOFFEE30</span>
              <span className="text-[10px] bg-[#d4af37] text-[#52090c] px-1 py-0.2 rounded font-black">-30K</span>
              {copiedCode === 'GOCOFFEE30' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300/70" />}
            </button>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Vintage Saigon Typography & Stories */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Vintage Saigon Heritage Stamp */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#ede2cb] border-2 border-[#801419]/40 text-[#801419] text-xs font-serif font-black uppercase tracking-widest shadow-2xs">
              <span className="text-amber-700">❖</span>
              <span>Quán Cà Phê Sài Gòn Xưa • 120 Pasteur Quận 1</span>
              <span className="text-amber-700">❖</span>
            </div>

            {/* Main Headline with Old Saigon Bill-board Lettering */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-[#23150d] tracking-tight leading-[1.15]">
              Hương Vị Sài Gòn Xưa <br />
              <span className="text-[#801419] italic font-serif">
                Đậm Đà Từng Giọt Phin
              </span> <br />
              Mộc Mạc & Nóng Giòn
            </h1>

            {/* Description */}
            <p className="text-stone-700 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Gìn giữ thói quen bình dị của người Sài Gòn: Ngồi nhâm nhi ly Phin Sữa Đá tí tách rơi, chấm miếng bánh mì nóng hổi giòn rụm vào cà phê sánh đậm. Đặt món trước qua web, ghé lấy sau 5 phút tại góc phố 120 Pasteur (đối diện Saigon Centre).
            </p>

            {/* Interactive Slide Selector Tabs in Retro Style */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 overflow-x-auto pb-1">
              {HERO_FEATURED_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(index)}
                  className={`px-3.5 py-1.5 rounded-sm text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    activeSlideIndex === index
                      ? 'bg-[#801419] text-amber-200 border-[#d4af37] shadow-sm'
                      : 'bg-[#fffdfa] hover:bg-[#ede2cb] text-stone-800 border-[#d6c7b2]'
                  }`}
                >
                  {slide.title}
                </button>
              ))}
            </div>

            {/* Action Buttons in Classic Lacquer & Brass Palette */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                {/* 1. Direct Customize & Add Current Featured Item */}
                <button
                  onClick={() => {
                    const slideId = currentSlide?.id || 'banh-mi-cham';
                    const targetItem =
                      MENU_ITEMS.find((m) => m.id === SLIDE_ITEM_MAP[slideId]) || MENU_ITEMS[0];
                    if (onCustomizeItem) {
                      onCustomizeItem(targetItem);
                    } else {
                      onOrderNow();
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-sm shadow-md border-2 border-[#d4af37] flex items-center justify-center gap-2.5 transition active:scale-95 group cursor-pointer"
                  title={`Bấm để chọn món: ${currentSlide?.title || 'món'}`}
                >
                  <Coffee className="w-4 h-4 text-amber-300" />
                  <span>Thưởng Thức: {currentSlide?.title} ({currentSlide?.price})</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. Direct Link to Full Menu */}
                <button
                  onClick={onOrderNow}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-[#fffdfa] hover:bg-[#ede2cb] border-2 border-[#801419]/30 text-stone-900 font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                  title="Xem toàn bộ thực đơn quán xưa"
                >
                  <span>Xem Bảng Giá Thực Đơn</span>
                </button>
              </div>
            </div>

            {/* Old Saigon Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#801419]/15 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[#801419] font-serif font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
                  <span>4.9 / 5</span>
                </div>
                <p className="text-[11px] text-stone-600 font-serif">Khách quen Sài Gòn</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-stone-900 font-serif font-bold text-sm sm:text-base">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>5 Phút</span>
                </div>
                <p className="text-[11px] text-stone-600 font-serif">Lấy ngay không đợi</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-800 font-serif font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Mộc</span>
                </div>
                <p className="text-[11px] text-stone-600 font-serif">Rang củi Tây Nguyên</p>
              </div>
            </div>
          </div>

          {/* Right Column: Vintage Framed Photo Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Vintage Framed Card */}
              <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-[#fffdfa] bg-stone-950 aspect-4/5 relative group transition-all duration-500 ring-2 ring-[#801419]/30">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/banh_mi_cham_cafe_sua_da.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                {/* Top Stamp Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-sm bg-[#801419] text-amber-200 text-xs font-serif font-black uppercase tracking-wider shadow-md border border-[#d4af37]">
                    {currentSlide.badge}
                  </span>
                </div>

                {/* Hero Card Bottom Overlay in Vintage Typography */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-[11px] uppercase tracking-widest text-amber-300 font-serif font-bold mb-1">
                    {currentSlide.tag}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-serif leading-tight text-[#fffdfa]">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-stone-200 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {currentSlide.subtitle}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-200/20">
                    <span className="text-xl font-mono font-bold text-amber-300">
                      {currentSlide.price}
                    </span>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.history.pushState(null, '', '/thuc-don');
                        }
                        onOrderNow();
                      }}
                      className="text-xs bg-[#801419] hover:bg-[#660e12] border border-[#d4af37] text-amber-100 font-serif font-bold px-4 py-2 rounded-sm transition cursor-pointer shadow-md active:scale-95"
                    >
                      Đặt Món Ngay →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: 5-minute Grab-and-go Vintage Stamp */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-[#fffdfa] p-2.5 sm:p-3 rounded-md shadow-xl border-2 border-[#801419]/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#801419] text-amber-200 flex items-center justify-center font-bold text-base shadow-inner">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-serif font-bold text-stone-900">Giao Lấy Sau 5 Phút</div>
                  <div className="text-[11px] text-stone-500 font-mono">120 Pasteur, Q.1</div>
                </div>
              </div>

              {/* Floating Badge 2: VietQR Fast Pay Vintage Stamp */}
              <div className="absolute -bottom-3 -right-3 sm:-right-5 bg-[#fffdfa] p-2.5 sm:p-3 rounded-md shadow-xl border-2 border-[#801419]/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-serif font-bold text-stone-900">Quét VietQR 24/7</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Nhận đơn tức thì</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


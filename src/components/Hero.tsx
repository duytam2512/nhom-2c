/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Coffee, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  Check, 
  Copy, 
  Layers, 
  QrCode,
  Star
} from 'lucide-react';
import { MenuItem } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';
import { trackConversion } from '../services/conversionTracker';

interface HeroProps {
  onOrderNow: () => void;
  onOpenComboModal?: () => void;
  onOpenStoreLocator?: () => void;
  onCustomizeItem?: (item: MenuItem) => void;
  onOpenSeoShare?: () => void;
  onOpenChatbot?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOrderNow, 
  onOpenComboModal,
  onOpenStoreLocator,
  onCustomizeItem,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const signatureItem = MENU_ITEMS.find((m) => m.id === 'hl-combo-sang') || MENU_ITEMS[0];

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      trackConversion('apply_voucher', { voucher: code, source: 'hero_docket' });
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleOpenCombo = () => {
    trackConversion('view_combo_page', { source: 'hero_primary_button' });
    if (onOpenComboModal) {
      onOpenComboModal();
    } else if (onCustomizeItem) {
      onCustomizeItem(signatureItem);
    } else {
      onOrderNow();
    }
  };

  const handleGoToStores = () => {
    trackConversion('click_directions', { source: 'hero_store_info_button' });
    if (onOpenStoreLocator) {
      onOpenStoreLocator();
    } else {
      const el = document.getElementById('stores');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-3 pb-12 lg:py-16 bg-[#faf5ec] border-b-2 border-[#801419]/20">
      {/* Warm Nostalgic Saigon Glow */}
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-br from-[#d4af37]/15 via-[#801419]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Retro Vouchers Docket Bar */}
        <div className="mb-6 p-2.5 sm:p-3 rounded-lg bg-[#801419] text-amber-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 border-2 border-[#d4af37]/80">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-amber-200 text-center sm:text-left">
            <Tag className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Ưu đãi chiến dịch GO.COFFEE hôm nay:</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {/* GOCOFFEE20: Giảm 20% cho đơn đầu tiên từ 50.000đ */}
            <button
              onClick={() => handleCopyCode('GOCOFFEE20')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#52090c] hover:bg-[#3d0608] border border-dashed border-[#d4af37] text-xs font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95 shadow-inner"
              title="Giảm 20% cho đơn đầu tiên từ 50.000đ"
            >
              <span>GOCOFFEE20</span>
              <span className="text-[10px] bg-[#d4af37] text-[#52090c] px-1 py-0.2 rounded font-black">-20% Đơn Đầu</span>
              {copiedCode === 'GOCOFFEE20' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300/70" />}
            </button>

            {/* FREESHIP */}
            <button
              onClick={() => handleCopyCode('FREESHIP')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#52090c] hover:bg-[#3d0608] border border-dashed border-[#d4af37] text-xs font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95 shadow-inner"
              title="Miễn phí giao hàng cho đơn từ 70.000đ"
            >
              <span>FREESHIP</span>
              <span className="text-[10px] bg-[#d4af37] text-[#52090c] px-1 py-0.2 rounded font-black">Free Ship</span>
              {copiedCode === 'FREESHIP' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300/70" />}
            </button>

            {/* GOCOFFEE30 */}
            <button
              onClick={() => handleCopyCode('GOCOFFEE30')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#52090c] hover:bg-[#3d0608] border border-dashed border-[#d4af37] text-xs font-mono font-bold text-amber-200 transition cursor-pointer active:scale-95 shadow-inner"
              title="Giảm 30.000đ cho đơn từ 99.000đ"
            >
              <span>GOCOFFEE30</span>
              <span className="text-[10px] bg-[#d4af37] text-[#52090c] px-1 py-0.2 rounded font-black">-30K</span>
              {copiedCode === 'GOCOFFEE30' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-amber-300/70" />}
            </button>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Big Idea, Slogan & Clear Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Concept & Brand Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#ede2cb] border-2 border-[#801419]/40 text-[#801419] text-xs font-serif font-black uppercase tracking-wider shadow-2xs">
                <span>❖</span>
                <span>Một Chút Sài Gòn Xưa</span>
                <span>❖</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-[#801419] text-amber-200 text-xs font-serif font-bold italic border border-[#d4af37]">
                <span>Một ly đúng GU, rạng rỡ chuẩn YOU.</span>
              </div>
            </div>

            {/* Big Idea Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-[#23150d] tracking-tight leading-[1.12]">
              Chấm một miếng bánh, <br />
              <span className="text-[#801419] italic font-serif">
                nhớ một thời.
              </span>
            </h1>

            {/* Exact Recommended Subtitle */}
            <p className="text-stone-800 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-serif font-medium">
              Một ly cà phê, một phần bánh nhỏ. Hộp bánh gắn trên nắp ly để bạn cầm gọn cả hai và tháo ra khi dùng.
            </p>

            {/* Practical takeaway advantage bullets */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-serif text-stone-700 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-[#801419]">
                <Layers className="w-4 h-4 text-[#801419]" />
                Đai giấy vintage giữ chắc 1 tay
              </span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1.5 font-bold text-stone-900">
                <Clock className="w-4 h-4 text-amber-800" />
                Chuẩn bị ghé lấy sau ~5 phút
              </span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Nắp chống tràn an toàn xe máy
              </span>
            </div>

            {/* Action Buttons: Primary flow as requested */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                {/* 1. Xem bộ cà phê - bánh */}
                <button
                  type="button"
                  onClick={handleOpenCombo}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-black text-sm shadow-md border-2 border-[#d4af37] flex items-center justify-center gap-2.5 transition active:scale-95 group cursor-pointer"
                >
                  <Coffee className="w-4 h-4 text-amber-300" />
                  <span>Xem bộ cà phê–bánh (39.000đ)</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. Thông tin điểm bán */}
                <button
                  type="button"
                  onClick={handleGoToStores}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-[#fffdfa] hover:bg-[#ede2cb] border-2 border-[#801419]/30 text-stone-900 font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#801419]" />
                  <span>Thông tin điểm bán (120 Pasteur)</span>
                </button>

                {/* 3. Đặt trước mang đi */}
                <button
                  type="button"
                  onClick={onOrderNow}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-sm bg-[#ede2cb] hover:bg-[#e0d2b4] text-[#801419] font-serif font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <span>⚡ Đặt trước lấy sau 5p</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#801419]/15 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[#801419] font-serif font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
                  <span>4.9 / 5</span>
                </div>
                <p className="text-[11px] text-stone-600 font-serif">Độ hài lòng bao bì</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-stone-900 font-serif font-bold text-sm sm:text-base">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>~5 Phút</span>
                </div>
                <p className="text-[11px] text-stone-600 font-serif">Ghé lấy ngay</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-800 font-serif font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Mộc</span>
                </div>
                <p className="text-[11px] text-stone-600 font-serif">Cà phê phin Cầu Đất</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual - Ly Cà Phê Kèm Hộp Bánh Trên Nắp Ly */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with Real Product Photo */}
              <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-[#fffdfa] bg-stone-950 aspect-4/5 relative group transition-all duration-500 ring-2 ring-[#801419]/40 cursor-pointer"
                   onClick={handleOpenCombo}>
                <img
                  src="/images/gocoffee_lid_pastry_combo.jpg"
                  alt="Bộ Cà Phê & Hộp Bánh Trên Nắp Ly kèm đai giấy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/banh_mi_cham_cafe_sua_da.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />

                {/* Top Badge: Slogan & Big Idea Stamp */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  <span className="px-3 py-1 rounded-sm bg-[#801419] text-amber-200 text-xs font-serif font-black uppercase tracking-wider shadow-md border border-[#d4af37]">
                    Sản Phẩm Chủ Lực
                  </span>
                  <span className="px-2.5 py-0.5 rounded-xs bg-[#23150d]/90 text-amber-300 text-[10px] font-mono border border-amber-300/40">
                    Đai Giấy Giữ 1 Tay 2-in-1
                  </span>
                </div>

                {/* Visual Explainer Pointer Overlays */}
                <div className="absolute top-1/4 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-sm border border-amber-300/60 text-white text-[11px] font-serif shadow-lg animate-pulse">
                  <span className="text-amber-300 font-bold">▲ Hộp bánh rời</span> trên nắp ly
                </div>

                <div className="absolute top-1/2 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-sm border border-amber-300/60 text-white text-[11px] font-serif shadow-lg">
                  <span className="text-amber-300 font-bold">◄ Đai giấy</span> vintage giữ chắc
                </div>

                {/* Hero Card Bottom Overlay */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-[11px] uppercase tracking-widest text-amber-300 font-serif font-bold mb-1">
                    GO.COFFEE • THIẾT KẾ ĐỘC QUYỀN
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-serif leading-tight text-[#fffdfa]">
                    Bộ Cà Phê & Hộp Bánh Trên Nắp Ly
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed font-sans">
                    Cầm gọn một tay, tháo đai nhấc hộp bánh trong 2 giây rồi chấm ngập vào ly phin sữa đá béo đậm đà.
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-200/20">
                    <div>
                      <span className="text-2xl font-mono font-black text-amber-300">
                        39.000đ
                      </span>
                      <span className="text-xs text-stone-400 line-through ml-2 font-mono">
                        45.000đ
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCombo();
                      }}
                      className="text-xs bg-[#801419] hover:bg-[#660e12] border border-[#d4af37] text-amber-100 font-serif font-bold px-4 py-2 rounded-sm transition cursor-pointer shadow-md active:scale-95"
                    >
                      Xem Chi Tiết →
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
                  <div className="text-xs font-serif font-bold text-stone-900">Chuẩn Bị Lấy Sau ~5 Phút</div>
                  <div className="text-[11px] text-stone-500 font-mono">120 Pasteur (Dự kiến)</div>
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

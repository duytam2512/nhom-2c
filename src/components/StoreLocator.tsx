/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Check, 
  Store, 
  Sparkles, 
  Armchair, 
  Car, 
  Coffee,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Truck,
  Layers
} from 'lucide-react';
import { StoreLocation } from '../types/coffee';
import { STORES } from '../data/coffeeData';
import { trackConversion } from '../services/conversionTracker';

interface StoreLocatorProps {
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
  onOrderNow?: () => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  selectedStore,
  onSelectStore,
  onOrderNow,
}) => {
  const store = STORES[0] || selectedStore;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('120 Pasteur, Bến Nghé, Quận 1, Hồ Chí Minh')}`;
  
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number>(0);

  const STORE_PHOTOS = [
    {
      url: '/images/gocoffee_booth_120_pasteur.jpg',
      fallbackUrl: '/images/gocoffee_quan1_storefront.jpg',
      label: 'Takeaway Booth 120 Pasteur',
      tag: '120 Pasteur, Q.1 (Dự kiến)',
      title: 'Quầy Kiosk Takeaway GO.COFFEE Pasteur',
      desc: 'Thiết kế booth hiện đại pha nét Sài Gòn xưa ngay góc phố Pasteur & Lê Lợi (đối diện Saigon Centre). Tấp xe máy lấy nhanh trong 5 phút mà không cần tìm chỗ gửi xe.'
    },
    {
      url: '/images/gocoffee_lid_pastry_combo.jpg',
      fallbackUrl: '/images/gocoffee_pasteur_handover.jpg',
      label: 'Ly Cà Phê Nắp Hộp Bánh',
      tag: 'Độc Quyền 2-in-1',
      title: 'Trao Tay Bộ Ly & Bánh Cầm Gọn 1 Tay',
      desc: 'Hộp bánh giòn rụm gắn liền trên nắp ly kèm đai giấy kraft sang trọng, thuận tiện mang đi làm hoặc đi dạo phố.'
    },
    {
      url: '/images/gocoffee_cham_banh_mi.jpg',
      fallbackUrl: '/images/gocoffee_pasteur_barista.jpg',
      label: 'Pha Phin Cầu Đất',
      tag: 'Chấm một miếng bánh, nhớ một thời',
      title: 'Hương Vị Phin Cà Phê Sữa Đá Đậm Đà',
      desc: 'Chiết xuất từ hạt Robusta & Arabica Cầu Đất nguyên chất, hòa quyện cùng sữa đặc béo ngậy để chấm miếng bánh nướng nóng rụm.'
    }
  ];

  const currentPhoto = STORE_PHOTOS[activePhotoIndex] || STORE_PHOTOS[0];

  const handleDirectionsClick = () => {
    trackConversion('click_directions', { store: '120_pasteur' });
  };

  const scrollToMenu = () => {
    trackConversion('start_order', { source: 'store_locator_order_button' });
    if (onOrderNow) {
      onOrderNow();
    } else {
      const el = document.getElementById('menu');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="stores" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#ede2cb] text-[#801419] text-xs font-serif font-black uppercase tracking-widest border border-[#801419]/40 shadow-2xs">
          <span>❖</span>
          <span>Điểm Hẹn Sài Gòn Xưa • 120 Pasteur (Dự kiến)</span>
          <span>❖</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-[#23150d] tracking-tight">
          Quầy Takeaway Booth GO.COFFEE Pasteur - Quận 1
        </h2>
        
        <p className="text-xs sm:text-base text-stone-700 max-w-2xl mx-auto leading-relaxed font-serif">
          Mô hình quầy mang đi nhỏ gọn tối ưu thời gian: <strong>Chuẩn bị ghé lấy sau ~5 phút</strong> hoặc <strong>Giao hỏa tốc ~15 - 20 phút</strong>.
          <span className="block text-[11px] text-amber-800 font-mono mt-1 font-bold">
            * Địa điểm: Số 120 Pasteur, Phường Sài Gòn, Quận 1 (đối diện Takashimaya / Saigon Centre).
          </span>
        </p>
      </div>

      {/* Main Single Store Showcase Card */}
      <div className="bg-[#fffdfa] rounded-md border-2 border-[#801419]/30 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Col: Store Imagery & Atmosphere */}
        <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-[520px] bg-stone-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#801419]/20">
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-all duration-700 animate-in fade-in filter sepia-15"
            onError={(e) => {
              const target = e.currentTarget;
              if (currentPhoto.fallbackUrl && target.src.indexOf(currentPhoto.fallbackUrl) === -1) {
                target.src = currentPhoto.fallbackUrl;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-sm bg-[#801419] text-amber-200 text-xs font-serif font-black uppercase tracking-wider shadow-md border border-[#d4af37]">
              Chuyên Takeaway • Lấy Sau ~5 Phút
            </span>
            <span className="px-2.5 py-1 rounded-sm bg-[#23150d]/90 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md border border-[#d4af37]/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sẵn Sàng Nhận Đơn
            </span>
          </div>

          {/* Photo Switcher Selector */}
          <div className="relative z-10 flex flex-wrap items-center gap-1.5 self-start my-auto bg-black/70 backdrop-blur-md p-1.5 rounded-sm border border-amber-300/40 shadow-lg">
            {STORE_PHOTOS.map((ph, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`px-3 py-1.5 rounded-xs text-xs font-serif font-bold transition-all cursor-pointer ${
                  activePhotoIndex === idx
                    ? 'bg-[#801419] text-amber-200 border border-[#d4af37] font-black'
                    : 'text-stone-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {ph.label}
              </button>
            ))}
          </div>

          {/* Bottom Highlights */}
          <div className="relative z-10 space-y-2 text-white">
            <div className="inline-block px-2.5 py-0.5 rounded-xs bg-[#d4af37] text-[#52090c] text-[10px] font-mono font-black uppercase tracking-wider shadow-xs">
              {currentPhoto.tag}
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-amber-100">
              {currentPhoto.title}
            </h3>
            <p className="text-xs text-stone-200 leading-relaxed font-sans">
              {currentPhoto.desc}
            </p>
            <p className="text-xs text-amber-200 flex items-center gap-1.5 font-serif pt-1">
              <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
              120 Pasteur (Góc Pasteur & Lê Lợi, đối diện Saigon Centre)
            </p>
          </div>
        </div>

        {/* Right Col: Detailed Info & Actions */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#fffdfa]">
          
          <div className="space-y-6">
            {/* Title & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#801419]/15">
              <div>
                <span className="text-xs font-serif font-bold text-[#801419] uppercase tracking-wider block">
                  Điểm Bán Takeaway (Dự Kiến Trong Bản Demo)
                </span>
                <h4 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
                  120 Pasteur, Phường Sài Gòn, Quận 1
                </h4>
              </div>
              <span className="px-3 py-1 rounded-sm bg-[#ede2cb] text-[#801419] text-xs font-serif font-bold border border-[#801419]/30">
                Đối diện Saigon Centre
              </span>
            </div>

            {/* Clear Separation: Preparation for Pickup vs Delivery Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Pickup Time */}
              <div className="p-3.5 rounded-sm bg-[#faf5ec] border-2 border-[#801419]/30 space-y-1">
                <div className="flex items-center gap-1.5 text-[#801419] font-serif font-bold">
                  <Clock className="w-4 h-4 text-[#801419]" />
                  <span>Chuẩn Bị Ghé Nhận (Pickup)</span>
                </div>
                <p className="font-mono font-bold text-stone-900 text-base">~5 Phút Sau Khi Đặt</p>
                <p className="text-[11px] text-stone-600 font-serif">Tấp xe máy nhận ngay ly 2-in-1, không cần gửi xe.</p>
              </div>

              {/* Delivery Time */}
              <div className="p-3.5 rounded-sm bg-[#faf5ec] border border-[#d6c7b2] space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-serif font-bold">
                  <Truck className="w-4 h-4 text-amber-800" />
                  <span>Thời Gian Giao Hàng (Delivery)</span>
                </div>
                <p className="font-mono font-bold text-stone-900 text-base">~15 - 20 Phút Hỏa Tốc</p>
                <p className="text-[11px] text-stone-600 font-serif">Đóng đai giấy chống tràn an toàn đến tận tay.</p>
              </div>
            </div>

            {/* Contact & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-sm bg-[#faf5ec] border border-[#d6c7b2] space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-serif font-bold">
                  <Clock className="w-4 h-4 text-[#801419]" />
                  <span>Giờ Mở Cửa Phục Vụ</span>
                </div>
                <p className="font-mono font-bold text-stone-900 text-sm">06:30 - 23:00</p>
                <p className="text-[11px] text-stone-600 font-serif">Phục vụ điểm tâm sáng & cà phê cả ngày</p>
              </div>

              <div className="p-3.5 rounded-sm bg-[#faf5ec] border border-[#d6c7b2] space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-serif font-bold">
                  <Phone className="w-4 h-4 text-[#801419]" />
                  <span>Đường Dây Nóng Tiếp Nhận</span>
                </div>
                <a href="tel:0909123456" className="font-mono font-bold text-[#801419] text-sm hover:underline block">
                  1900 1755 / 0909 123 456
                </a>
                <p className="text-[11px] text-emerald-800 font-medium font-serif">Báo giờ ghé để pha nóng giòn</p>
              </div>
            </div>

            {/* Key Advantages */}
            <div className="space-y-2">
              <span className="text-xs font-serif font-bold text-stone-700 uppercase tracking-wider block">
                Nét Đặc Trưng Tại Booth GO.COFFEE Pasteur:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { icon: Coffee, label: 'Lấy đồ sau ~5 phút' },
                  { icon: Layers, label: 'Nắp ly kèm hộp bánh 2-in-1' },
                  { icon: Car, label: 'Tấp lề dừng xe lấy nhanh' },
                  { icon: Sparkles, label: 'Phin Cầu Đất rang mộc' },
                  { icon: ShieldCheck, label: 'Đai giấy giữ chắc 1 tay' },
                  { icon: CheckCircle2, label: 'Quét VietQR 24/7' },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-sm bg-[#faf5ec] border border-[#d6c7b2] text-[11px] font-serif font-semibold text-stone-800"
                  >
                    <item.icon className="w-3.5 h-3.5 text-[#801419] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Priority order (Menu -> Directions -> Order Ahead -> Table Booking) */}
          <div className="pt-4 border-t border-[#801419]/15 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* 1. Xem Thực Đơn & Giá */}
              <button
                type="button"
                onClick={scrollToMenu}
                className="w-full sm:flex-1 py-3 px-4 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm border-2 border-[#d4af37] transition active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <Coffee className="w-4 h-4 text-amber-300" />
                <span>Xem Thực Đơn & Đặt Trước (5 Phút)</span>
              </button>

              {/* 2. Chỉ Đường Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDirectionsClick}
                className="w-full sm:w-auto py-3 px-5 rounded-sm bg-[#fffdfa] hover:bg-[#ede2cb] border-2 border-[#801419]/30 text-stone-900 font-serif font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <Navigation className="w-4 h-4 text-[#801419]" />
                <span>Chỉ Đường Đến Booth</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              </a>
            </div>

            {/* Dịch vụ: 100% Takeaway & Delivery */}
            <div className="flex items-center justify-between pt-1 text-xs font-serif text-stone-500">
              <span className="flex items-center gap-1.5 text-stone-600">
                <Coffee className="w-3.5 h-3.5 text-[#801419]" />
                <span>Mô hình chuyên <strong>Takeaway (Mang đi) & Giao hàng hỏa tốc</strong></span>
              </span>
              <span className="text-[#801419] font-bold">120 Pasteur, Phường Sài Gòn</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

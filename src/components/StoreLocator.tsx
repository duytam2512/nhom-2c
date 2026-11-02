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
  Wifi, 
  Wind, 
  Coffee,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { StoreLocation } from '../types/coffee';
import { STORES } from '../data/coffeeData';

interface StoreLocatorProps {
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
  onOpenTableBooking?: (store?: StoreLocation) => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  selectedStore,
  onSelectStore,
  onOpenTableBooking,
}) => {
  const store = STORES[0] || selectedStore;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('7 Công Trường Lam Sơn, Bến Nghé, Quận 1, Hồ Chí Minh')}`;
  
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number>(0);

  const STORE_PHOTOS = [
    {
      url: '/images/gocoffee_quan1_storefront.jpg',
      fallbackUrl: '/images/gocoffee_quan1_storefront_1793580329452.jpg',
      label: 'Kiosk Q.1 Lam Sơn',
      tag: '7 Công Trường Lam Sơn, Q.1',
      title: 'Quầy Kiosk Go Coffee Lam Sơn - Quận 1',
      desc: 'Tọa lạc vỉa hè góc phố trung tâm Q.1 bên cạnh Nhà Hát Lớn & Khách sạn Continental, tấp xe máy nhận cà phê 5 phút.'
    },
    {
      url: '/images/gocoffee_quan1_handover.jpg',
      fallbackUrl: '/images/gocoffee_quan1_handover_1793580330615.jpg',
      label: 'Cửa Sổ Giao Nhanh',
      tag: 'Nhận Món Trong 5 Phút',
      title: 'Trao Tay Ly Cà Phê Siêu Tốc',
      desc: 'Nhân viên barista Việt Nam thân thiện trao đồ uống nắp 2 lớp chống tràn chuyên dụng cho khách đi xe máy.'
    },
    {
      url: '/images/gocoffee_quan1_barista.jpg',
      fallbackUrl: '/images/gocoffee_quan1_barista_1793580330531.jpg',
      label: 'Pha Phin Thủ Công',
      tag: '100% Cà Phê Cầu Đất',
      title: 'Pha Phin Truyền Thống Đậm Vị',
      desc: 'Từng giọt cà phê phin inox chảy chậm trên lớp sữa đặc béo ngậy, giữ trọn vị mộc đặc trưng của Go Coffee.'
    }
  ];

  const currentPhoto = STORE_PHOTOS[activePhotoIndex] || STORE_PHOTOS[0];

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="stores" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-[#8c141c] text-xs font-black uppercase tracking-wider shadow-2xs">
          <Store className="w-3.5 h-3.5 text-[#b22830]" />
          <span>Quầy Cà Phê Takeaway • 7 Công Trường Lam Sơn, Quận 1</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-black font-display text-stone-900 tracking-tight">
          Quầy Cà Phê Takeaway Go Coffee - Quận 1
        </h2>
        
        <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Mô hình cà phê mang đi (Takeaway) tinh gọn, hiện đại ngay trung tâm Quận 1. Đặt món trước qua website, ghé lấy đồ uống nóng/lạnh chỉ sau 5 phút không cần xếp hàng, ly nắp 2 lớp chống đổ xe máy an toàn!
        </p>
      </div>

      {/* Main Single Store Showcase Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Col: Store Imagery & Atmosphere (5 Cols) */}
        <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-[520px] bg-stone-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
          {/* Background image - Authentic Generated Go Coffee Takeaway Kiosk */}
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-all duration-700 animate-in fade-in"
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
            <span className="px-3 py-1.5 rounded-full bg-[#b22830] text-amber-200 text-xs font-black uppercase tracking-wider shadow-md">
              🛵 Chuyên Takeaway • Lấy Sau 5 Phút
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Đang mở cửa
            </span>
          </div>

          {/* Photo Switcher Selector */}
          <div className="relative z-10 flex flex-wrap items-center gap-1.5 self-start my-auto bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
            {STORE_PHOTOS.map((ph, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePhotoIndex === idx
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black scale-105'
                    : 'text-stone-200 hover:text-white hover:bg-white/15'
                }`}
              >
                {ph.label}
              </button>
            ))}
          </div>

          {/* Bottom Highlights */}
          <div className="relative z-10 space-y-2 text-white">
            <div className="inline-block px-2.5 py-1 rounded-md bg-amber-400/95 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
              {currentPhoto.tag}
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-amber-100">
              {currentPhoto.title}
            </h3>
            <p className="text-xs text-stone-200 leading-relaxed font-normal">
              {currentPhoto.desc}
            </p>
            <p className="text-xs text-amber-300/90 flex items-center gap-1.5 font-medium pt-1">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              7 Công Trường Lam Sơn (sát Nhà Hát Lớn TP.HCM)
            </p>
          </div>
        </div>

        {/* Right Col: Detailed Info & Actions (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            {/* Title & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Địa Chỉ Quán (Chuyên Mang Đi)
                </span>
                <h4 className="text-lg sm:text-xl font-black text-stone-900 font-display">
                  7 Công Trường Lam Sơn, Phường Bến Nghé, Quận 1
                </h4>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
                TP. Hồ Chí Minh
              </span>
            </div>

            {/* Quick Contact & Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
                  <Clock className="w-4 h-4 text-[#b22830]" />
                  <span>Giờ Phục Vụ Takeaway</span>
                </div>
                <p className="font-bold text-stone-900 text-sm">06:30 - 23:00</p>
                <p className="text-[11px] text-stone-500">Phục vụ mang đi liên tục mỗi ngày</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
                  <Phone className="w-4 h-4 text-[#b22830]" />
                  <span>Hotline Đặt Món Trước</span>
                </div>
                <a href="tel:19001755" className="font-bold text-stone-900 text-sm hover:underline block">
                  1900 1755 / 0909 123 456
                </a>
                <p className="text-[11px] text-emerald-700 font-medium">Báo giờ ghé lấy nhanh</p>
              </div>
            </div>

            {/* Amenities Included */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Tiện Ích Dịch Vụ Mang Đi (Takeaway):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { icon: Coffee, label: 'Lấy đồ sau 5 phút' },
                  { icon: ShieldCheck, label: 'Ly 2 lớp chống đổ xe máy' },
                  { icon: Car, label: 'Tấp lề dừng xe lấy nhanh' },
                  { icon: Sparkles, label: 'Cà phê xay pha tươi 100%' },
                  { icon: Navigation, label: 'Giao nhanh nội thành Q.1' },
                  { icon: ShieldCheck, label: 'VietQR & MoMo không chạm' },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] font-semibold text-stone-800"
                  >
                    <item.icon className="w-3.5 h-3.5 text-[#b22830] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
            {/* Direct Order Button */}
            <button
              type="button"
              onClick={scrollToMenu}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] hover:from-[#c41e27] hover:to-[#9b1c24] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 ring-2 ring-amber-400/50 transition active:scale-95 cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-amber-300" />
              <span>Đặt Món Mang Đi (Lấy Sau 5 Phút)</span>
            </button>

            {/* Google Maps Directions */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#b22830]" />
              <span>Chỉ Đường Đến Quán</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

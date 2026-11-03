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
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('120 Pasteur, Bến Nghé, Quận 1, Hồ Chí Minh')}`;
  
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number>(0);

  const STORE_PHOTOS = [
    {
      url: '/images/gocoffee_quan1_storefront.jpg',
      fallbackUrl: '/images/gocoffee_pasteur_storefront.jpg',
      label: 'Kiosk Q.1 Pasteur',
      tag: '120 Pasteur, Q.1',
      title: 'Quầy Kiosk Go Coffee Pasteur - Quận 1',
      desc: 'Tọa lạc vỉa hè góc phố Pasteur & Lê Lợi trung tâm Q.1 đối diện Saigon Centre, tấp xe máy nhận cà phê 5 phút.'
    },
    {
      url: '/images/gocoffee_quan1_handover.jpg',
      fallbackUrl: '/images/gocoffee_pasteur_handover.jpg',
      label: 'Cửa Sổ Giao Nhanh',
      tag: 'Nhận Món Trong 5 Phút',
      title: 'Trao Tay Ly Cà Phê Siêu Tốc',
      desc: 'Nhân viên barista Việt Nam thân thiện trao đồ uống nắp 2 lớp chống tràn chuyên dụng cho khách đi xe máy.'
    },
    {
      url: '/images/gocoffee_quan1_barista.jpg',
      fallbackUrl: '/images/gocoffee_pasteur_barista.jpg',
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
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#ede2cb] text-[#801419] text-xs font-serif font-bold uppercase tracking-widest border border-[#801419]/40 shadow-2xs">
          <span>❖</span>
          <span>Điểm Hẹn Sài Gòn Xưa • 120 Pasteur</span>
          <span>❖</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-[#23150d] tracking-tight">
          Quầy Cà Phê Góc Phố Pasteur - Quận 1
        </h2>
        
        <p className="text-xs sm:text-base text-stone-700 max-w-2xl mx-auto leading-relaxed font-serif italic">
          Ghé tấp xe máy bên góc đường Pasteur & Lê Lợi, thưởng thức ly phin đậm đà thơm ngát và ổ bánh mì nóng giòn. Đặt trước qua website, ghé lấy sau 5 phút không đợi chờ.
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
              Chuyên Takeaway • 5 Phút Có Ngay
            </span>
            <span className="px-2.5 py-1 rounded-sm bg-[#23150d]/90 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md border border-[#d4af37]/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Đang Mở Cửa
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
                  Địa Chỉ Quán Xưa (Chuyên Mang Đi)
                </span>
                <h4 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
                  120 Pasteur, Phường Bến Nghé, Quận 1
                </h4>
              </div>
              <span className="px-3 py-1 rounded-sm bg-[#ede2cb] text-[#801419] text-xs font-serif font-bold border border-[#801419]/30">
                Sài Gòn • TP. Hồ Chí Minh
              </span>
            </div>

            {/* Quick Contact & Info Grid */}
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
                  <span>Đường Dây Nóng Đặt Trước</span>
                </div>
                <a href="tel:0909123456" className="font-mono font-bold text-[#801419] text-sm hover:underline block">
                  0909 123 456 / 1900 1755
                </a>
                <p className="text-[11px] text-emerald-800 font-medium font-serif">Báo giờ nhận để pha nóng giòn</p>
              </div>
            </div>

            {/* Amenities Included */}
            <div className="space-y-2">
              <span className="text-xs font-serif font-bold text-stone-700 uppercase tracking-wider block">
                Nét Đặc Trưng Dịch Vụ Quán:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { icon: Coffee, label: 'Lấy đồ sau 5 phút' },
                  { icon: ShieldCheck, label: 'Ly 2 lớp chống đổ xe máy' },
                  { icon: Car, label: 'Tấp lề dừng xe lấy nhanh' },
                  { icon: Sparkles, label: 'Phin mộc rang củi 100%' },
                  { icon: Navigation, label: 'Bánh mì nướng nóng giòn' },
                  { icon: ShieldCheck, label: 'VietQR & MoMo tiện lợi' },
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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#801419]/15 flex flex-col sm:flex-row items-center gap-3">
            {/* Direct Order Button */}
            <button
              type="button"
              onClick={scrollToMenu}
              className="w-full sm:flex-1 py-3 px-5 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm border-2 border-[#d4af37] transition active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Coffee className="w-4 h-4 text-amber-300" />
              <span>Đặt Món Quán Xưa (Lấy Sau 5 Phút)</span>
            </button>

            {/* Google Maps Directions */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-sm bg-[#faf5ec] hover:bg-[#ede2cb] border border-[#d6c7b2] text-stone-900 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#801419]" />
              <span>Chỉ Đường Đến Quán</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

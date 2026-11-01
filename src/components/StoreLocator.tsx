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
          <span>Điểm Hẹn Cà Phê • Trụ Sở Duy Nhất Tại Quận 1</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-black font-display text-stone-900 tracking-tight">
          Không Gian Go Coffee Tại Quận 1
        </h2>
        
        <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Tọa lạc tại vị trí đắc địa ngay trung tâm Quận 1, TP. Hồ Chí Minh. Không gian ấm cúng, đậm đà bản sắc cà phê Việt, máy lạnh mát mẻ, wifi tốc độ cao — sẵn sàng đón bạn thưởng thức tại chỗ hoặc ghé lấy đồ uống sau 5 phút.
        </p>
      </div>

      {/* Main Single Store Showcase Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Col: Store Imagery & Atmosphere (5 Cols) */}
        <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[460px] bg-stone-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85"
            alt="Không gian Go Coffee Quận 1"
            className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#b22830] text-amber-200 text-xs font-black uppercase tracking-wider shadow-md">
              📍 Flagship Store • Quận 1
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Đang mở cửa
            </span>
          </div>

          {/* Bottom Highlights */}
          <div className="relative z-10 space-y-2 text-white">
            <h3 className="text-2xl font-black font-display tracking-tight text-amber-100">
              Go Coffee - Lam Sơn Quận 1
            </h3>
            <p className="text-xs text-stone-200 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              Cạnh Nhà Hát Lớn TP.HCM, đối diện Phố Đi Bộ Nguyễn Huệ
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
                  Địa Chỉ Quán Duy Nhất
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
                  <span>Giờ Mở Cửa</span>
                </div>
                <p className="font-bold text-stone-900 text-sm">06:30 - 23:00</p>
                <p className="text-[11px] text-stone-500">Phục vụ tất cả các ngày trong tuần</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
                  <Phone className="w-4 h-4 text-[#b22830]" />
                  <span>Hotline Hỗ Trợ & Đặt Bàn</span>
                </div>
                <a href="tel:19001755" className="font-bold text-stone-900 text-sm hover:underline block">
                  1900 1755 / 0909 123 456
                </a>
                <p className="text-[11px] text-emerald-700 font-medium">Hỗ trợ nhanh, chu đáo</p>
              </div>
            </div>

            {/* Amenities Included */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Tiện Ích & Dịch Vụ Tại Quán:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { icon: Wind, label: 'Máy lạnh công suất lớn' },
                  { icon: Wifi, label: 'Wifi tốc độ cao miễn phí' },
                  { icon: Car, label: 'Chỗ đỗ ô tô & xe máy' },
                  { icon: Sparkles, label: 'Ổ cắm điện từng bàn' },
                  { icon: Armchair, label: 'Không gian trong nhà & sân vườn' },
                  { icon: ShieldCheck, label: 'Thanh toán VietQR & MoMo' },
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
            {/* Google Maps Directions */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#b22830] hover:bg-[#8c141c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-950/20 transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Chỉ Đường Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
            </a>

            {/* Table Booking */}
            {onOpenTableBooking && (
              <button
                type="button"
                onClick={() => onOpenTableBooking(store)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 text-[#701217] font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Armchair className="w-4 h-4 text-[#b22830]" />
                <span>Đặt Bàn Giữ Chỗ Miễn Phí</span>
              </button>
            )}

            {/* Order Takeaway */}
            <button
              type="button"
              onClick={scrollToMenu}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-stone-600" />
              <span>Đặt Món Lấy Sau 5 Phút</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

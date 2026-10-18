import React from 'react';
import { 
  Coffee, 
  Zap, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  QrCode 
} from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onOpenSeoShare: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onOpenSeoShare }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-[#faf7f2] via-[#f7f2ea] to-[#faf7f2]">
      {/* Decorative background coffee bean orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-amber-200/20 via-orange-100/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-950 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Chỉ 5 phút lấy đồ • Quét mã VietQR chuẩn NAPAS 24/7</span>
            </div>

            {/* Main Headline with Modern Coffee Chain Typography */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-stone-900 tracking-tight leading-[1.15]">
              Cà Phê Đặc Sản <br />
              <span className="text-amber-800 italic underline decoration-amber-400 decoration-wavy decoration-2">
                GO & GRAB
              </span>{' '}
              Mang Đi Tiện Lợi
            </h1>

            {/* Value Proposition Description */}
            <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Thưởng thức từng ngụm Cà phê Muối Cố Đô, Cold Brew ủ lạnh 24h và Bạc xỉu ba tầng từ nông trại Cầu Đất 1600m. Đặt online trước, tới quầy lấy liền không xếp hàng hoặc giao nóng hổi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="/thuc-don"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '/thuc-don');
                  }
                  onOrderNow();
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 hover:from-amber-700 hover:to-stone-800 text-white font-bold text-sm sm:text-base shadow-xl shadow-amber-950/20 flex items-center justify-center gap-2.5 transition active:scale-95 group cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Đặt Món Mang Đi Ngay</span>
                <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={onOpenSeoShare}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-amber-800" />
                <span>Chia Sẻ Link & SEO Tags</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-amber-600 font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">1,280+ đánh giá 5★</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-stone-900 font-bold text-sm sm:text-base">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>5 Phút</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Cam kết sẵn sàng</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100%</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Hạt Cầu Đất rang mộc</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Composition with floating badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Coffee Hero Card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 aspect-4/5 relative group">
                <img
                  src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85"
                  alt="Cà phê muối đặc sản Go & Grab"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hero Card Bottom Overlay */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 text-[11px] font-bold uppercase tracking-wider mb-2">
                    Signature Drink
                  </div>
                  <h3 className="text-xl font-bold font-serif">Cà Phê Muối Xứ Huế</h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                    Lớp kem béo mằn mặn kết hợp cốt cà phê Robusta rang mộc đậm đà.
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                    <span className="text-lg font-black text-amber-300">39.000đ</span>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.history.pushState(null, '', '/thuc-don');
                        }
                        onOrderNow();
                      }}
                      className="text-xs bg-white text-stone-900 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition cursor-pointer"
                    >
                      Chọn món ngay
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: 5-minute Grab-and-go */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3 animate-bounce [animation-duration:3s]">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Go & Grab Locker</div>
                  <div className="text-[11px] text-stone-500">Lấy cà phê trong 5 phút</div>
                </div>
              </div>

              {/* Floating Badge 2: VietQR Fast Pay */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">VietQR NAPAS 24/7</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Tự động nhận đơn sau 1s</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

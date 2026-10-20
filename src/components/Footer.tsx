import React from 'react';
import { Share2, Phone, Mail, MapPin, Sparkles, Heart, ShieldCheck, QrCode } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenSeoShare: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSeoShare }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <a href="/" title="Go Coffee" className="inline-block">
                <Logo size="md" className="[&_span]:text-white" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Chuỗi cà phê mang đi cao cấp từ hạt Cầu Đất nguyên chất. Đặt món trước qua website, tới quầy nhận đồ sau 5 phút không xếp hàng, thanh toán tự động qua VietQR & Ví MoMo.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenSeoShare}
                className="px-3.5 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-semibold flex items-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Xem chuẩn SEO & Chia sẻ link</span>
              </button>
            </div>
          </div>

          {/* Quick Menu Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Menu Đặc Sắc</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#menu" className="hover:text-amber-400 transition">Cà Phê Muối Xứ Huế</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Bạc Xỉu 3 Tầng Sài Gòn</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Cold Brew Cam Sả 24H</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Oatly Vanilla Latte</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Trà Sen Vàng Kem Macchiato</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Croissant Bơ Pháp Nóng Giòn</a></li>
            </ul>
          </div>

          {/* Stores Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Chi Nhánh Pickup</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>128 Nguyễn Đình Chiểu, Q.3, TP.HCM</li>
              <li>42 Xuân Thủy, Thảo Điền, TP. Thủ Đức</li>
              <li>Tòa Bitexco, Q.1, TP.HCM</li>
              <li>99 Duy Tân, Cầu Giấy, Hà Nội</li>
              <li className="pt-1 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Mở cửa: 06:30 - 22:30 hàng ngày
              </li>
            </ul>
          </div>

          {/* Contact & Legal Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hỗ Trợ & Liên Hệ</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <a href="tel:0909123456" className="hover:underline">0909 123 456</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>contact@gocoffee.vn</span>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-stone-500 block uppercase">Phương thức thanh toán</span>
                <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] font-mono text-stone-300">
                  <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">VietQR</span>
                  <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">MoMo</span>
                  <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">Apple Pay</span>
                  <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">Tiền mặt</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with SEO metadata badge */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2026 <strong>Go Coffee</strong>. Tự hào cà phê Việt - Đậm đà bản sắc.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Chuẩn Google SEO & OpenGraph Protocol
            </span>
            <span>•</span>
            <button
              onClick={onOpenSeoShare}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Kiểm tra Card Preview
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

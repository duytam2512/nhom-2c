import React from 'react';
import { Phone, Mail, MapPin, Sparkles, Heart, ShieldCheck, QrCode } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenSeoShare: () => void;
  onResetHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSeoShare, onResetHome }) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onResetHome) {
      onResetHome();
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <a 
                href="/" 
                onClick={handleLogoClick}
                title="Go Coffee - Về trang bắt đầu" 
                className="inline-block cursor-pointer transition hover:opacity-90 active:scale-95"
              >
                <Logo size="md" className="[&_span]:text-white" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Chuỗi cà phê mang đi cao cấp từ hạt Cầu Đất nguyên chất. Đặt món trước qua website, tới quầy nhận đồ sau 5 phút không xếp hàng, thanh toán tự động qua VietQR & Ví MoMo.
            </p>
            
          </div>

          {/* Quick Menu Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Menu Đặc Sắc</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#menu" className="hover:text-amber-400 transition">Phin Sữa Đá Go Coffee</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Cà Phê Muối Cố Đô</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">PhinDi Hạnh Nhân Bùi Béo</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Freeze Trà Xanh Thạch Giòn</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Trà Sen Vàng Hạt Sen Huế</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition">Bánh Mì Que Pate Cay Hải Phòng</a></li>
            </ul>
          </div>

          {/* Stores Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Chi Nhánh Quán</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>7 Công Trường Lam Sơn, Q.1, TP.HCM</li>
              <li>135 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM</li>
              <li>34 Lê Duẩn, Diamond Plaza, TP.HCM</li>
              <li>1-3-5 Đinh Tiên Hoàng, Hàm Cá Mập, Hà Nội</li>
              <li className="pt-1 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Mở cửa: 06:30 - 23:00 hàng ngày
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
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Thanh toán tự động VietQR & MoMo
            </span>
            <span>•</span>
            <button
              onClick={onOpenSeoShare}
              className="text-stone-600 hover:text-stone-400 transition cursor-pointer text-[10px]"
              title="Dành cho quản lý: Kiểm tra SEO & Google Console"
            >
              Cấu hình SEO / Console
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

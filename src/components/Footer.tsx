import React from 'react';
import { Phone, Mail, MapPin, Sparkles, Heart, ShieldCheck, QrCode } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenSeoShare?: () => void;
  onResetHome?: () => void;
  onOpenAdmin?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSeoShare, onResetHome, onOpenAdmin, onOpenGoogleDrive }) => {
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
    <footer className="bg-[#140c07] text-stone-300 pt-16 pb-12 border-t-2 border-[#801419]/40">
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
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed font-sans">
              Gìn giữ phong vị cà phê phin mộc Sài Gòn xưa tại góc đường 120 Pasteur, Quận 1 (đối diện Saigon Centre). Thưởng thức bánh mì giòn rụm chấm cà phê phin sánh đậm, đặt món trước nhận ngay sau 5 phút, quét mã VietQR tự động tiện lợi.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-amber-200/90 font-serif">
              <span>❖ Hương vị mộc mạc lưu truyền từ 1986 ❖</span>
            </div>
          </div>

          {/* Quick Menu Col */}
          <div className="space-y-3 font-serif">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200">Món Xưa & Sản Phẩm Chủ Lực</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              <li><a href="#menu" className="hover:text-amber-300 transition font-bold text-amber-200">Bộ Cà Phê & Hộp Bánh Nắp Ly (39k)</a></li>
              <li><a href="#menu" className="hover:text-amber-300 transition">Bánh Mì Chấm Cà Phê Sữa Đá</a></li>
              <li><a href="#menu" className="hover:text-amber-300 transition">Combo Phin Đen Đá & Bánh Mì</a></li>
              <li><a href="#menu" className="hover:text-amber-300 transition">Phin Sữa Đá Cầu Đất Đậm Vị</a></li>
              <li><a href="#menu" className="hover:text-amber-300 transition">Trà Sen Vàng Hạt Sen Huế</a></li>
              <li><a href="#menu" className="hover:text-amber-300 transition">Bánh Mì Không Nóng Giòn</a></li>
            </ul>
          </div>

          {/* Store Address Col */}
          <div className="space-y-3 font-serif">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200">Góc Quán Sài Gòn</h4>
            <div className="space-y-2 text-xs text-stone-400 font-sans">
              <p className="font-bold text-amber-100 font-serif">GO.COFFEE - Takeaway Booth (Dự kiến)</p>
              <p>120 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
              <p className="text-[11px] text-stone-500 font-serif italic">(Góc Pasteur & Lê Lợi, đối diện Takashimaya / Saigon Centre)</p>
              <div className="pt-1 text-emerald-400 font-semibold flex items-center gap-1.5 font-serif">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Lấy sau ~5 phút • Giao hỏa tốc 15-20p</span>
              </div>
            </div>
          </div>

          {/* Contact & Legal Col */}
          <div className="space-y-3 font-serif">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200">Liên Hệ & Đặt Trước</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-sans">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href="tel:0909123456" className="hover:underline font-mono text-amber-100">0909 123 456</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>contact@gocoffee.vn</span>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-amber-200/80 block uppercase font-serif tracking-wider">Thanh toán không tiền mặt</span>
                <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] font-mono text-amber-100">
                  <span className="px-2 py-0.5 rounded-xs bg-[#23150d] border border-amber-900/60">VietQR</span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#23150d] border border-amber-900/60">MoMo</span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#23150d] border border-amber-900/60">Tiền mặt</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with clean customer copyright and discreet owner portal link */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-serif">
          <p>
            © 2026 <strong>GO.COFFEE</strong> — <em>“Một ly đúng GU, rạng rỡ chuẩn YOU.”</em>
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Thanh toán tự động VietQR NAPAS 24/7
            </span>
            {onOpenGoogleDrive && (
              <>
                <span className="text-stone-700">•</span>
                <button
                  onClick={onOpenGoogleDrive}
                  className="text-stone-500 hover:text-amber-400 transition cursor-pointer text-[11px] flex items-center gap-1 font-sans"
                  title="Mở Google Drive Workspace (Xem tệp & Xuất báo cáo)"
                >
                  <span>📂 Google Drive</span>
                </button>
              </>
            )}
            {onOpenAdmin && (
              <>
                <span className="text-stone-700">•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-stone-600 hover:text-amber-400 transition cursor-pointer text-[11px] flex items-center gap-1 font-sans"
                  title="Dành riêng cho chủ quán Go Coffee (Quản lý Sheet, Bot & Đơn hàng)"
                >
                  <span>🔒 Chủ Quán</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};


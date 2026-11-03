import React from 'react';
import { Award, Flame, CheckCircle2, Coffee } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-[#170e08] text-stone-100 overflow-hidden relative scroll-mt-20 border-y-2 border-[#801419]/40">
      {/* Ambient nostalgic warm glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#801419]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vintage photo collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden aspect-4/5 shadow-2xl border-2 border-[#d4af37]/60 p-1 bg-[#23150d]">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=80"
                  alt="Hạt cà phê Tây Nguyên rang mộc"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 filter sepia-25"
                />
              </div>
              <div className="p-4 rounded-md bg-[#23150d] border border-[#d4af37]/40 space-y-1">
                <span className="text-[#d4af37] font-black text-2xl block font-mono">1986</span>
                <span className="text-xs text-amber-200/80 font-serif">Ký ức cà phê phin phố cổ Sài Gòn</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-md bg-[#5c0f14] border border-[#d4af37]/60 space-y-1">
                <span className="text-amber-200 font-black text-2xl block font-serif">120 Pasteur</span>
                <span className="text-xs text-amber-100/90 font-serif">Quán góc phố Bến Nghé, Quận 1</span>
              </div>
              <div className="rounded-md overflow-hidden aspect-4/5 shadow-2xl border-2 border-[#d4af37]/60 p-1 bg-[#23150d]">
                <img
                  src="/images/gocoffee_quan1_barista.jpg"
                  alt="Barista Việt Nam pha phin truyền thống tại Go Coffee Quận 1"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 filter sepia-20"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.indexOf('1793580330531') === -1) {
                      target.src = '/images/gocoffee_quan1_barista_1793580330531.jpg';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Nostalgic Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#5c0f14] border border-[#d4af37] text-amber-200 text-xs font-serif font-black uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Gìn Giữ Hồn Phố Thị Sài Gòn Xưa</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight leading-snug text-[#fffdfa]">
              Giọt Phin Nhỏ Tí Tách <br />
              <span className="text-[#d4af37] italic font-serif">Vẹn Nguyên Ký Ức Thuở Nào</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans font-normal">
              Trong nhịp sống hối hả của đô thị hiện đại, Go Coffee tại 120 Pasteur giữ lại cho người Sài Gòn một góc mộc mạc thân thương: chiếc phin nhôm tráng nước sôi, mùi cà phê rang củi ngào ngạt lan tỏa, ổ bánh mì nóng giòn rụm vừa ra lò xé chấm vào ly sữa đá béo ngậy. Một nét văn hóa bình dân nhưng chứa chan tình người phương Nam.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-md bg-[#23150d] border border-[#801419]/50 space-y-2">
                <div className="w-8 h-8 rounded bg-[#801419] text-amber-200 flex items-center justify-center font-bold border border-[#d4af37]">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-amber-100">Bí Quyết Rang Mộc Gia Truyền</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  Hạt Robusta và Arabica Cầu Đất nguyên chất 100%, không tẩm ướp bắp hay đậu nành, giữ trọn hậu vị thơm sâu, đắng êm dịu.
                </p>
              </div>

              <div className="p-4 rounded-md bg-[#23150d] border border-[#801419]/50 space-y-2">
                <div className="w-8 h-8 rounded bg-[#801419] text-amber-200 flex items-center justify-center font-bold border border-[#d4af37]">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-amber-100">Điểm Tâm Sáng Đậm Đà</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  Thưởng thức bánh mì nóng giòn chấm phin sữa đá hoặc phin đen đậm vị, đóng gói tiện mang đi, nhận nước sau 5 phút.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800/80 space-y-2 text-xs text-stone-300 font-serif">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% hạt cà phê mộc từ cao nguyên Cầu Đất và Buôn Ma Thuột</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Đặt món trước qua website, ghé lấy sau 5 phút không cần chờ đợi</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


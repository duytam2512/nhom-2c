import React from 'react';
import { Sparkles, Leaf, Award, Flame, CheckCircle2, Coffee } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-[#1e110c] text-stone-100 overflow-hidden relative scroll-mt-20 border-y border-amber-950/40">
      {/* Highlands ambient red & gold glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#b22830]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-4/5 shadow-2xl ring-1 ring-amber-400/30">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=80"
                  alt="Hạt cà phê Tây Nguyên rang mộc"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-900/40 space-y-1">
                <span className="text-amber-400 font-black text-2xl block font-display">1999</span>
                <span className="text-xs text-stone-300 font-medium">Hành trình tự hào cà phê Việt</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-2xl bg-[#5c1015]/80 border border-red-700/50 space-y-1">
                <span className="text-amber-300 font-black text-2xl block font-display">500+</span>
                <span className="text-xs text-stone-200 font-medium">Quán cà phê trên khắp mọi miền</span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-4/5 shadow-2xl ring-1 ring-amber-400/30">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80"
                  alt="Không gian Go Coffee"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Go Coffee Heritage Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8c141c]/80 border border-amber-400/60 text-amber-200 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Go Coffee • Đậm Đà Bản Sắc Cà Phê Việt</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-snug">
              Tự Hào Cà Phê Phin <br />
              <span className="text-[#e23640] italic font-serif">Kết Nối Triệu Người Việt</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Bắt đầu từ tình yêu hạt cà phê Tây Nguyên và cao nguyên Cầu Đất trù phú, Go Coffee gìn giữ nét văn hóa cà phê phin truyền thống, kết hợp cùng phong cách thưởng thức hiện đại để mang đến từng ly Phin Sữa Đá, Freeze mát lạnh và Trà Sen Vàng đậm đà khó quên.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#8c141c] text-amber-200 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Công Thức Phin Độc Quyền</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Tỷ lệ kết hợp Robusta đậm đà và Arabica thơm thanh tao, chưng cất từng giọt phin chậm rãi để đạt độ sánh mượt hoàn hảo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-900/80 text-amber-200 flex items-center justify-center font-bold">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Cộng Đồng Gắn Kết</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Nơi gặp gỡ của bạn bè, đồng nghiệp và gia đình trong không gian ấm áp, thân thuộc với hương thơm cà phê nồng nàn.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800/80 space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% hạt cà phê Robusta và Arabica thu hoạch từ cao nguyên Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dịch vụ đặt món mang đi nhận sau 5 phút & đặt bàn không gian thoáng mát</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

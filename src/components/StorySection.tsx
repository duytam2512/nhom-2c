import React from 'react';
import { Sparkles, Leaf, Award, Recycle, CheckCircle2 } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-stone-900 text-stone-100 overflow-hidden relative scroll-mt-20">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-4/5 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=80"
                  alt="Hạt cà phê Cầu Đất rang mộc"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
                <span className="text-amber-400 font-bold text-xl block">1.600m</span>
                <span className="text-xs text-stone-300 font-medium">Độ cao nông trại Cầu Đất (Đà Lạt)</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/40 space-y-1">
                <span className="text-emerald-400 font-bold text-xl block">100%</span>
                <span className="text-xs text-stone-300 font-medium">Ly giấy bã mía phân hủy sinh học</span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-4/5 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80"
                  alt="Barista Go & Grab pha chế"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Triết Lý Thủ Công & Tốc Độ</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight leading-snug">
              Từ Hạt Cà Phê Cầu Đất <br />
              <span className="text-amber-400 italic">Đến Chiếc Ly Cầm Tay Của Bạn</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              <strong>Go & Grab Coffee</strong> được sáng lập với một niềm tin đơn giản: Những người bận rộn xứng đáng được thưởng thức cà phê ngon đúng điệu mỗi sáng mà không phải chờ đợi mệt mỏi trong hàng dài.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Rang Mộc Mẻ Nhỏ 5kg</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Không tẩm ướp hương liệu hay chất tạo bọt. Từng mẻ cà phê được rang vừa (Medium Roast) để lưu giữ trọn vẹn vị chua thanh và hương caramel.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold">
                  <Leaf className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Bao Bì Xanh Thân Thiện</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Sử dụng 100% ly làm từ bã mía và ống hút bột gạo tự nhiên, có khả năng tự phân hủy hoàn toàn trong 180 ngày.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Chiết xuất bằng máy pha Espresso áp suất 9 bar chuẩn quốc tế</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sữa hạt Oatly nhập khẩu nguyên hộp & sữa tươi organic tiệt trùng</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

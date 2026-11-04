/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Coffee, 
  Sparkles, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  MessageSquareHeart, 
  ShieldCheck, 
  Clock, 
  QrCode,
  Layers,
  HandMetal
} from 'lucide-react';
import { trackConversion } from '../services/conversionTracker';

interface PackagingGuideProps {
  onOpenComboModal: () => void;
  onOpenFeedbackModal: () => void;
}

export const PackagingGuide: React.FC<PackagingGuideProps> = ({
  onOpenComboModal,
  onOpenFeedbackModal,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Cầm Gọn 1 Tay Tiện Lợi',
      subtitle: 'Hộp bánh gắn chắc trên nắp ly',
      desc: 'Hộp bánh giòn nhỏ được cố định khít trên nắp ly bằng đai giấy kraft GO.COFFEE. Khách tấp xe máy hay đi bộ đều dễ dàng cầm trọn cả cà phê và bánh trong một lòng bàn tay.',
      tag: 'Mang Đi Siêu Tiện',
      icon: HandMetal,
    },
    {
      step: '02',
      title: 'Tháo Đai Giấy & Mở Hộp',
      subtitle: 'Tách rời hộp bánh chỉ trong 2 giây',
      desc: 'Nhẹ nhàng trượt hoặc xé đai giấy cố định, nhấc hộp bánh ra khỏi nắp ly. Nắp ly có khớp seal chống tràn thông minh, bảo vệ giọt cà phê phin luôn nguyên vẹn.',
      tag: 'Khớp Nắp Độc Quyền',
      icon: Layers,
    },
    {
      step: '03',
      title: 'Chấm Bánh & Thưởng Thức',
      subtitle: 'Phong vị Sài Gòn xưa mộc mạc',
      desc: 'Mở nắp hộp bánh thơm lừng, chấm ngập miếng bánh nướng giòn rụm vào ly phin sữa đá Cầu Đất sánh béo. Thưởng thức trọn vẹn hương vị xưa mọi lúc mọi nơi.',
      tag: 'Đậm Vị Ký Ức',
      icon: Coffee,
    },
  ];

  return (
    <section id="packaging-guide" className="py-14 lg:py-18 bg-[#fdf9f2] border-b-2 border-[#801419]/20 relative overflow-hidden">
      {/* Background Decorative Stamp */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#ede2cb] text-[#801419] text-xs font-serif font-black uppercase tracking-widest border border-[#801419]/40 shadow-2xs">
            <span>❖</span>
            <span>Thiết Kế Độc Quyền GO.COFFEE</span>
            <span>❖</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-[#23150d] tracking-tight">
            Cách Tháo Hộp & Thưởng Thức Trong 3 Bước
          </h2>

          <p className="text-stone-700 text-sm sm:text-base font-serif leading-relaxed">
            Hộp bánh gắn trên nắp ly giúp bạn cầm gọn cả hai và tháo ra dễ dàng khi dùng — giải pháp hoàn hảo cho lối sống năng động tại Sài Gòn.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#fffdfa] rounded-md border-2 border-[#801419]/30 p-6 sm:p-7 relative flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Top Step Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-[#801419] tracking-tighter">
                    {item.step}
                  </span>
                  <span className="px-2.5 py-1 rounded-xs bg-[#ede2cb] text-[#801419] text-[11px] font-serif font-bold uppercase border border-[#801419]/30">
                    {item.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-6">
                  <div className="w-12 h-12 rounded-sm bg-[#801419] text-amber-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-amber-300" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black font-serif text-[#23150d] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-serif font-bold text-amber-800">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-serif">
                  <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Thao tác nhanh & sạch
                  </span>
                  <span className="font-mono text-stone-400">Bước {idx + 1}/3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Real Demonstration Banner (Chấm Bánh Mì Minh Họa) */}
        <div className="bg-[#23150d] text-amber-100 rounded-md p-6 sm:p-8 border-2 border-[#d4af37] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <div className="rounded-sm overflow-hidden border-2 border-amber-200/50 aspect-4/3 relative shadow-lg">
              <img 
                src="/images/gocoffee_cham_banh_mi.jpg"
                alt="Chấm bánh mì vào cà phê phin sữa đá" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/gocoffee_lid_pastry_combo.jpg';
                }}
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#801419] text-amber-200 text-[10px] font-serif font-black uppercase rounded-xs border border-amber-300 shadow-md">
                Khoảnh Khắc Chấm Bánh
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-xs bg-[#801419] text-amber-200 text-xs font-serif font-bold uppercase border border-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chấm một miếng bánh, nhớ một thời</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif text-[#fffdfa] leading-tight">
              Bộ Cà Phê & Hộp Bánh Trên Nắp Ly — Chỉ 39.000đ
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Được thiết kế tinh tế với đai giấy ôm trọn nắp ly và đáy hộp bánh giòn, chống rơi rớt khi di chuyển. Bạn có thể vừa đi dạo phố Pasteur vừa thưởng thức bữa sáng gọn gàng.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => {
                  trackConversion('view_combo_page', { source: 'packaging_guide_cta' });
                  onOpenComboModal();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs sm:text-sm border-2 border-[#d4af37] flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
              >
                <Coffee className="w-4 h-4 text-amber-300" />
                <span>Xem Chi Tiết Bộ Cà Phê–Bánh</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                type="button"
                onClick={() => {
                  trackConversion('packaging_feedback', { source: 'packaging_guide_feedback' });
                  onOpenFeedbackModal();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-sm bg-[#fffdfa] hover:bg-[#ede2cb] text-stone-900 font-serif font-bold text-xs sm:text-sm border border-stone-300 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <MessageSquareHeart className="w-4 h-4 text-[#801419]" />
                <span>Góp Ý Về Bao Bì & Nắp Ly</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

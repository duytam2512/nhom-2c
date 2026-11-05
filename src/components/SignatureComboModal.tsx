/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Coffee, 
  Sparkles, 
  ShoppingBag, 
  Zap, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Share2, 
  Tag, 
  Check, 
  Layers, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { CartItem, MenuItem } from '../types/coffee';
import { trackConversion } from '../services/conversionTracker';

interface SignatureComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  creatorRef?: string | null;
}

export const SignatureComboModal: React.FC<SignatureComboModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  creatorRef,
}) => {
  const [temperature, setTemperature] = useState<'cold' | 'hot'>('cold');
  const [sugarLevel, setSugarLevel] = useState<'100%' | '70%' | '50%' | '30%' | '0%'>('70%');
  const [iceLevel, setIceLevel] = useState<'100%' | '70%' | '50%' | '0%'>('70%');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'intro' | 'guide'>('intro');

  if (!isOpen) return null;

  const unitPrice = 39000;
  const totalPrice = unitPrice * quantity;

  const handleBuildCartItem = (): CartItem => {
    return {
      id: `cart-combo-${Date.now()}`,
      menuItemId: 'hl-combo-sang',
      name: 'Bộ Cà Phê & Hộp Bánh Trên Nắp Ly',
      size: 'M',
      temperature,
      sugarLevel,
      iceLevel: temperature === 'cold' ? iceLevel : '0%',
      milkType: 'standard',
      toppings: [],
      quantity,
      unitPrice,
      totalPrice: unitPrice,
      specialInstructions: 'Hộp bánh nắp ly đai giấy 2-in-1 mang đi',
      image: '/images/drive/Ca-phe-kem-hop-banh.png',
    };
  };

  const handleAdd = () => {
    const item = handleBuildCartItem();
    trackConversion('start_order', { 
      item: 'Bộ Cà Phê & Hộp Bánh Trên Nắp Ly', 
      creatorRef: creatorRef || undefined,
      action: 'add_to_cart' 
    });
    onAddToCart(item);
    onClose();
  };

  const handleInstantBuy = () => {
    const item = handleBuildCartItem();
    trackConversion('start_order', { 
      item: 'Bộ Cà Phê & Hộp Bánh Trên Nắp Ly', 
      creatorRef: creatorRef || undefined,
      action: 'buy_now' 
    });
    onBuyNow(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-[#fffdfa] rounded-lg border-2 border-[#801419] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#801419] text-amber-100 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="font-serif font-black text-xs sm:text-sm uppercase tracking-wider text-amber-200">
              Chiến Dịch Sản Phẩm Chủ Lực • GO.COFFEE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm bg-black/20 hover:bg-black/40 text-amber-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Banner if visited via referral link */}
        {creatorRef && (
          <div className="bg-[#ede2cb] border-b border-[#801419]/30 px-4 py-2 flex items-center justify-between text-xs font-serif text-[#801419]">
            <span className="font-bold flex items-center gap-1.5">
              <span>★</span> Bạn được giới thiệu bởi Creator: <strong className="font-mono text-stone-900 underline">@{creatorRef}</strong>
            </span>
            <span className="text-[11px] bg-[#801419] text-amber-200 px-2 py-0.5 rounded-xs font-mono font-bold">
              GOCOFFEE20 (-20%)
            </span>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          
          {/* Main Visual & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            <div className="sm:col-span-5 relative">
              <div className="rounded-md overflow-hidden border-2 border-[#801419]/30 aspect-square relative shadow-md bg-stone-950">
                <img
                  src={activeTab === 'intro' ? '/images/drive/Ca-phe-kem-hop-banh.png' : '/images/drive/go-coffee.png'}
                  alt="Bộ Cà Phê & Hộp Bánh Trên Nắp Ly"
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/drive/Ca-phe-kem-hop-banh.png';
                  }}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-[#801419] text-amber-200 text-[10px] font-serif font-black uppercase border border-[#d4af37]">
                  2-in-1 Cầm 1 Tay
                </span>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-2.5">
              <div className="text-[11px] font-mono font-black text-[#801419] uppercase tracking-wider">
                MÓN ĐỘC QUYỀN SÀI GÒN XƯA
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-serif text-[#23150d] leading-tight">
                Bộ Cà Phê & Hộp Bánh Trên Nắp Ly
              </h2>

              <p className="text-xs sm:text-sm font-serif italic text-amber-800 font-bold">
                “Chấm một miếng bánh, nhớ một thời”
              </p>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Một ly cà phê phin sữa đá đậm đà Cầu Đất cùng một phần bánh nhỏ giòn rụm. Hộp bánh gắn gọn trên nắp ly kèm đai giấy kraft sang trọng, cầm gọn bằng 1 tay và tháo ra dễ dàng khi dùng.
              </p>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-mono font-black text-[#801419]">
                  39.000đ
                </span>
                <span className="text-sm font-mono text-stone-400 line-through">
                  45.000đ
                </span>
                <span className="text-xs px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 font-bold font-serif">
                  Tiết kiệm 6.000đ
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-serif text-stone-600 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#801419]" />
                <span>Ghé nhận sau <strong>5 phút</strong> tại 120 Pasteur (Dự kiến)</span>
              </div>
            </div>
          </div>

          {/* Tab Selector: Giới Thiệu vs Hướng Dẫn Tháo Hộp */}
          <div className="flex border-b border-stone-200 text-xs font-serif font-bold">
            <button
              onClick={() => setActiveTab('intro')}
              className={`py-2 px-4 border-b-2 transition cursor-pointer ${
                activeTab === 'intro'
                  ? 'border-[#801419] text-[#801419]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Tùy chỉnh ly cà phê
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-2 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-[#801419] text-[#801419]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#801419]" />
              Hướng dẫn mở hộp 3 bước
            </button>
          </div>

          {/* Tab Content: Customize Options */}
          {activeTab === 'intro' && (
            <div className="space-y-4 pt-1">
              {/* Temperature */}
              <div>
                <label className="text-xs font-serif font-bold text-stone-700 block mb-1.5">
                  Nhiệt độ ly cà phê:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                  <button
                    type="button"
                    onClick={() => setTemperature('cold')}
                    className={`py-2 rounded-sm border transition cursor-pointer font-bold ${
                      temperature === 'cold'
                        ? 'bg-[#801419] text-amber-200 border-[#d4af37]'
                        : 'bg-[#faf5ec] border-stone-300 text-stone-700'
                    }`}
                  >
                    ❄ Cà phê đá mát lạnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemperature('hot')}
                    className={`py-2 rounded-sm border transition cursor-pointer font-bold ${
                      temperature === 'hot'
                        ? 'bg-[#801419] text-amber-200 border-[#d4af37]'
                        : 'bg-[#faf5ec] border-stone-300 text-stone-700'
                    }`}
                  >
                    ☕ Cà phê nóng ấm
                  </button>
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="text-xs font-serif font-bold text-stone-700 block mb-1.5">
                  Mức ngọt (sữa đặc Ngôi Sao Phương Nam):
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
                  {(['100%', '70%', '50%', '30%', '0%'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSugarLevel(lvl)}
                      className={`py-1.5 rounded-sm border text-center transition cursor-pointer font-bold ${
                        sugarLevel === lvl
                          ? 'bg-[#801419] text-amber-200 border-[#d4af37]'
                          : 'bg-[#faf5ec] border-stone-300 text-stone-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <span className="text-xs font-serif font-bold text-stone-700">
                  Số lượng combo:
                </span>
                <div className="flex items-center gap-3 bg-[#faf5ec] border border-stone-300 px-3 py-1 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-600 hover:text-black font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm min-w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-stone-600 hover:text-black font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Promo reminder */}
              <div className="p-2.5 rounded-sm bg-[#faf5ec] border border-[#d6c7b2] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#801419]" />
                  <span className="font-serif">Mã ưu đãi đơn đầu tiên: <strong className="font-mono text-[#801419]">GOCOFFEE20</strong></span>
                </div>
                <span className="text-[11px] font-serif text-emerald-800 font-bold">Giảm 20% từ 50k</span>
              </div>
            </div>
          )}

          {/* Tab Content: Packaging Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3 bg-[#faf5ec] rounded-sm border border-[#d6c7b2] space-y-1">
                <div className="font-serif font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#801419] text-amber-200 flex items-center justify-center font-mono text-xs">1</span>
                  Cầm gọn trọn vẹn 1 tay
                </div>
                <p className="text-stone-600 pl-7 font-sans">
                  Nắp ly được dập khuôn ôm khít đáy hộp bánh, có đai giấy thương hiệu GO.COFFEE giữ chắc, di chuyển bằng xe máy không sợ rơi rớt.
                </p>
              </div>

              <div className="p-3 bg-[#faf5ec] rounded-sm border border-[#d6c7b2] space-y-1">
                <div className="font-serif font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#801419] text-amber-200 flex items-center justify-center font-mono text-xs">2</span>
                  Tháo đai giấy & mở hộp trong 2 giây
                </div>
                <p className="text-stone-600 pl-7 font-sans">
                  Chỉ cần kéo nhẹ đai giấy ra, nhấc hộp bánh lên. Nắp ly cà phê có nắp đậy uống riêng hoặc cắm ống hút độc lập.
                </p>
              </div>

              <div className="p-3 bg-[#faf5ec] rounded-sm border border-[#d6c7b2] space-y-1">
                <div className="font-serif font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#801419] text-amber-200 flex items-center justify-center font-mono text-xs">3</span>
                  Chấm bánh ngập ly cà phê phin
                </div>
                <p className="text-stone-600 pl-7 font-sans">
                  Chấm từng miếng bánh nướng thơm lừng vào cốt phin sữa đá ngọt béo đậm đà — hương vị Sài Gòn xưa được gói trọn vẹn.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons: Mua Ngay Lập Tức & Thêm Vào Giỏ Hàng */}
          <div className="pt-3 border-t border-[#801419]/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleInstantBuy}
              className="w-full py-3.5 px-4 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs sm:text-sm border-2 border-[#d4af37] flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Mua Ngay Lập Tức ({totalPrice.toLocaleString('vi-VN')}đ)</span>
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-3.5 px-4 rounded-sm bg-[#fffdfa] hover:bg-[#ede2cb] text-stone-900 font-serif font-bold text-xs sm:text-sm border border-stone-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#801419]" />
              <span>Thêm Vào Giỏ Hàng</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Star, 
  MessageSquareHeart, 
  CheckCircle2, 
  ShieldCheck, 
  Send,
  Coffee,
  Copy,
  Check
} from 'lucide-react';
import { trackConversion } from '../services/conversionTracker';
import { safeStorage } from '../utils/safeStorage';

interface PackagingFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackagingFeedbackModal: React.FC<PackagingFeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [flavorRating, setFlavorRating] = useState<number>(5);
  const [lidFirmness, setLidFirmness] = useState<string>('Rất chắc chắn, không bị lỏng');
  const [pastryCondition, setPastryCondition] = useState<string>('Bánh rất giòn rụm');
  const [unboxingEase, setUnboxingEase] = useState<string>('Thao tác tháo đai & nắp rất dễ dàng');
  const [customerComment, setCustomerComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = {
      id: `fb-${Date.now()}`,
      flavorRating,
      lidFirmness,
      pastryCondition,
      unboxingEase,
      customerComment,
      timestamp: new Date().toISOString(),
    };

    // Save to local storage for store manager review
    try {
      const existingStr = safeStorage.getItem('go_coffee_packaging_feedbacks');
      const list = existingStr ? JSON.parse(existingStr) : [];
      list.unshift(feedbackData);
      safeStorage.setItem('go_coffee_packaging_feedbacks', JSON.stringify(list.slice(0, 100)));
    } catch (e) {}

    trackConversion('packaging_feedback', {
      flavorRating,
      lidFirmness,
      pastryCondition,
      unboxingEase,
    });

    setIsSubmitted(true);
  };

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText('GOCOFFEE20');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-[#fffdfa] rounded-lg border-2 border-[#801419] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#801419] text-amber-100 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-amber-300" />
            <span className="font-serif font-black text-xs sm:text-sm uppercase tracking-wider text-amber-200">
              Khảo Sát & Góp Ý Bao Bì GO.COFFEE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm bg-black/20 hover:bg-black/40 text-amber-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-serif font-bold text-stone-900">
              Cảm Ơn Quý Khách Đã Góp Ý!
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
              Ý kiến của quý khách về độ chắc nắp ly và chất lượng bánh sẽ giúp GO.COFFEE cải tiến bao bì ngày một hoàn thiện hơn.
            </p>

            {/* Thank you voucher code */}
            <div className="p-4 bg-[#faf5ec] border border-[#d6c7b2] rounded-md space-y-2">
              <span className="text-xs font-serif text-stone-700 block">
                Tặng bạn mã ưu đãi đơn hàng tiếp theo:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-black text-lg text-[#801419] bg-white px-3 py-1 rounded border border-[#801419]/30">
                  GOCOFFEE20
                </span>
                <button
                  onClick={handleCopyVoucher}
                  className="px-3 py-1.5 rounded bg-[#801419] hover:bg-[#630f14] text-amber-100 text-xs font-serif font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 font-serif">Giảm 20% cho đơn từ 50.000đ</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-sm bg-[#801419] text-amber-100 font-serif font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#630f14]"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="text-xs text-stone-600 font-serif border-b border-stone-200 pb-3">
              Mỗi góp ý về độ chắc chắn của nắp ly, độ ẩm của bánh và thao tác mở hộp giúp đội ngũ GO.COFFEE hoàn thiện trải nghiệm mang đi tốt nhất.
            </div>

            {/* 1. Flavor Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-stone-800 block">
                1. Hương vị cà phê phin & bánh nướng:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFlavorRating(star)}
                    className="p-1 cursor-pointer transition hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= flavorRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-amber-800 ml-2">
                  {flavorRating}/5 sao
                </span>
              </div>
            </div>

            {/* 2. Firmness of the Lid */}
            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-stone-800 block">
                2. Độ chắc chắn của nắp gắn hộp bánh khi di chuyển xe máy:
              </label>
              <div className="space-y-1 text-xs">
                {[
                  'Rất chắc chắn, không bị lỏng hay đổ',
                  'Vừa phải, an toàn khi chạy êm',
                  'Hơi lỏng, cần đai giấy giữ chặt hơn',
                ].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 p-2 rounded-xs bg-[#faf5ec] border border-stone-200 cursor-pointer hover:bg-[#ede2cb]"
                  >
                    <input
                      type="radio"
                      name="lidFirmness"
                      checked={lidFirmness === opt}
                      onChange={() => setLidFirmness(opt)}
                      className="accent-[#801419]"
                    />
                    <span className="text-stone-800 font-serif">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Pastry Condition */}
            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-stone-800 block">
                3. Tình trạng bánh khi mở hộp thưởng thức:
              </label>
              <div className="space-y-1 text-xs">
                {[
                  'Bánh rất giòn rụm, thơm ngon',
                  'Bánh còn ấm vừa, giòn nhẹ',
                  'Bánh bị hơi ẩm do hơi nước bốc lên từ ly',
                  'Bánh bị khô hoặc mềm',
                ].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 p-2 rounded-xs bg-[#faf5ec] border border-stone-200 cursor-pointer hover:bg-[#ede2cb]"
                  >
                    <input
                      type="radio"
                      name="pastryCondition"
                      checked={pastryCondition === opt}
                      onChange={() => setPastryCondition(opt)}
                      className="accent-[#801419]"
                    />
                    <span className="text-stone-800 font-serif">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Unboxing Ease */}
            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-stone-800 block">
                4. Thao tác tháo đai giấy và mở nắp hộp bánh:
              </label>
              <div className="space-y-1 text-xs">
                {[
                  'Thao tác tháo đai & nắp rất dễ dàng (dưới 3 giây)',
                  'Cần dùng 2 tay giữ ly mới nhấc được hộp',
                  'Khó tháo, cần in hướng dẫn rõ hơn trên đai giấy',
                ].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 p-2 rounded-xs bg-[#faf5ec] border border-stone-200 cursor-pointer hover:bg-[#ede2cb]"
                  >
                    <input
                      type="radio"
                      name="unboxingEase"
                      checked={unboxingEase === opt}
                      onChange={() => setUnboxingEase(opt)}
                      className="accent-[#801419]"
                    />
                    <span className="text-stone-800 font-serif">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Freeform comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-stone-800 block">
                5. Ý kiến đóng góp thêm (nếu có):
              </label>
              <textarea
                value={customerComment}
                onChange={(e) => setCustomerComment(e.target.value)}
                placeholder="Ví dụ: Mong quán thêm vị bánh phô mai, làm đai giấy dễ xé hơn..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-sm border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#801419] bg-white font-sans"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Gửi Đánh Giá & Nhận Voucher 20%</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

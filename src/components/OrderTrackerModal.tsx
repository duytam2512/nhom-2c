import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  Coffee, 
  Bike, 
  Store, 
  PhoneCall, 
  Share2, 
  Check, 
  Copy,
  Receipt,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Order } from '../types/coffee';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(2); // 1: Received, 2: Brewing, 3: Ready
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(2); // start brewing
      // Automatically advance to ready after 12 seconds for interactive delight
      const timer = setTimeout(() => {
        setCurrentStep(3);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-amber-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 border border-amber-700/60 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-200 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Theo Dõi Đơn Hàng Live</h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Trực tiếp
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Go & Grab Barista đang chuẩn bị đồ uống cho bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-amber-200 hover:text-white hover:bg-amber-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Big Pickup Code Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-800">
              Mã Lấy Cà Phê Tại Quầy (Hoặc Cho Tài Xế)
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-stone-900">
                {order.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-2xs transition"
                title="Sao chép mã"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Dự kiến hoàn thành: <strong className="text-stone-900">{order.estimatedReadyTime}</strong> ({order.orderType === 'pickup' ? 'Sau 5-8 phút' : 'Sau 15-20 phút'})</span>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>TIẾN ĐỘ THỰC HIỆN</span>
              <button
                onClick={() => setCurrentStep((prev) => (prev < 3 ? prev + 1 : 1))}
                className="text-[10px] text-amber-800 font-semibold underline hover:text-amber-900"
              >
                Mô phỏng bước tiếp theo ⚡
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: 'Đã nhận đơn hàng & xác nhận thanh toán',
                  desc: 'Hệ thống đã chuyển đơn tới quầy Barista',
                  icon: Receipt,
                },
                {
                  step: 2,
                  title: 'Barista đang xay hạt & pha chế tươi',
                  desc: 'Chiết xuất espresso chuẩn 9 bar & canh nhiệt bọt sữa',
                  icon: Coffee,
                },
                {
                  step: 3,
                  title: order.orderType === 'pickup' ? 'Đã hoàn thành! Mời bạn tới quầy nhận' : 'Tài xế đang giao cà phê nóng/lạnh đến bạn',
                  desc: order.orderType === 'pickup' ? `Đọc mã ${order.code} tại quầy ưu tiên Go & Grab` : `Giao tới: ${order.deliveryAddress || 'Địa chỉ của bạn'}`,
                  icon: order.orderType === 'pickup' ? Store : Bike,
                },
              ].map((s) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.step;
                const isCurrent = currentStep === s.step;

                return (
                  <div key={s.step} className="flex items-start gap-3 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-amber-950' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                          }`}
                        >
                          {s.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                            Đang xử lý...
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Receipt Summary */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-800">CHI TIẾT HÓA ĐƠN ĐIỆN TỬ</span>
              <span className="text-[11px] text-stone-500">Giờ đặt: {order.createdAt}</span>
            </div>

            <div className="space-y-2 divide-y divide-stone-200/50">
              {order.items.map((it, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-stone-900">
                      {it.quantity}x {it.name} (Size {it.size})
                    </span>
                    <div className="text-[11px] text-stone-500">
                      {it.temperature === 'cold' ? 'Đá' : 'Nóng'} • {it.sugarLevel} ngọt
                      {it.toppings.length > 0 && ` • +${it.toppings.map((t) => t.name).join(', ')}`}
                    </div>
                  </div>
                  <span className="font-medium text-stone-800">
                    {(it.totalPrice * it.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{order.subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Khuyến mãi</span>
                  <span>-{order.discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phương thức</span>
                <span className="uppercase font-semibold text-stone-800">
                  {order.paymentMethod === 'vietqr' ? 'VietQR NAPAS 247' : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-stone-200">
                <span>Tổng tiền đã thanh toán</span>
                <span className="text-amber-900 text-base">{order.total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="flex items-center justify-between text-xs text-stone-600 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
            <span className="flex items-center gap-1.5 font-medium">
              <Store className="w-3.5 h-3.5 text-amber-800" />
              {order.orderType === 'pickup' && order.store ? order.store.name : 'Go & Grab Hỗ Trợ Đơn'}
            </span>
            <a
              href="tel:0909123456"
              className="text-amber-800 hover:underline font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" /> 0909 123 456
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition"
          >
            Đã Hiểu • Quay Lại Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

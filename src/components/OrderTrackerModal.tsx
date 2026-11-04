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
  MapPin,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Landmark,
  CheckCheck,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { Order } from '../types/coffee';
import { cancelCoffeeOrder } from '../services/bookingSync';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order: initialOrder,
  isOpen,
  onClose,
  onOrderUpdated,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder);
  const [currentStep, setCurrentStep] = useState<number>(2); // 1: Received, 2: Brewing, 3: Ready
  const [copiedCode, setCopiedCode] = useState(false);

  // Cancellation and refund form states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Đổi ý / Đặt nhầm món');
  const [customReason, setCustomReason] = useState('');
  const [refundMethod, setRefundMethod] = useState<'bank_transfer' | 'momo' | 'cash'>('bank_transfer');
  const [refundBank, setRefundBank] = useState('Vietcombank');
  const [refundAccountInfo, setRefundAccountInfo] = useState('');
  const [refundAccountName, setRefundAccountName] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrder) {
      setCurrentOrder(initialOrder);
      if (initialOrder.status === 'refund_requested' || initialOrder.status === 'cancelled') {
        setCurrentStep(1);
      }
    }
  }, [initialOrder]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(2); // start brewing
      const timer = setTimeout(() => {
        setCurrentStep(3);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !currentOrder) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentOrder.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isCancelled = currentOrder.status === 'cancelled';
  const isRefundRequested = currentOrder.status === 'refund_requested';

  const handleSubmitCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelError(null);

    const finalReason = cancelReason === 'Lý do khác' ? customReason.trim() : cancelReason;
    if (!finalReason) {
      setCancelError('Vui lòng cung cấp lý do hủy đơn.');
      return;
    }

    if (refundMethod !== 'cash' && !refundAccountInfo.trim()) {
      setCancelError(refundMethod === 'momo' ? 'Vui lòng nhập số điện thoại ví MoMo nhận hoàn tiền.' : 'Vui lòng nhập số tài khoản ngân hàng nhận hoàn tiền.');
      return;
    }

    if (refundMethod !== 'cash' && !refundAccountName.trim()) {
      setCancelError('Vui lòng nhập họ và tên chủ tài khoản thụ hưởng.');
      return;
    }

    setIsSubmittingCancel(true);

    try {
      const fullAccountInfo = refundMethod === 'bank_transfer' 
        ? `${refundBank} - STK: ${refundAccountInfo.trim()}`
        : refundMethod === 'momo'
        ? `MoMo: ${refundAccountInfo.trim()}`
        : 'Nhận tiền mặt tại quầy 120 Pasteur';

      const res = await cancelCoffeeOrder({
        code: currentOrder.code,
        reason: finalReason,
        refundMethod,
        refundAccountInfo: fullAccountInfo,
        refundAccountName: refundAccountName.trim() || currentOrder.customerName,
      });

      const updated: Order = {
        ...currentOrder,
        status: 'refund_requested',
        cancellationReason: finalReason,
        refundMethod,
        refundAccountInfo: fullAccountInfo,
        refundAccountName: refundAccountName.trim() || currentOrder.customerName,
        cancelledAt: new Date().toISOString(),
        refundStatus: 'pending',
      };

      setCurrentOrder(updated);
      if (onOrderUpdated) {
        onOrderUpdated(updated);
      }
      setIsCancelModalOpen(false);
    } catch (err: any) {
      setCancelError('Có lỗi khi gửi yêu cầu. Bạn có thể gọi trực tiếp hotline 0909 123 456!');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fffdfa] w-full sm:max-w-2xl md:max-w-3xl rounded-t-xl sm:rounded-lg shadow-2xl border-2 border-[#801419]/40 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] pb-[env(safe-area-inset-bottom,8px)] sm:pb-0">
        {/* Header - Vintage Saigon Style */}
        <div className="p-4 sm:p-5 border-b-2 border-[#d4af37] flex items-center justify-between bg-[#801419] text-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#d4af37] text-[#52090c] flex items-center justify-center shadow-xs">
              <Coffee className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-100 text-base sm:text-lg">Tiến Độ Pha Chế Quán Xưa</h3>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#d4af37] text-[#52090c] px-2 py-0.5 rounded-xs shadow-2xs">
                  Trực tiếp
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-sans">
                Barista Go Coffee đang chưng cất từng giọt phin cho bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm flex items-center justify-center text-amber-200 hover:text-white hover:bg-black/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">

          {/* CANCELLATION & REFUND STATUS BANNER (If requested or cancelled) */}
          {isRefundRequested && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                  <RotateCcw className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-amber-950">
                      Đã Gửi Yêu Cầu Hủy Đơn & Hoàn Tiền
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-200 text-amber-900 border border-amber-300">
                      Đang xử lý hoàn tiền (5 - 15 phút)
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Hệ thống đã ngừng chuẩn bị món và chuyển thông tin cho quầy thu ngân Go Coffee 120 Pasteur để hoàn tiền lại cho bạn.
                  </p>
                </div>
              </div>

              {/* Refund summary docket */}
              <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 text-xs space-y-1.5 font-sans">
                <div className="flex justify-between items-center text-stone-700">
                  <span className="text-stone-500">Mã đơn hủy:</span>
                  <span className="font-mono font-bold text-stone-900">{currentOrder.code}</span>
                </div>
                <div className="flex justify-between items-center text-stone-700">
                  <span className="text-stone-500">Số tiền cần hoàn:</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">{currentOrder.total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center text-stone-700">
                  <span className="text-stone-500">Hình thức nhận:</span>
                  <span className="font-semibold text-stone-900">
                    {currentOrder.refundMethod === 'momo' ? 'Ví điện tử MoMo' : currentOrder.refundMethod === 'cash' ? 'Tiền mặt tại quầy' : 'Chuyển khoản VietQR'}
                  </span>
                </div>
                {currentOrder.refundAccountInfo && (
                  <div className="flex justify-between items-center text-stone-700">
                    <span className="text-stone-500">Tài khoản nhận:</span>
                    <span className="font-mono font-bold text-stone-900">{currentOrder.refundAccountInfo}</span>
                  </div>
                )}
                {currentOrder.refundAccountName && (
                  <div className="flex justify-between items-center text-stone-700">
                    <span className="text-stone-500">Tên người nhận:</span>
                    <span className="font-bold uppercase text-stone-900">{currentOrder.refundAccountName}</span>
                  </div>
                )}
                {currentOrder.cancellationReason && (
                  <div className="flex justify-between items-center text-stone-700 pt-1 border-t border-stone-100">
                    <span className="text-stone-500">Lý do hủy:</span>
                    <span className="italic text-stone-800">{currentOrder.cancellationReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-serif font-bold text-sm sm:text-base text-emerald-950">
                  Đơn Hàng Đã Được Hủy & Hoàn Tiền Thành Công
                </h4>
              </div>
              <p className="text-xs text-emerald-800">
                Toàn bộ số tiền <strong>{currentOrder.total.toLocaleString('vi-VN')}đ</strong> đã được chuyển trả về tài khoản của bạn. Cảm ơn bạn và hẹn sớm phục vụ bạn trong lần tới!
              </p>
            </div>
          )}

          {/* Big Pickup Code Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-800">
              {isRefundRequested || isCancelled ? 'Mã Đơn Hàng' : 'Mã Lấy Cà Phê Tại Quầy (Hoặc Cho Tài Xế)'}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-3xl sm:text-4xl font-black font-mono tracking-wider ${isCancelled ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                {currentOrder.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-2xs transition cursor-pointer"
                title="Sao chép mã"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {isRefundRequested ? (
                  <strong className="text-amber-800 font-bold">Đang chờ giải quyết hoàn tiền</strong>
                ) : isCancelled ? (
                  <strong className="text-rose-800 font-bold">Đã hủy đơn thành công</strong>
                ) : (
                  <>
                    Giờ nhận hàng dự kiến:{' '}
                    <strong className="text-stone-900 font-bold">
                      {currentOrder.pickupTime || currentOrder.estimatedReadyTime}
                    </strong>{' '}
                    ({currentOrder.orderType === 'pickup' ? 'Ghé lấy tại quầy Q.1' : 'Giao tận nơi'})
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Step Timeline (Only when not cancelled) */}
          {!isCancelled && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span>TIẾN ĐỘ THỰC HIỆN</span>
                {!isRefundRequested && (
                  <button
                    onClick={() => setCurrentStep((prev) => (prev < 3 ? prev + 1 : 1))}
                    className="text-[10px] text-amber-800 font-semibold underline hover:text-amber-900 cursor-pointer"
                  >
                    Mô phỏng bước tiếp theo ⚡
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: isRefundRequested ? 'Tiếp nhận yêu cầu hủy & hoàn tiền' : 'Đã nhận đơn hàng & xác nhận thanh toán',
                    desc: isRefundRequested ? 'Bộ phận thu ngân đang đối soát thông tin tài khoản hoàn tiền' : 'Hệ thống đã chuyển đơn tới quầy Barista',
                    icon: isRefundRequested ? RotateCcw : Receipt,
                  },
                  {
                    step: 2,
                    title: isRefundRequested ? 'Đang chuyển khoản hoàn tiền' : 'Barista đang xay hạt & pha chế tươi',
                    desc: isRefundRequested ? 'Tiền sẽ về tài khoản của bạn trong 5 - 15 phút' : 'Chiết xuất espresso chuẩn 9 bar & canh nhiệt bọt sữa',
                    icon: isRefundRequested ? Landmark : Coffee,
                  },
                  {
                    step: 3,
                    title: isRefundRequested ? 'Hoàn tiền hoàn tất' : (currentOrder.orderType === 'pickup' ? 'Đã hoàn thành! Mời bạn tới quầy nhận' : 'Tài xế đang giao cà phê nóng/lạnh đến bạn'),
                    desc: isRefundRequested ? 'Cảm ơn bạn đã luôn ủng hộ Go Coffee' : (currentOrder.orderType === 'pickup' ? `Đọc mã ${currentOrder.code} tại quầy ưu tiên Go Coffee` : `Giao tới: ${currentOrder.deliveryAddress || 'Địa chỉ của bạn'}`),
                    icon: isRefundRequested ? CheckCircle : (currentOrder.orderType === 'pickup' ? Store : Bike),
                  },
                ].map((s) => {
                  const Icon = s.icon;
                  const isCompleted = isRefundRequested ? false : currentStep > s.step;
                  const isCurrent = isRefundRequested ? s.step === 1 : currentStep === s.step;

                  return (
                    <div key={s.step} className="flex items-start gap-3 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? isRefundRequested ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse' : 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
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
          )}

          {/* Receipt Summary */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-800">CHI TIẾT HÓA ĐƠN ĐIỆN TỬ</span>
              <span className="text-[11px] text-stone-500">Giờ đặt: {currentOrder.createdAt}</span>
            </div>

            <div className="space-y-2 divide-y divide-stone-200/50">
              {currentOrder.items.map((it, idx) => (
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
                <span>{currentOrder.subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Khuyến mãi</span>
                  <span>-{currentOrder.discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phương thức</span>
                <span className="uppercase font-semibold text-stone-800">
                  {currentOrder.paymentMethod === 'vietqr' ? 'VietQR NAPAS 247' : currentOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-stone-200">
                <span>{isRefundRequested || isCancelled ? 'Số tiền hoàn lại' : 'Tổng tiền đã thanh toán'}</span>
                <span className="text-amber-900 text-base">{currentOrder.total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="flex items-center justify-between text-xs text-stone-600 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
            <span className="flex items-center gap-1.5 font-medium">
              <Store className="w-3.5 h-3.5 text-amber-800" />
              {currentOrder.orderType === 'pickup' && currentOrder.store ? currentOrder.store.name : 'Go Coffee 120 Pasteur'}
            </span>
            <a
              href="tel:0909123456"
              className="text-amber-800 hover:underline font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" /> 0909 123 456
            </a>
          </div>

          {/* CANCELLATION REQUEST MODAL / FORM DIALOG */}
          {isCancelModalOpen && (
            <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
              <div className="bg-[#fffdfa] w-full max-w-lg rounded-2xl shadow-2xl border-2 border-[#801419]/40 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 bg-[#801419] text-amber-100 flex items-center justify-between border-b-2 border-[#d4af37]">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-300" />
                    <h4 className="font-serif font-bold text-base">Hủy Đơn & Yêu Cầu Hoàn Tiền</h4>
                  </div>
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    className="p-1 rounded-sm text-amber-200 hover:text-white hover:bg-black/20 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitCancellation} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
                  {cancelError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{cancelError}</span>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-stone-700 space-y-1">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span>☕ Cam kết hoàn tiền 100% tại Go Coffee:</span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-stone-600">
                      Nếu đơn hàng chưa giao, bạn có quyền hủy đơn bất cứ lúc nào. Khoản tiền <strong>{currentOrder.total.toLocaleString('vi-VN')}đ</strong> sẽ được chuyển hoàn lại tài khoản ngân hàng hoặc ví MoMo của bạn trong <strong>5 - 15 phút</strong>.
                    </p>
                  </div>

                  {/* Reason Selection */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
                      1. Lý do bạn muốn hủy đơn hàng
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Đổi ý / Đặt nhầm món',
                        'Thời gian giao quá lâu',
                        'Có việc bận đột xuất',
                        'Muốn đổi địa chỉ nhận',
                        'Đặt trùng lặp đơn',
                        'Lý do khác',
                      ].map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setCancelReason(reason)}
                          className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                            cancelReason === reason
                              ? 'border-[#801419] bg-amber-100/70 text-[#801419] font-bold ring-1 ring-[#801419]'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${cancelReason === reason ? 'border-[#801419] bg-[#801419]' : 'border-stone-400'}`}>
                            {cancelReason === reason && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="text-xs">{reason}</span>
                        </button>
                      ))}
                    </div>

                    {cancelReason === 'Lý do khác' && (
                      <input
                        type="text"
                        placeholder="Vui lòng nêu rõ lý do hủy..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
                      />
                    )}
                  </div>

                  {/* Refund Destination Method */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <label className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
                      2. Hình thức nhận lại tiền hoàn ({currentOrder.total.toLocaleString('vi-VN')}đ)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'bank_transfer' as const, name: 'Chuyển khoản VietQR', icon: Landmark },
                        { id: 'momo' as const, name: 'Ví MoMo', icon: CreditCard },
                        { id: 'cash' as const, name: 'Tiền mặt tại quầy', icon: Store },
                      ].map((method) => {
                        const Icon = method.icon;
                        const isSelected = refundMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setRefundMethod(method.id)}
                            className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                              isSelected
                                ? 'border-[#801419] bg-amber-50 text-[#801419] font-bold ring-1 ring-[#801419]'
                                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[11px]">{method.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bank / MoMo Details Input */}
                  {refundMethod === 'bank_transfer' && (
                    <div className="space-y-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div>
                        <label className="text-[10px] font-bold text-stone-600 block mb-1">
                          Ngân hàng thụ hưởng
                        </label>
                        <select
                          value={refundBank}
                          onChange={(e) => setRefundBank(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold"
                        >
                          {['Vietcombank', 'MB Bank', 'Techcombank', 'BIDV', 'VietinBank', 'ACB', 'VPBank', 'TPBank', 'Sacombank', 'Khác'].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">
                            Số tài khoản ngân hàng *
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập số tài khoản..."
                            value={refundAccountInfo}
                            onChange={(e) => setRefundAccountInfo(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">
                            Tên chủ tài khoản (Viết hoa) *
                          </label>
                          <input
                            type="text"
                            placeholder="VD: NGUYEN VAN A"
                            value={refundAccountName}
                            onChange={(e) => setRefundAccountName(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-bold uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {refundMethod === 'momo' && (
                    <div className="space-y-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">
                            Số điện thoại ví MoMo *
                          </label>
                          <input
                            type="tel"
                            placeholder="VD: 0909123456"
                            value={refundAccountInfo}
                            onChange={(e) => setRefundAccountInfo(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">
                            Tên người nhận ví MoMo *
                          </label>
                          <input
                            type="text"
                            placeholder="VD: NGUYEN VAN A"
                            value={refundAccountName}
                            onChange={(e) => setRefundAccountName(e.target.value.toUpperCase())}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-bold uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {refundMethod === 'cash' && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-stone-600 text-xs">
                      Quán sẽ hoàn tiền mặt trực tiếp tại quầy <strong>120 Pasteur, P. Bến Nghé, Quận 1</strong> khi bạn đến lấy hoặc hủy đơn trước khi giao.
                    </div>
                  )}

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold cursor-pointer text-xs"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingCancel}
                      className="px-5 py-2.5 rounded-xl bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs shadow-md border border-[#d4af37] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingCancel ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang gửi yêu cầu...</span>
                        </>
                      ) : (
                        <span>Xác Nhận Hủy Đơn & Nhận Tiền</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Cancellation Action and Close */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!isRefundRequested && !isCancelled ? (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-sm border-2 border-rose-300 hover:bg-rose-50 text-rose-800 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
              <span>Hủy Đơn & Yêu Cầu Hoàn Tiền</span>
            </button>
          ) : (
            <div className="text-xs font-serif italic text-stone-500">
              {isRefundRequested ? 'Đơn hàng đang chờ hoàn tiền trong 5-15 phút' : 'Đơn hàng đã hủy'}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-xs shadow-xs border border-[#d4af37] transition cursor-pointer"
          >
            Đã Hiểu • Quay Lại Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

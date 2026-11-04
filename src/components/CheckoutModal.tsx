import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowRight,
  Smartphone,
  ChevronRight,
  AlertCircle,
  Zap,
  Calendar
} from 'lucide-react';
import { CartItem, Order, PaymentMethodType, StoreLocation, Voucher } from '../types/coffee';
import { submitCoffeeOrder } from '../services/bookingSync';
import { trackConversion } from '../services/conversionTracker';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: 'pickup' | 'delivery';
  selectedStore: StoreLocation;
  deliveryAddress: string;
  appliedVoucher: Voucher | null;
  onOrderSuccess: (order: Order) => void;
  pickupTime?: string;
  setPickupTime?: (time: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  selectedStore,
  deliveryAddress,
  appliedVoucher,
  onOrderSuccess,
  pickupTime,
  setPickupTime,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('vietqr');
  const [customerName, setCustomerName] = useState('Nguyễn Văn Khải');
  const [customerPhone, setCustomerPhone] = useState('0909123456');
  const [customerNote, setCustomerNote] = useState('');
  const [localPickupTime, setLocalPickupTime] = useState<string>(
    pickupTime || (orderType === 'pickup' ? 'Lấy ngay (~5 - 8 phút)' : 'Giao ngay (~15 - 20 phút)')
  );
  const [customTimeInput, setCustomTimeInput] = useState<string>('09:00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSelectPickupTime = (time: string) => {
    setLocalPickupTime(time);
    setPickupTime?.(time);
  };

  const isAsap = localPickupTime.startsWith('Lấy ngay') || localPickupTime.startsWith('Giao ngay');

  const TIME_SLOTS = [
    '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', 
    '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', 
    '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', 
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedVoucher.discountValue) / 100);
    } else {
      discount = appliedVoucher.discountValue;
    }
  }
  const shippingFee = orderType === 'delivery' ? (appliedVoucher?.code === 'FREESHIP' ? 0 : 18000) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  // Generate random order code
  const orderCode = `GNC-${Math.floor(1000 + Math.random() * 9000)}`;
  const bankAccount = '1288889999';
  const bankName = 'BIDV - CN TP.HCM';
  const accountHolder = 'GO COFFEE';
  const transferContent = `GOCOFFEE ${orderCode}`;

  // VietQR Image URL
  const vietQrUrl = `https://img.vietqr.io/image/970418-${bankAccount}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountHolder)}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFinishPayment = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng nhập tên và số điện thoại nhận hàng.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#b45309', '#d97706', '#f59e0b', '#10b981', '#fcd34d'],
        });
      } catch (e) {
        // Confetti fallback
      }

      const readyTime = localPickupTime.startsWith('Hẹn lúc')
        ? localPickupTime.replace('Hẹn lúc ', '')
        : new Date(Date.now() + (orderType === 'pickup' ? 8 : 20) * 60000).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          });

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        code: orderCode,
        items,
        subtotal,
        discount,
        shippingFee,
        total,
        orderType,
        store: orderType === 'pickup' ? selectedStore : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerNote: customerNote.trim() ? customerNote.trim() : undefined,
        pickupTime: localPickupTime,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        status: 'brewing',
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        estimatedReadyTime: readyTime,
      };

      // Dual-channel notify Telegram Bot & Google Sheets in background
      submitCoffeeOrder(newOrder).catch((e) => console.error('Order sync error:', e));

      // Track order completed conversion
      trackConversion('order_completed', {
        orderCode: newOrder.code,
        total: newOrder.total,
        voucher: appliedVoucher?.code,
        orderType: newOrder.orderType,
        itemsCount: newOrder.items.length,
      });

      setIsProcessing(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fffdfa] w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-t-xl sm:rounded-lg shadow-2xl border-2 border-[#801419]/40 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] pb-[env(safe-area-inset-bottom,8px)] sm:pb-0">
        {/* Header: Vintage Saigon Cafe Receipt Style */}
        <div className="p-4 sm:p-5 border-b-2 border-[#d4af37] flex items-center justify-between bg-[#801419] text-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#d4af37] text-[#52090c] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-100 text-base sm:text-lg">Phiếu Thanh Toán Đặt Món Quán Xưa</h3>
              <p className="text-xs text-amber-200/90 font-mono">Mã đơn: <span className="font-bold text-amber-300 bg-black/25 px-1.5 py-0.5 rounded-xs">{orderCode}</span> • 120 Pasteur, Q.1</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm flex items-center justify-center text-amber-200 hover:text-white hover:bg-black/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Customer Info Form */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center justify-between">
              <span>Thông tin khách nhận</span>
              <span className="text-[11px] text-amber-700 font-normal">
                {orderType === 'pickup' ? `Lấy tại: Go Coffee - 120 Pasteur, Quận 1` : `Giao đến: ${deliveryAddress || 'Chưa nhập địa chỉ'}`}
              </span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Họ và tên khách hàng *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Khải"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Số điện thoại nhận mã đồ uống *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0909 xxx xxx"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Ghi chú thêm (Tùy chọn)
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Ví dụ: Giao lên lầu 4 tòa nhà, gọi trước khi đến 5 phút..."
                className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>

          {/* Giờ Nhận Hàng (Pickup / Delivery Time Selection) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border border-amber-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#b22830]" />
                <span>Giờ nhận hàng ({orderType === 'pickup' ? 'Ghé lấy tại quầy Q.1' : 'Giao tận nơi'}) *</span>
              </label>
              <span className="text-[11px] font-black text-[#b22830] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                {localPickupTime}
              </span>
            </div>

            {/* Mode Toggle: Lấy ngay vs Hẹn giờ */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPickupTime(orderType === 'pickup' ? 'Lấy ngay (~5 - 8 phút)' : 'Giao ngay (~15 - 20 phút)')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                  isAsap
                    ? 'bg-[#b22830] text-white border-[#b22830] shadow-sm font-black'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{orderType === 'pickup' ? 'Lấy ngay (~5-8 phút)' : 'Giao ngay (~15-20 phút)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAsap) {
                    handleSelectPickupTime('Hẹn lúc 09:00');
                  }
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                  !isAsap
                    ? 'bg-[#b22830] text-white border-[#b22830] shadow-sm font-black'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Hẹn giờ nhận hôm nay</span>
              </button>
            </div>

            {/* Scheduled Time Picker */}
            {!isAsap && (
              <div className="pt-2 border-t border-amber-200/60 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-stone-700 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-800" />
                    <span>Chọn khung giờ chuẩn bị nước:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-500">Hoặc tự nhập giờ:</span>
                    <input
                      type="time"
                      min="06:30"
                      max="22:45"
                      value={customTimeInput}
                      onChange={(e) => {
                        setCustomTimeInput(e.target.value);
                        if (e.target.value) {
                          handleSelectPickupTime(`Hẹn lúc ${e.target.value}`);
                        }
                      }}
                      className="px-2 py-1 text-xs font-bold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b22830]"
                    />
                  </div>
                </div>

                {/* Popular chips */}
                <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto p-1.5 bg-white rounded-xl border border-stone-200">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setCustomTimeInput(t);
                        handleSelectPickupTime(`Hẹn lúc ${t}`);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg font-bold transition cursor-pointer ${
                        localPickupTime === `Hẹn lúc ${t}`
                          ? 'bg-amber-400 text-stone-950 font-black shadow-xs ring-1 ring-amber-500 scale-105'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] text-stone-500 italic">
              * Quầy Go Coffee tại 120 Pasteur, Quận 1 sẽ bắt đầu pha chế tươi đúng khung giờ bạn chọn để đảm bảo hương vị cà phê và độ lạnh chuẩn nhất.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Chọn phương thức thanh toán nhanh
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'vietqr', name: 'VietQR Pro', desc: 'Quét mọi app ngân hàng', icon: QrCode, badge: 'Phổ biến nhất' },
                { id: 'momo', name: 'Ví MoMo / Zalo', desc: 'Thanh toán 1 chạm', icon: Wallet, badge: 'Ưu đãi' },
                { id: 'applepay', name: 'Apple / Card', desc: 'Visa, Mastercard', icon: CreditCard },
                { id: 'cash', name: 'Tiền mặt', desc: orderType === 'pickup' ? 'Tại quầy' : 'Khi nhận hàng', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {m.badge && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-700 text-white">
                        {m.badge}
                      </span>
                    )}
                    <div>
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-amber-800' : 'text-stone-500'}`} />
                      <div className="text-xs font-bold leading-tight">{m.name}</div>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC PAYMENT DETAILS VIEW */}
          {paymentMethod === 'vietqr' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-stone-50 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mã VietQR NAPAS 247 Dynamic Code
                </span>
                <span className="text-stone-500 text-[11px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700" /> Hết hạn sau 09:45
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* QR Code Container */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-sm flex flex-col items-center text-center">
                  <div className="relative group p-1 bg-white rounded-lg">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Payment Code"
                      className="w-48 h-48 object-contain rounded-md"
                      onError={(e) => {
                        // Fallback static mock QR visual if network offline
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="mt-2 text-[11px] text-stone-500 font-medium">
                      Mở app ngân hàng bất kỳ để quét
                    </div>
                  </div>
                </div>

                {/* Account Details Copy Table */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Ngân hàng</span>
                      <span className="font-bold text-stone-800">{bankName}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Số tài khoản</span>
                      <span className="font-mono font-bold text-amber-900 text-sm">{bankAccount}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(bankAccount, 'acc')}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold flex items-center gap-1 transition"
                    >
                      {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Số tiền thanh toán</span>
                      <span className="font-mono font-bold text-rose-700 text-sm">
                        {total.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(total.toString(), 'amount')}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold flex items-center gap-1 transition"
                    >
                      {copiedField === 'amount' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Nội dung chuyển khoản</span>
                      <span className="font-mono font-bold text-stone-900">{transferContent}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(transferContent, 'memo')}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold flex items-center gap-1 transition"
                    >
                      {copiedField === 'memo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'memo' ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'momo' && (
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
                  MoMo
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">Thanh toán qua Ví MoMo</h5>
                  <p className="text-[11px] text-stone-600">Mở app MoMo hoặc liên kết tài khoản để thanh toán tự động với ưu đãi hoàn tiền 5%.</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-pink-100 text-xs text-stone-700 flex justify-between items-center">
                <span>Số tiền trừ ví:</span>
                <span className="font-bold text-pink-700 text-sm">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          )}

          {paymentMethod === 'applepay' && (
            <div className="p-4 rounded-xl bg-stone-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-300" /> Apple Pay / Thẻ Quốc Tế
                </span>
                <span className="text-[11px] text-stone-400">One-Tap Pay</span>
              </div>
              <p className="text-xs text-stone-300">
                Chạm FaceID hoặc xác nhận vân tay Touch ID để hoàn tất giao dịch cà phê trong 1 giây mà không cần điền số thẻ.
              </p>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-stone-700">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-amber-700" />
                Thanh toán tiền mặt khi nhận đồ uống
              </div>
              <p>
                {orderType === 'pickup'
                  ? 'Quý khách vui lòng thanh toán trực tiếp tại quầy thu ngân Go Coffee khi đọc mã đơn hàng.'
                  : 'Tài xế Go Coffee sẽ thu đúng số tiền đơn hàng khi giao cà phê đến tận tay bạn.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Fast Checkout Action Button */}
        <div className="p-4 bg-[#faf5ec] border-t border-[#801419]/15 flex flex-col sm:flex-row items-center justify-between gap-3 font-serif">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[11px] text-stone-600 block">Tổng thanh toán:</span>
            <span className="text-xl font-mono font-bold text-[#801419]">
              {total.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleFinishPayment}
            className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#801419] hover:bg-[#630f14] text-amber-100 font-serif font-bold text-sm shadow-md border-2 border-[#d4af37] flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer uppercase tracking-wider"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                <span>Đang in phiếu & báo quầy...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>
                  {paymentMethod === 'vietqr'
                    ? 'Đã Chuyển Khoản • Hoàn Tất Đặt Món'
                    : 'Xác Nhận Đặt Món Quán Xưa'}
                </span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

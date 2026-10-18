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
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, PaymentMethodType, StoreLocation, Voucher } from '../types/coffee';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: 'pickup' | 'delivery';
  selectedStore: StoreLocation;
  deliveryAddress: string;
  appliedVoucher: Voucher | null;
  onOrderSuccess: (order: Order) => void;
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
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('vietqr');
  const [customerName, setCustomerName] = useState('Nguyễn Văn Khải');
  const [customerPhone, setCustomerPhone] = useState('0909123456');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
  const accountHolder = 'GO AND GRAB COFFEE';
  const transferContent = `GOCAFE ${orderCode}`;

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

      const readyTime = new Date(Date.now() + (orderType === 'pickup' ? 8 : 20) * 60000).toLocaleTimeString('vi-VN', {
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
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        status: 'brewing',
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        estimatedReadyTime: readyTime,
      };

      // Notify Telegram Bot in background
      fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch((e) => console.error('Order notification error:', e));

      setIsProcessing(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">Thanh Toán Đặt Cà Phê Siêu Tốc</h3>
              <p className="text-xs text-stone-500">Mã đơn: <span className="font-mono font-bold text-amber-800">{orderCode}</span> • Bảo mật giao dịch SSL 256-bit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
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
                {orderType === 'pickup' ? `Lấy tại: ${selectedStore.name}` : `Giao đến: ${deliveryAddress || 'Chưa nhập địa chỉ'}`}
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
                  ? 'Quý khách vui lòng thanh toán trực tiếp tại quầy thu ngân Go & Grab khi đọc mã đơn hàng.'
                  : 'Tài xế Go & Grab sẽ thu đúng số tiền đơn hàng khi giao cà phê đến tận tay bạn.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Fast Checkout Action Button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[11px] text-stone-500 block">Tổng cần thanh toán:</span>
            <span className="text-lg font-black text-amber-900">
              {total.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleFinishPayment}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xác nhận đơn hàng...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>
                  {paymentMethod === 'vietqr'
                    ? 'Tôi Đã Chuyển Khoản • Xác Nhận Ngay'
                    : 'Hoàn Tất Đặt Hàng Siêu Tốc'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

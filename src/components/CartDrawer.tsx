import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Store, 
  Truck, 
  Tag, 
  Check, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { CartItem, StoreLocation, Voucher } from '../types/coffee';
import { STORES, VOUCHERS } from '../data/coffeeData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  orderType: 'pickup' | 'delivery';
  setOrderType: (type: 'pickup' | 'delivery') => void;
  selectedStore: StoreLocation;
  setSelectedStore: (store: StoreLocation) => void;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
  appliedVoucher: Voucher | null;
  setAppliedVoucher: (voucher: Voucher | null) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  orderType,
  setOrderType,
  selectedStore,
  setSelectedStore,
  deliveryAddress,
  setDeliveryAddress,
  appliedVoucher,
  setAppliedVoucher,
  onProceedToCheckout,
}) => {
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedVoucher.discountValue) / 100);
    } else {
      discount = appliedVoucher.discountValue;
    }
  }

  // Shipping fee
  const shippingFee = orderType === 'delivery' ? (appliedVoucher?.code === 'FREESHIP' ? 0 : 18000) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyVoucher = (code: string) => {
    setVoucherError('');
    const found = VOUCHERS.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setVoucherError('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
      return;
    }
    if (subtotal < found.minOrder) {
      setVoucherError(`Đơn hàng tối thiểu ${found.minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này.`);
      return;
    }
    setAppliedVoucher(found);
    setVoucherInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Giỏ Hàng Cà Phê</h3>
                <p className="text-xs text-stone-500">
                  {items.length === 0 ? 'Chưa có sản phẩm' : `${items.reduce((s, i) => s + i.quantity, 0)} món đã chọn`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery or Pickup Segmented Control */}
          <div className="p-3 bg-stone-100/70 border-b border-stone-200/60">
            <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  orderType === 'pickup'
                    ? 'bg-white text-amber-950 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-4 h-4 text-amber-700" />
                Ghé Lấy (5 phút)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  orderType === 'delivery'
                    ? 'bg-white text-amber-950 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Truck className="w-4 h-4 text-amber-700" />
                Giao Tận Nơi (15p)
              </button>
            </div>

            {/* Location details */}
            {orderType === 'pickup' ? (
              <div className="mt-2.5 p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-start justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{selectedStore.name}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 pl-5">{selectedStore.address}</p>
                </div>
                <select
                  value={selectedStore.id}
                  onChange={(e) => {
                    const st = STORES.find((s) => s.id === e.target.value);
                    if (st) setSelectedStore(st);
                  }}
                  className="text-[11px] bg-white border border-amber-300 rounded-lg px-2 py-1 text-amber-900 font-semibold focus:outline-none"
                >
                  {STORES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.district}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-700" /> Địa chỉ nhận đồ uống:
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Nhập số nhà, tên đường, phường/quận..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                />
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-stone-600">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs text-stone-400 max-w-xs">
                  Hãy chọn những ly cà phê đặc sản thơm ngon hoặc trà trái cây mát lạnh để nạp năng lượng ngay nhé!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/phindi-hanh-nhan.jpg';
                    }}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                      {item.name}
                    </h4>
                    
                    {/* Attributes */}
                    <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                      <p>
                        Size {item.size} • {item.temperature === 'cold' ? 'Đá mát' : 'Nóng'} • Ngọt {item.sugarLevel}
                        {item.temperature === 'cold' ? ` • Đá ${item.iceLevel}` : ''}
                      </p>
                      {item.milkType !== 'standard' && (
                        <p className="text-amber-800 font-medium">
                          {item.milkType === 'oat' ? '+ Sữa yến mạch Oatly' : '+ Sữa hạnh nhân'}
                        </p>
                      )}
                      {item.toppings.length > 0 && (
                        <p className="text-amber-700">
                          + {item.toppings.map((t) => t.name).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-stone-400 italic">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Price and quantity counter */}
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-bold text-xs text-amber-900">
                        {(item.totalPrice * item.quantity).toLocaleString('vi-VN')}đ
                      </span>

                      <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-stone-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-800 min-w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2.5 right-2.5 text-stone-400 hover:text-rose-600 transition p-1"
                    title="Xóa món"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Vouchers & Summary Footer */}
          {items.length > 0 && (
            <div className="p-4 bg-stone-50/90 border-t border-stone-200 space-y-3 shrink-0">
              {/* Voucher input */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Nhập mã ưu đãi (VD: GRAB20)"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher(voucherInput)}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold transition"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Suggested chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-stone-500">Gợi ý mã:</span>
                  {VOUCHERS.map((v) => (
                    <button
                      key={v.code}
                      onClick={() => handleApplyVoucher(v.code)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition ${
                        appliedVoucher?.code === v.code
                          ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400'
                      }`}
                    >
                      {v.code}
                    </button>
                  ))}
                </div>

                {appliedVoucher && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs text-emerald-900">
                    <span className="flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Đã áp dụng mã {appliedVoucher.code} ({appliedVoucher.description})
                    </span>
                    <button
                      onClick={() => setAppliedVoucher(null)}
                      className="text-stone-400 hover:text-stone-700 text-[11px]"
                    >
                      Hủy
                    </button>
                  </div>
                )}

                {voucherError && (
                  <p className="text-[11px] text-rose-600 font-medium">{voucherError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Tạm tính món ({items.reduce((s, i) => s + i.quantity, 0)} ly)</span>
                  <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Ưu đãi voucher ({appliedVoucher?.code})</span>
                    <span>-{discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Phí {orderType === 'pickup' ? 'ghé lấy' : 'giao hàng'}</span>
                  <span>
                    {orderType === 'pickup' ? (
                      <span className="text-emerald-700 font-medium">Miễn phí (Tự lấy)</span>
                    ) : shippingFee === 0 ? (
                      <span className="text-emerald-700 font-medium">0đ (Freeship)</span>
                    ) : (
                      `${shippingFee.toLocaleString('vi-VN')}đ`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-1 border-t border-stone-200">
                  <span>Tổng thanh toán</span>
                  <span className="text-amber-800 text-base">{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-amber-950/20 transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Tiến Hành Thanh Toán Nhanh</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

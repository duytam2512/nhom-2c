import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, Coffee, Sparkles } from 'lucide-react';
import { MenuItem, CartItem, Topping } from '../types/coffee';
import { AVAILABLE_TOPPINGS } from '../data/coffeeData';

interface ProductModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [temperature, setTemperature] = useState<'cold' | 'hot'>('cold');
  const [sugarLevel, setSugarLevel] = useState<'0%' | '30%' | '50%' | '100%'>('50%');
  const [iceLevel, setIceLevel] = useState<'0%' | '50%' | '100%'>('100%');
  const [milkType, setMilkType] = useState<'standard' | 'oat' | 'almond' | 'sweetened_condensed'>('standard');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (item) {
      setSize('M');
      setTemperature(item.temperature === 'hot' ? 'hot' : 'cold');
      setSugarLevel('50%');
      setIceLevel('100%');
      setMilkType('standard');
      setSelectedToppings([]);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Calculate pricing
  const sizePriceAddon = size === 'S' ? 0 : size === 'M' ? 6000 : 12000;
  const milkPriceAddon = milkType === 'oat' ? 10000 : milkType === 'almond' ? 12000 : 0;
  const toppingsPrice = selectedToppings.reduce((sum, top) => sum + top.price, 0);
  const unitPrice = item.price + sizePriceAddon + milkPriceAddon + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAdd = () => {
    const newCartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.price,
      totalPrice: unitPrice,
      size,
      temperature,
      sugarLevel,
      iceLevel,
      milkType,
      toppings: selectedToppings,
      quantity,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
    };
    onAddToCart(newCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col md:flex-row max-h-[92dvh] sm:max-h-[88vh]">
        {/* Left Side (Desktop): Product Image & Heritage Story */}
        <div className="relative h-56 sm:h-64 md:h-auto md:w-5/12 bg-stone-900 shrink-0 flex flex-col justify-end p-5 text-white overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/phindi-hanh-nhan.jpg';
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Close button (Mobile only) */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Item details overlay */}
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {item.isSignature && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[11px] font-bold flex items-center gap-1 shadow">
                  <Sparkles className="w-3 h-3" /> Chữ ký quán
                </span>
              )}
              {item.isBestSeller && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 shadow">
                  <Flame className="w-3 h-3" /> Bán chạy nhất
                </span>
              )}
              {item.calories && (
                <span className="px-2 py-0.5 rounded-full bg-stone-800/80 backdrop-blur text-stone-300 text-[11px]">
                  {item.calories} kcal
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display leading-tight">
              {item.name}
            </h2>
            {item.vietnameseName && (
              <p className="text-xs text-amber-200/90 font-medium">
                {item.vietnameseName}
              </p>
            )}
            <p className="text-xs text-stone-200/90 line-clamp-3 hidden md:block pt-1">
              {item.description}
            </p>
          </div>
        </div>

        {/* Right Side (Desktop): Customization Options & Add to Cart */}
        <div className="md:w-7/12 flex flex-col flex-1 overflow-hidden bg-white">
          {/* Desktop Close Button Header */}
          <div className="hidden md:flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50/70">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Tùy Chọn Đồ Uống</span>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">Tùy biến theo khẩu vị riêng của bạn</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body with Customization Options */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Description (Mobile only) */}
            <p className="md:hidden text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              {item.description}
            </p>

          {/* Size Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center justify-between">
              <span>1. Chọn kích cỡ ly</span>
              <span className="text-[11px] text-amber-700 font-normal">Bắt buộc</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { key: 'S', label: 'Size Nhỏ (S)', vol: '250ml', extra: 0 },
                { key: 'M', label: 'Size Vừa (M)', vol: '350ml', extra: 6000 },
                { key: 'L', label: 'Size Lớn (L)', vol: '500ml', extra: 12000 },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSize(s.key as 'S' | 'M' | 'L')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    size === s.key
                      ? 'border-amber-700 bg-amber-50/70 text-amber-950 ring-1 ring-amber-700 font-semibold'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="text-xs font-bold">{s.label}</span>
                  <span className="text-[10px] text-stone-500">{s.vol}</span>
                  <span className="text-[11px] font-semibold text-amber-800 mt-1">
                    {s.extra === 0 ? 'Tiêu chuẩn' : `+${s.extra.toLocaleString('vi-VN')}đ`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Choice (if item allows both) */}
          {item.temperature === 'both' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                2. Nhiệt độ thưởng thức
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTemperature('cold')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    temperature === 'cold'
                      ? 'border-sky-600 bg-sky-50 text-sky-950 ring-1 ring-sky-600'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  🧊 Uống Đá Mát Lạnh
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('hot')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    temperature === 'hot'
                      ? 'border-orange-600 bg-orange-50 text-orange-950 ring-1 ring-orange-600'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  ♨️ Uống Nóng Ấm
                </button>
              </div>
            </div>
          )}

          {/* Sugar & Ice options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sugar level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Lượng ngọt (Đường/Sữa)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['100%', '50%', '30%', '0%'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSugarLevel(lvl)}
                    className={`py-2 px-1 text-xs rounded-lg border transition text-center ${
                      sugarLevel === lvl
                        ? 'border-amber-800 bg-amber-100/70 font-bold text-amber-950'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {lvl === '100%'
                      ? '100% Chuẩn'
                      : lvl === '50%'
                      ? '50% Ít ngọt'
                      : lvl === '30%'
                      ? '30% Rất ít'
                      : '0% Không'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice level (only for cold) */}
            {temperature === 'cold' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Lượng đá
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['100%', '50%', '0%'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setIceLevel(lvl)}
                      className={`py-2 px-1 text-xs rounded-lg border transition text-center ${
                        iceLevel === lvl
                          ? 'border-cyan-700 bg-cyan-50 font-bold text-cyan-950'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {lvl === '100%' ? 'Chuẩn' : lvl === '50%' ? '50% Đá' : 'Không đá'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Milk type upgrade if coffee (phin/phindi) */}
          {['phin', 'phindi', 'espresso', 'traditional'].includes(item.category) && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Tùy chọn loại sữa
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'standard', name: 'Sữa đặc / tươi chuẩn', extra: 0 },
                  { key: 'oat', name: 'Sữa yến mạch Oatly', extra: 10000 },
                  { key: 'almond', name: 'Sữa hạnh nhân Mỹ', extra: 12000 },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMilkType(m.key as any)}
                    className={`p-2 rounded-xl border text-left transition flex flex-col ${
                      milkType === m.key
                        ? 'border-amber-800 bg-amber-50 text-amber-950 font-semibold ring-1 ring-amber-800'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{m.name}</span>
                    <span className="text-[10px] text-amber-800">
                      {m.extra === 0 ? 'Mặc định' : `+${m.extra.toLocaleString('vi-VN')}đ`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings Checklist */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center justify-between">
              <span>Topping thêm (Tùy chọn)</span>
              <span className="text-[11px] text-stone-500">Chọn tối đa 4 loại</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_TOPPINGS.map((top) => {
                const isSelected = selectedToppings.some((t) => t.id === top.id);
                return (
                  <div
                    key={top.id}
                    onClick={() => toggleTopping(top)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/70 text-amber-950 font-medium'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-amber-800 border-amber-800 text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs">{top.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-800">
                      +{top.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes for Barista */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Ghi chú cho Barista
            </label>
            <input
              type="text"
              placeholder="VD: Để riêng đá, ly giấy bã mía, ít ngọt hơn bình thường..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-stone-200 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-stone-900 w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-900/20 flex items-center justify-between transition group"
          >
            <span>Thêm vào giỏ</span>
            <span className="text-amber-200 font-extrabold group-hover:translate-x-0.5 transition-transform">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

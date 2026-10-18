import React from 'react';
import { MapPin, Clock, Phone, Navigation, Check, Store } from 'lucide-react';
import { StoreLocation } from '../types/coffee';
import { STORES } from '../data/coffeeData';

interface StoreLocatorProps {
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  selectedStore,
  onSelectStore,
}) => {
  return (
    <section id="stores" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Store className="w-3.5 h-3.5 text-amber-800" />
          <span>Hệ Thống Go & Grab Pickup</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
          Điểm Nhận Cà Phê Go & Grab
        </h2>
        <p className="text-xs sm:text-base text-stone-600 max-w-xl mx-auto">
          Chọn chi nhánh thuận tiện trên cung đường đi làm của bạn. Đồ uống sẽ được chuẩn bị sẵn trước khi bạn bước chân đến.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STORES.map((store) => {
          const isSelected = selectedStore.id === store.id;
          return (
            <div
              key={store.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/60 border-amber-600 ring-2 ring-amber-600/30 shadow-md'
                  : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block">
                      {store.district} • {store.city}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      {store.name}
                    </h3>
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{store.hours} • <strong className="text-emerald-700">Đang mở</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Chuẩn bị sau:</span>
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    ⚡ {store.estimatedPickupMinutes} phút
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectStore(store)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-800 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {isSelected ? 'Điểm Đang Chọn' : 'Chọn Điểm Này'}
                </button>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                  title="Mở Google Maps chỉ đường"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

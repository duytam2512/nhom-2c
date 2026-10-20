import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Check, 
  Store, 
  Search, 
  Filter, 
  Sparkles, 
  Armchair, 
  Car, 
  Wifi, 
  Wind, 
  SunMedium, 
  Gift,
  CreditCard
} from 'lucide-react';
import { StoreLocation } from '../types/coffee';
import { STORES, ExtendedStoreLocation } from '../data/coffeeData';

interface StoreLocatorProps {
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
  onOpenTableBooking?: (store?: StoreLocation) => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  selectedStore,
  onSelectStore,
  onOpenTableBooking,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');

  const cities = [
    { id: 'all', label: 'Toàn Quốc' },
    { id: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
    { id: 'Hà Nội', label: 'Hà Nội' },
    { id: 'Đà Nẵng', label: 'Đà Nẵng' },
  ];

  const amenities = [
    { id: 'all', label: 'Tất cả tiện ích' },
    { id: 'Mở cửa 24/7', label: '🌙 Mở 24/7' },
    { id: 'Có chỗ đỗ ô tô', label: '🚗 Chỗ đỗ ô tô' },
    { id: 'Sân vườn', label: '🌿 Sân vườn thoáng' },
    { id: 'Máy lạnh', label: '❄️ Máy lạnh' },
    { id: 'Thẻ quà tặng', label: '🎁 Thẻ thành viên Go Coffee' },
  ];

  const filteredStores = useMemo(() => {
    return STORES.filter((store) => {
      // City filter
      if (selectedCity !== 'all' && !store.city.includes(selectedCity)) {
        return false;
      }
      // Amenity filter
      if (selectedAmenity !== 'all') {
        const hasAmenity = (store.amenities || []).some((a) =>
          a.toLowerCase().includes(selectedAmenity.toLowerCase())
        );
        if (!hasAmenity) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = store.name.toLowerCase().includes(q);
        const matchAddress = store.address.toLowerCase().includes(q);
        const matchDistrict = store.district.toLowerCase().includes(q);
        const matchLandmark = (store.landmark || '').toLowerCase().includes(q);
        if (!matchName && !matchAddress && !matchDistrict && !matchLandmark) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCity, selectedAmenity, searchQuery]);

  return (
    <section id="stores" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Header with Highlands-style Signature Red Badge */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-[#8c141c] text-xs font-black uppercase tracking-wider shadow-2xs">
          <Store className="w-3.5 h-3.5 text-[#b22830]" />
          <span>Tìm Quán Gần Bạn • Hệ Thống Go Coffee</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-black font-display text-stone-900 tracking-tight">
          Hơn 500+ Không Gian Cà Phê Đậm Đà
        </h2>
        
        <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto">
          Tìm quán Go Coffee thuận tiện nhất trên cung đường của bạn. Không gian máy lạnh mát mẻ, wifi mượt mà, sẵn sàng phục vụ tại chỗ hoặc mang đi nhanh trong 5 phút.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-stone-200/80 mb-8 space-y-4">
        
        {/* City Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Khu vực:
          </span>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCity === city.id
                  ? 'bg-[#b22830] text-white shadow-sm ring-1 ring-red-800'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        {/* Search input & Amenity dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-stone-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên đường, quận, địa danh (VD: Nhà Hát, Hồ Gươm, Q.1...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#b22830]/30 focus:border-[#b22830]"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              aria-label="Lọc theo tiện ích quán"
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b22830]/30 focus:border-[#b22830]"
            >
              {amenities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300 p-8 space-y-3">
          <p className="text-stone-500 font-semibold text-sm">
            Không tìm thấy quán nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            onClick={() => {
              setSelectedCity('all');
              setSelectedAmenity('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-[#b22830] underline"
          >
            Đặt lại bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => {
            const isSelected = selectedStore.id === store.id;
            return (
              <div
                key={store.id}
                className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white ${
                  isSelected
                    ? 'border-[#b22830] ring-2 ring-[#b22830]/30 shadow-lg'
                    : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {/* Store Image & Landmark */}
                {store.image && (
                  <div className="relative h-40 w-full overflow-hidden bg-stone-900 shrink-0">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#b22830] text-amber-200 text-[10px] font-black uppercase tracking-wider shadow">
                        {store.district} • {store.city}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-white text-[#b22830] px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow">
                        <Check className="w-3 h-3" /> Điểm đang chọn
                      </div>
                    )}

                    {store.landmark && (
                      <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-medium truncate">
                        📍 {store.landmark}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-stone-900 text-base leading-snug">
                        {store.name}
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#b22830] shrink-0 mt-0.5" />
                        <span className="leading-tight">{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{store.hours} • <strong className="text-emerald-700">Đang phục vụ</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <a href={`tel:${store.phone}`} className="hover:underline text-stone-700 font-semibold">{store.phone}</a>
                      </div>
                    </div>

                    {/* Amenities Badges */}
                    {store.amenities && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {store.amenities.map((am, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectStore(store)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#b22830] text-white shadow-sm'
                            : 'bg-red-50 hover:bg-red-100 text-[#8c141c]'
                        }`}
                      >
                        {isSelected ? '✓ Điểm Nhận Hàng Của Bạn' : 'Chọn Điểm Này'}
                      </button>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                        title="Mở Google Maps chỉ đường"
                      >
                        <Navigation className="w-4 h-4 text-[#b22830]" />
                      </a>
                    </div>

                    {onOpenTableBooking && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectStore(store);
                          onOpenTableBooking(store);
                        }}
                        className="w-full py-1.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <Armchair className="w-3.5 h-3.5 text-[#b22830]" />
                        <span>Đặt Bàn Giữ Chỗ Tại Quán Này</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

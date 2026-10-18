import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Plus, 
  Coffee, 
  CupSoda, 
  Croissant, 
  Leaf, 
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { CoffeeCategory, MenuItem } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tất Cả Món', icon: Coffee },
    { id: 'traditional', name: 'Cà Phê Việt', icon: Coffee },
    { id: 'espresso', name: 'Espresso & Sữa Hạt', icon: Sparkles },
    { id: 'coldbrew', name: 'Cold Brew 24H', icon: CupSoda },
    { id: 'tea', name: 'Trà Tươi & Macchiato', icon: Leaf },
    { id: 'pastry', name: 'Bánh Ngọt & Pastry', icon: Croissant },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (filterTag === 'best-seller' && !item.isBestSeller) {
        return false;
      }
      if (filterTag === 'signature' && !item.isSignature) {
        return false;
      }
      if (filterTag === 'cold' && item.temperature === 'hot') {
        return false;
      }
      if (filterTag === 'hot' && item.temperature === 'cold') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchVnName = item.vietnameseName?.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchVnName && !matchDesc && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, filterTag, searchQuery]);

  return (
    <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Menu Đặc Sản Go & Grab</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
          Chọn Ly Cà Phê Của Bạn
        </h2>
        <p className="text-xs sm:text-base text-stone-600 max-w-xl mx-auto">
          Tất cả đồ uống đều được pha chế tươi mới sau khi bạn đặt hàng, đảm bảo hương vị trọn vẹn nhất.
        </p>
      </div>

      {/* Search & Quick Filters Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm cà phê muối, bạc xỉu, oatly latte, cold brew, bánh sừng bò..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'best-seller', label: '🔥 Bán chạy' },
              { id: 'signature', label: '⭐ Signature' },
              { id: 'cold', label: '🧊 Đồ uống đá' },
              { id: 'hot', label: '♨️ Đồ uống nóng' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterTag(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterTag === t.id
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200/80">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CoffeeCategory)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-900/20'
                    : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <Coffee className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-700">Không tìm thấy món phù hợp</h3>
          <p className="text-xs text-stone-500">
            Thử tìm từ khóa khác như "cà phê", "muối", "trà" hoặc chọn danh mục khác nhé!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterTag('all');
            }}
            className="text-xs font-bold text-amber-800 underline cursor-pointer"
          >
            Xem toàn bộ menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-amber-300/80 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                    {item.isSignature && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow">
                        Signature
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Best Seller
                      </span>
                    )}
                  </div>

                  {/* Temperature Pill */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-stone-900/70 backdrop-blur text-stone-200 text-[10px] font-medium">
                    {item.temperature === 'both' ? 'Đá / Nóng' : item.temperature === 'hot' ? 'Nóng' : 'Đá'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition line-clamp-1">
                      {item.name}
                    </h3>
                    {item.vietnameseName && (
                      <p className="text-[11px] text-stone-400 truncate font-medium">
                        {item.vietnameseName}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & CTA Button */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-amber-900">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {item.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 block">Ly Size M (350ml)</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-800 text-amber-900 hover:text-white flex items-center justify-center transition shadow-2xs group-hover:bg-amber-800 group-hover:text-white cursor-pointer"
                  title="Chọn tùy chỉnh và đặt món"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

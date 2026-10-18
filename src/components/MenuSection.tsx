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
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { CoffeeCategory, MenuItem } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  selectedCategory?: CoffeeCategory;
  onSelectCategory?: (category: CoffeeCategory) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ 
  onSelectItem,
  selectedCategory: externalCategory,
  onSelectCategory: externalSetCategory
}) => {
  const [internalCategory, setInternalCategory] = useState<CoffeeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  // Sync external & internal category state
  const selectedCategory = externalCategory ?? internalCategory;
  const setSelectedCategory = (cat: CoffeeCategory) => {
    if (externalSetCategory) {
      externalSetCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const categories = [
    { id: 'all' as CoffeeCategory, name: 'Tất Cả Món', icon: Coffee },
    { id: 'traditional' as CoffeeCategory, name: 'Cà Phê Việt & Muối', icon: Flame },
    { id: 'espresso' as CoffeeCategory, name: 'Espresso & Sữa Hạt', icon: Sparkles },
    { id: 'coldbrew' as CoffeeCategory, name: 'Cold Brew 24H', icon: CupSoda },
    { id: 'tea' as CoffeeCategory, name: 'Trà Tươi & Macchiato', icon: Leaf },
    { id: 'pastry' as CoffeeCategory, name: 'Bánh Ngọt & Pastry', icon: Croissant },
  ];

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MENU_ITEMS.length };
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = MENU_ITEMS.filter((i) => i.category === cat.id).length;
      }
    });
    return counts;
  }, []);

  const filterTags = [
    { id: 'all', label: 'Tất cả khẩu vị' },
    { id: 'best-seller', label: '🔥 Bán chạy' },
    { id: 'signature', label: '⭐ Signature' },
    { id: 'cold', label: '🧊 Đồ uống đá' },
    { id: 'hot', label: '♨️ Đồ uống nóng' },
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

  const hasActiveFilters = selectedCategory !== 'all' || filterTag !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setFilterTag('all');
    setSearchQuery('');
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];

  return (
    <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Thực Đơn Go & Grab Coffee</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
          Chọn Ly Cà Phê Của Bạn
        </h2>
        <p className="text-xs sm:text-base text-stone-600 max-w-xl mx-auto">
          Tất cả đồ uống đều được pha chế tươi mới theo yêu cầu, hạt Cầu Đất 100% mộc nguyên chất.
        </p>
      </div>

      {/* Unified Menu Control Bar: Category Tabs + Search & Filters */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-3.5 sm:p-5 mb-8 space-y-4">
        
        {/* Row 1: Grouped Category Navigation Bar */}
        <div className="hidden lg:flex items-center gap-2 p-1.5 bg-[#faf7f2] rounded-2xl border border-amber-950/5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-900/20'
                    : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`} />
                <span className="truncate">{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isSelected ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile / Tablet Category Dropdown & Scrollable Pills */}
        <div className="lg:hidden space-y-2">
          <div className="relative">
            <button
              onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#faf7f2] border border-stone-200 font-bold text-xs text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <currentCategoryObj.icon className="w-4 h-4 text-amber-800" />
                <span>Danh mục: {currentCategoryObj.name}</span>
                <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                  {categoryCounts[currentCategoryObj.id]} món
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMobileCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-30 space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileCategoryOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition ${
                        isSelected
                          ? 'bg-amber-800 text-white font-bold'
                          : 'text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`} />
                        <span>{cat.name}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {categoryCounts[cat.id]} món
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Search input + Compact Taste & Temperature Filter Menu */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm món theo tên (cà phê muối, bạc xỉu, oatly latte, cold brew, bánh...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-50/80 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold p-1 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grouped Taste/Tag Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {filterTags.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterTag(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterTag === t.id
                    ? 'bg-amber-900 text-white shadow-2xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status bar if filter or search active */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600">
            <span>
              Tìm thấy <strong>{filteredItems.length}</strong> món phù hợp
            </span>
            <button
              onClick={handleResetFilters}
              className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa bộ lọc (Xem tất cả)</span>
            </button>
          </div>
        )}

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
            onClick={handleResetFilters}
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

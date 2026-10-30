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
  ChevronDown,
  Zap
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
    { 
      id: 'all' as CoffeeCategory, 
      name: 'Tất Cả Món', 
      icon: Coffee, 
      accentColor: 'text-[#b22830]', 
      badgeColor: 'bg-red-50 text-[#b22830] border border-red-200/50',
      bgHover: 'hover:bg-red-50 hover:text-[#b22830] hover:border-red-300' 
    },
    { 
      id: 'phin' as CoffeeCategory, 
      name: 'Cà Phê Phin', 
      icon: Flame, 
      accentColor: 'text-[#8c141c]', 
      badgeColor: 'bg-red-50 text-[#8c141c] border border-red-200/50',
      bgHover: 'hover:bg-red-50 hover:text-[#8c141c] hover:border-red-300' 
    },
    { 
      id: 'phindi' as CoffeeCategory, 
      name: 'PhinDi Thế Hệ Mới', 
      icon: Sparkles, 
      accentColor: 'text-[#b45309]', 
      badgeColor: 'bg-amber-50 text-amber-900 border border-amber-200/50',
      bgHover: 'hover:bg-amber-50 hover:text-[#b45309] hover:border-amber-300' 
    },
    { 
      id: 'freeze' as CoffeeCategory, 
      name: 'Freeze Đá Xay', 
      icon: CupSoda, 
      accentColor: 'text-[#047857]', 
      badgeColor: 'bg-emerald-50 text-emerald-900 border border-emerald-200/50',
      bgHover: 'hover:bg-emerald-50 hover:text-[#047857] hover:border-emerald-300' 
    },
    { 
      id: 'tea' as CoffeeCategory, 
      name: 'Trà Sen Vàng & Đào', 
      icon: Leaf, 
      accentColor: 'text-[#d97706]', 
      badgeColor: 'bg-amber-50 text-amber-900 border border-amber-200/50',
      bgHover: 'hover:bg-amber-50 hover:text-[#d97706] hover:border-amber-300' 
    },
    { 
      id: 'pastry' as CoffeeCategory, 
      name: 'Bánh Mì Que & Ngọt', 
      icon: Croissant, 
      accentColor: 'text-[#ea580c]', 
      badgeColor: 'bg-orange-50 text-orange-900 border border-orange-200/50',
      bgHover: 'hover:bg-orange-50 hover:text-[#ea580c] hover:border-orange-300' 
    },
    { 
      id: 'combo' as CoffeeCategory, 
      name: 'Combo Tiết Kiệm', 
      icon: Zap, 
      accentColor: 'text-[#b22830]', 
      badgeColor: 'bg-red-50 text-[#b22830] border border-red-300',
      bgHover: 'hover:bg-red-50 hover:text-[#b22830] hover:border-red-300' 
    },
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#b22830] text-xs font-bold uppercase tracking-wider border border-red-200">
          <Sparkles className="w-3.5 h-3.5 text-[#b22830]" />
          <span>Thực Đơn Đậm Đà Go Coffee</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
          Chọn Ly Cà Phê Của Bạn
        </h2>
        <p className="text-xs sm:text-base text-stone-600 max-w-xl mx-auto">
          Tất cả đồ uống đều được pha chế tươi mới theo yêu cầu, hạt Cầu Đất 100% mộc nguyên chất.
        </p>
      </div>

      {/* Unified Menu Control Bar: Signature Red & Gold Palette */}
      <div className="bg-white rounded-3xl border-2 border-stone-200/90 shadow-lg p-3.5 sm:p-5 mb-8 space-y-4 overflow-hidden">
        
        {/* Header Announcement Strip */}
        <div className="bg-gradient-to-r from-[#8f1920] via-[#b22830] to-[#701217] text-white p-3 sm:px-5 sm:py-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#701217] flex items-center justify-center font-black shadow-xs shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black tracking-wide uppercase flex items-center gap-1.5 text-white">
                <span>Thực Đơn Đặc Sắc Go Coffee • Hương Vị Di Sản</span>
              </h3>
              <p className="text-[11px] text-amber-200 hidden sm:block">
                Pha chế thủ công 100% hạt rang mộc • Chuẩn bị nhanh trong 5 phút • Giữ chỗ bàn miễn phí
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Phục vụ tươi mới mỗi ngày</span>
          </div>
        </div>

        {/* Row 1: Category Navigation - Responsive Desktop & Tablet Grid */}
        <div className="hidden md:grid md:grid-cols-4 xl:grid-cols-7 gap-1.5 xl:gap-2 p-2 bg-gradient-to-b from-[#faf5ee] to-[#f4ebe0] rounded-2xl border border-amber-900/10 shadow-inner">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                title={cat.name}
                className={`w-full min-w-0 py-2.5 px-2 xl:px-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 xl:gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] text-white shadow-lg shadow-red-950/25 ring-2 ring-amber-400 scale-[1.01]'
                    : `bg-white/90 text-stone-800 border border-stone-200/80 ${cat.bgHover} shadow-2xs`
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : cat.accentColor}`} />
                <span className="truncate">{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${
                  isSelected ? 'bg-amber-400 text-[#701217] shadow-xs' : cat.badgeColor
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Category Selector: Dropdown + Swipeable Pill Strip */}
        <div className="md:hidden space-y-2.5">
          {/* Quick Swipeable Category Pill Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#b22830] to-[#8f1920] text-white shadow-md ring-2 ring-amber-400'
                      : 'bg-stone-50 text-stone-700 border border-stone-200/90 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : cat.accentColor}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${
                    isSelected ? 'bg-amber-400 text-[#701217]' : cat.badgeColor
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Collapsible Dropdown for complete category overview */}
          <div className="relative">
            <button
              onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#8f1920] to-[#b22830] text-white font-bold text-xs shadow-sm border border-amber-400/50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <currentCategoryObj.icon className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">Đang xem: {currentCategoryObj.name}</span>
                <span className="text-[10px] bg-amber-400 text-[#701217] font-black px-2 py-0.5 rounded-full shadow-xs shrink-0">
                  {categoryCounts[currentCategoryObj.id]} món
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-amber-200 shrink-0 transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMobileCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border-2 border-[#b22830]/30 p-2 z-30 space-y-1">
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
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-left transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#b22830] to-[#8f1920] text-white font-black'
                          : 'text-stone-800 hover:bg-red-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : cat.accentColor}`} />
                        <span>{cat.name}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isSelected ? 'bg-amber-400 text-[#701217]' : cat.badgeColor
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
            <Search className="w-4 h-4 text-[#b22830] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm món ngon: cà phê muối, bạc xỉu, oatly latte, freeze trà sen, croissant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-50/80 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#b22830]/30 focus:border-[#b22830] transition font-medium"
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

          {/* Grouped Taste/Tag Filters with Highlands Inspired Colors */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {filterTags.map((t) => {
              const isTagActive = filterTag === t.id;
              let activeStyle = 'bg-[#8f1920] text-white shadow-md font-bold';
              let badgeColor = 'bg-stone-100 text-stone-700 hover:bg-stone-200';
              
              if (t.id === 'best-seller') {
                activeStyle = 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md ring-2 ring-amber-400/80 font-black';
                badgeColor = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60 font-semibold';
              } else if (t.id === 'signature') {
                activeStyle = 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-stone-950 shadow-md ring-2 ring-amber-300 font-black';
                badgeColor = 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60 font-semibold';
              } else if (t.id === 'cold') {
                activeStyle = 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md ring-2 ring-sky-300 font-bold';
                badgeColor = 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/60 font-semibold';
              } else if (t.id === 'hot') {
                activeStyle = 'bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-md ring-2 ring-orange-300 font-bold';
                badgeColor = 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200/60 font-semibold';
              }

              return (
                <button
                  key={t.id}
                  onClick={() => setFilterTag(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition cursor-pointer active:scale-95 ${
                    isTagActive ? activeStyle : badgeColor
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status bar if filter or search active */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600">
            <span>
              Tìm thấy <strong className="text-[#b22830]">{filteredItems.length}</strong> món phù hợp
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[#b22830] hover:text-[#8f1920] font-bold flex items-center gap-1 cursor-pointer hover:underline"
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
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/phindi-hanh-nhan.jpg';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                    {item.category === 'combo' && (
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-yellow-300" /> Combo Tiết Kiệm
                      </span>
                    )}
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

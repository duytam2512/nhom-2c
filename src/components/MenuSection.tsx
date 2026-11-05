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
  onBuyNowItem?: (item: MenuItem) => void;
  selectedCategory?: CoffeeCategory;
  onSelectCategory?: (category: CoffeeCategory) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ 
  onSelectItem,
  onBuyNowItem,
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
      id: 'combo' as CoffeeCategory, 
      name: 'Combo Mang Đi', 
      icon: Zap, 
      accentColor: 'text-[#b22830]', 
      badgeColor: 'bg-red-50 text-[#b22830] border border-red-300',
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
      id: 'tea' as CoffeeCategory, 
      name: 'Trà', 
      icon: Leaf, 
      accentColor: 'text-[#d97706]', 
      badgeColor: 'bg-amber-50 text-amber-900 border border-amber-200/50',
      bgHover: 'hover:bg-amber-50 hover:text-[#d97706] hover:border-amber-300' 
    },
    { 
      id: 'freeze' as CoffeeCategory, 
      name: 'Đá Xay (Freeze)', 
      icon: CupSoda, 
      accentColor: 'text-[#047857]', 
      badgeColor: 'bg-emerald-50 text-emerald-900 border border-emerald-200/50',
      bgHover: 'hover:bg-emerald-50 hover:text-[#047857] hover:border-emerald-300' 
    },
    { 
      id: 'pastry' as CoffeeCategory, 
      name: 'Bánh Gọi Thêm', 
      icon: Croissant, 
      accentColor: 'text-[#ea580c]', 
      badgeColor: 'bg-orange-50 text-orange-900 border border-orange-200/50',
      bgHover: 'hover:bg-orange-50 hover:text-[#ea580c] hover:border-orange-300' 
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
    { id: 'saigon-xua', label: '🥖 Sài Gòn Xưa' },
    { id: 'best-seller', label: '🔥 Bán chạy' },
    { id: 'signature', label: '⭐ Signature' },
    { id: 'cold', label: '🧊 Đồ uống đá' },
    { id: 'hot', label: '♨️ Nóng / Nướng giòn' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (filterTag === 'saigon-xua') {
        const isXua = item.tags.some(t => 
          t.toLowerCase().includes('xưa') || 
          t.toLowerCase().includes('ký ức') || 
          t.toLowerCase().includes('tuổi thơ') || 
          t.toLowerCase().includes('concept xưa cũ')
        ) || item.name.toLowerCase().includes('bánh mì') || item.id === 'hl-combo-sang-phin-den';
        if (!isXua) return false;
      }
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
      {/* Section Header: Vintage Saigon Bill-board style */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#ede2cb] text-[#801419] text-xs font-serif font-bold uppercase tracking-widest border border-[#801419]/40 shadow-2xs">
          <span>❖</span>
          <span>Thực Đơn Quán Xưa • Đậm Vị Truyền Thống</span>
          <span>❖</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-[#23150d] tracking-tight">
          Bảng Giá & Món Ngon Sài Gòn Xưa
        </h2>
        <p className="text-xs sm:text-base text-stone-700 max-w-xl mx-auto font-serif italic">
          Chiết xuất từng giọt phin mộc chậm rãi • Bánh mì nướng giòn rụm mỗi sớm mai • Pha chế tươi mới tức thì
        </p>
      </div>

      {/* Unified Menu Control Bar: Vintage Saigon Wooden Frame Style */}
      <div className="bg-[#fffdfa] rounded-lg border-2 border-[#801419]/30 shadow-md p-3.5 sm:p-5 mb-8 space-y-4 overflow-hidden">
        
        {/* Header Announcement Strip */}
        <div className="bg-[#801419] text-amber-100 p-3 sm:px-5 sm:py-3 rounded-md flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#d4af37] text-[#52090c] flex items-center justify-center font-black shadow-xs shrink-0 font-serif">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-serif font-bold tracking-wide uppercase flex items-center gap-1.5 text-amber-100">
                <span>Thực Đơn Cà Phê & Điểm Tâm Quán Xưa</span>
              </h3>
              <p className="text-[11px] text-amber-200/90 hidden sm:block font-sans">
                Pha phin mộc 100% Cầu Đất • Chuẩn bị nhanh trong 5 phút • Giữ chỗ bàn không phụ thu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-serif font-bold text-amber-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Phục vụ từ 06:30 sáng</span>
          </div>
        </div>

        {/* Row 1: Category Navigation - Vintage Wooden Tabs */}
        <div className="hidden md:grid md:grid-cols-4 xl:grid-cols-7 gap-1.5 xl:gap-2 p-2 bg-[#f4ebe0] rounded-md border border-[#801419]/15 shadow-inner">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                title={cat.name}
                className={`w-full min-w-0 py-2.5 px-2 xl:px-2.5 rounded-sm text-xs font-serif font-bold transition-all duration-200 flex items-center justify-center gap-1.5 xl:gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#801419] text-amber-200 border-[#d4af37] shadow-sm scale-[1.01]'
                    : 'bg-[#fffdfa] text-stone-800 border-[#d6c7b2] hover:bg-[#ede2cb] hover:text-[#52090c]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-[#801419]'}`} />
                <span className="truncate">{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono font-bold shrink-0 ${
                  isSelected ? 'bg-[#d4af37] text-[#52090c]' : 'bg-[#ede2cb] text-stone-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Category Selector */}
        <div className="md:hidden space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-serif font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-[#801419] text-amber-200 border-[#d4af37] shadow-sm'
                      : 'bg-[#fffdfa] text-stone-800 border-[#d6c7b2] hover:bg-[#ede2cb]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-[#801419]'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono font-bold shrink-0 ${
                    isSelected ? 'bg-[#d4af37] text-[#52090c]' : 'bg-[#ede2cb] text-stone-700'
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
              className="w-full flex items-center justify-between p-3 rounded-sm bg-[#801419] text-amber-100 font-serif font-bold text-xs shadow-sm border border-[#d4af37] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <currentCategoryObj.icon className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">Đang xem: {currentCategoryObj.name}</span>
                <span className="text-[10px] bg-[#d4af37] text-[#52090c] font-mono font-black px-1.5 py-0.5 rounded-xs shrink-0">
                  {categoryCounts[currentCategoryObj.id]} món
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-amber-200 shrink-0 transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMobileCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#fffdfa] rounded-md shadow-2xl border-2 border-[#801419]/30 p-2 z-30 space-y-1 font-serif">
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
                      className={`w-full flex items-center justify-between p-2.5 rounded-sm text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#801419] text-amber-200 font-black'
                          : 'hover:bg-[#ede2cb] text-stone-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-[#801419]'}`} />
                        <span>{cat.name}</span>
                      </span>
                      <span className="font-mono text-[10px]">{categoryCounts[cat.id]} món</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Input in Vintage Style */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm món: bánh mì, phin, muối, trà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-sm bg-[#faf5ec] border border-[#d6c7b2] text-xs font-serif text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#801419]"
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

          {/* Grouped Taste/Tag Filters styled as vintage stamps */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {filterTags.map((t) => {
              const isTagActive = filterTag === t.id;
              let style = 'bg-[#fffdfa] text-stone-800 border-[#d6c7b2] hover:bg-[#ede2cb]';
              
              if (t.id === 'saigon-xua') {
                style = isTagActive 
                  ? 'bg-[#801419] text-amber-200 border-[#d4af37] font-black shadow-sm'
                  : 'bg-[#ede2cb] text-[#801419] border-[#801419]/40 font-bold';
              } else if (isTagActive) {
                style = 'bg-[#801419] text-amber-100 border-[#d4af37] font-bold shadow-sm';
              }

              return (
                <button
                  key={t.id}
                  onClick={() => setFilterTag(t.id)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-serif whitespace-nowrap transition cursor-pointer active:scale-95 border ${style}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status bar if filter or search active */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#801419]/15 text-xs font-serif text-stone-700">
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
        <div className="text-center py-16 bg-[#fffdfa] rounded-md border-2 border-dashed border-[#801419]/30 p-8 space-y-3 font-serif">
          <Coffee className="w-12 h-12 text-[#801419]/40 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">Không tìm thấy món phù hợp</h3>
          <p className="text-xs text-stone-600">
            Thử tìm từ khóa khác như "bánh mì", "phin", "cà phê" hoặc chọn danh mục khác nhé!
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-[#801419] underline cursor-pointer"
          >
            Xem toàn bộ bảng giá quán
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-[#fffdfa] rounded-md border-2 border-[#801419]/20 hover:border-[#801419] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-48 bg-[#f5eedc] overflow-hidden border-b border-[#801419]/15">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/products/phin-sua-da.jpg';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Stamp Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {item.tags.includes('saigon-xua') && (
                      <span className="px-2 py-0.5 rounded-xs bg-[#801419] text-amber-200 text-[10px] font-serif font-black uppercase tracking-wider shadow border border-[#d4af37]">
                        Món Xưa Gia Truyền
                      </span>
                    )}
                    {item.category === 'combo' && !item.tags.includes('saigon-xua') && (
                      <span className="px-2 py-0.5 rounded-xs bg-[#2e1d13] text-amber-200 text-[10px] font-serif font-black uppercase tracking-wider shadow border border-amber-400/50 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-yellow-400" /> Combo Tiết Kiệm
                      </span>
                    )}
                    {item.isBestSeller && !item.tags.includes('saigon-xua') && (
                      <span className="px-2 py-0.5 rounded-xs bg-[#801419] text-amber-100 text-[10px] font-serif font-bold uppercase tracking-wider shadow border border-amber-300/50 flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Bán Chạy Nhất
                      </span>
                    )}
                  </div>

                  {/* Temperature Stamp */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-xs bg-[#23150d]/85 text-amber-200 text-[10px] font-serif font-medium border border-amber-800/40">
                    {item.temperature === 'both' ? 'Đá / Nóng' : item.temperature === 'hot' ? 'Nóng' : 'Đá'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-stone-900 text-sm sm:text-[15px] leading-snug group-hover:text-[#801419] transition line-clamp-1 sm:line-clamp-2 min-h-[1.375rem] sm:min-h-[2.5rem]" title={item.name}>
                      {item.name}
                    </h3>
                    {item.vietnameseName && (
                      <p className="text-[11px] font-sans text-stone-500 truncate" title={item.vietnameseName}>
                        {item.vietnameseName}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags & Savings Badge */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {item.category === 'combo' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 font-serif font-bold border border-emerald-300 whitespace-nowrap">
                        {item.id === 'hl-combo-sang' ? '⚡ Tiết kiệm 9.000đ' : '⚡ Tiết kiệm 12.000đ'}
                      </span>
                    )}
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#ede2cb] text-stone-700 font-serif font-medium whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & CTA Button (Mobile Anti-Overflow with Flex-wrap) */}
              <div className="p-3 sm:p-4 pt-0 border-t border-[#801419]/10 mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-base font-mono font-black text-[#801419] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs font-mono text-stone-400 line-through whitespace-nowrap">
                        {item.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-serif text-stone-500 block truncate whitespace-nowrap">
                    {item.category === 'pastry' ? 'Bánh gọi thêm' : item.category === 'combo' ? 'Combo ly + bánh' : 'Ly Size M (350ml)'}
                  </span>
                </div>

                {/* Actions: Add to Cart and Buy Now with flex-wrap and responsive sizing */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                    className="flex-1 sm:flex-none h-8 px-2.5 rounded-sm bg-[#fffdfa] hover:bg-[#ede2cb] text-[#801419] border border-[#801419]/40 flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer active:scale-95 text-[11px] font-serif font-bold whitespace-nowrap"
                    title="Tùy chỉnh & thêm vào giỏ hàng"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>Thêm</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBuyNowItem) {
                        onBuyNowItem(item);
                      } else {
                        onSelectItem(item);
                      }
                    }}
                    className="flex-1 sm:flex-none h-8 px-3 rounded-sm bg-[#d4af37] hover:bg-[#c29d2b] text-[#52090c] border border-[#801419] flex items-center justify-center gap-1 transition shadow-xs cursor-pointer active:scale-95 text-[11px] font-serif font-black whitespace-nowrap"
                    title="Mua ngay lập tức"
                  >
                    <Zap className="w-3 h-3 fill-[#52090c] shrink-0" />
                    <span>Mua ngay</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

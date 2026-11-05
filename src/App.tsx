/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PackagingGuide } from './components/PackagingGuide';
import { MenuSection } from './components/MenuSection';
import { StorySection } from './components/StorySection';
import { StoreLocator } from './components/StoreLocator';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SeoShareModal } from './components/SeoShareModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SignatureComboModal } from './components/SignatureComboModal';
import { PackagingFeedbackModal } from './components/PackagingFeedbackModal';
import { STORES } from './data/coffeeData';
import { CartItem, MenuItem, Order, StoreLocation, Voucher, CoffeeCategory } from './types/coffee';
import { CheckCircle } from 'lucide-react';
import { getStoreSyncConfig } from './services/bookingSync';
import { safeStorage } from './utils/safeStorage';
import { getCreatorRefFromUrl, trackConversion } from './services/conversionTracker';

export default function App() {
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupTime, setPickupTime] = useState<string>('Lấy ngay (~5 - 8 phút)');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORES[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('128 Nguyễn Đình Chiểu, P. Võ Thị Sáu, Q.3');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory>('all');
  const [creatorRef, setCreatorRef] = useState<string | null>(null);

  const handleSetOrderType = (type: 'pickup' | 'delivery') => {
    setOrderType(type);
    if (type === 'pickup' && pickupTime.includes('Giao ngay')) {
      setPickupTime('Lấy ngay (~5 - 8 phút)');
    } else if (type === 'delivery' && pickupTime.includes('Lấy ngay')) {
      setPickupTime('Giao ngay (~15 - 20 phút)');
    }
  };

  // Admin / Store Owner state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Preload store sync configuration (Google Sheets Webhook & Telegram)
  useEffect(() => {
    getStoreSyncConfig().catch(() => {});
  }, []);

  // Modals
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isSeoShareOpen, setIsSeoShareOpen] = useState(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.menuItemId === newItem.menuItemId &&
          it.size === newItem.size &&
          it.temperature === newItem.temperature &&
          it.sugarLevel === newItem.sugarLevel &&
          it.iceLevel === newItem.iceLevel &&
          it.milkType === newItem.milkType &&
          JSON.stringify(it.toppings) === JSON.stringify(newItem.toppings)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    showToast(`Đã thêm "${newItem.name}" (${newItem.quantity} ly) vào giỏ!`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Đã xóa món khỏi giỏ hàng.');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (customizedItem: CartItem) => {
    handleAddToCart(customizedItem);
    setCustomizingItem(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCurrentOrder(order);
    setCartItems([]); // clear cart
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(true);
    showToast(`Đặt hàng thành công! Mã đơn của bạn: ${order.code}`);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Check admin session on mount & Sync scroll & state with URL pathname & Creator query param
  useEffect(() => {
    const savedAuth = safeStorage.getItem('go_coffee_admin_session');
    if (savedAuth === 'active') {
      setIsAdminLoggedIn(true);
    }

    // Creator / Referral tracking from URL (?ref=... / ?creator=...)
    const ref = getCreatorRefFromUrl();
    if (ref) {
      setCreatorRef(ref);
      setIsComboModalOpen(true);
      trackConversion('view_combo_page', { creatorRef: ref, source: 'creator_url_param' }, ref);
    }

    const handleUrlRoute = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;

      if (path === '/thuc-don' || path === '/menu') {
        setTimeout(() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (path === '/cau-chuyen') {
        setTimeout(() => {
          const el = document.getElementById('story');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (path === '/cua-hang' || path === '/diem-ban') {
        setTimeout(() => {
          const el = document.getElementById('stores');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (path === '/bo-ca-phe-banh' || path === '/combo' || path === '/signature') {
        setIsComboModalOpen(true);
      } else if (path === '/gop-y-bao-bi' || path === '/feedback') {
        setIsFeedbackModalOpen(true);
      } else if (path === '/uu-dai' || path === '/khuyen-mai') {
        setSelectedCategory('combo');
        setTimeout(() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (path === '/gio-hang') {
        setIsCartOpen(true);
      } else if (path === '/theo-doi-don' || path === '/don-hang' || path === '/order') {
        setIsOrderTrackerOpen(true);
      } else if (path === '/drive' || path === '/google-drive') {
        setIsGoogleDriveOpen(true);
      } else if (path === '/admin' || path === '/quan-tri' || path === '/owner') {
        setIsAdminModalOpen(true);
      }
    };

    // Preload latest order from storage if customer previously ordered
    try {
      const localOrdersStr = safeStorage.getItem('go_coffee_local_orders');
      if (localOrdersStr) {
        const parsed = JSON.parse(localOrdersStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCurrentOrder(parsed[0]);
        }
      }
    } catch (e) {}

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const scrollToMenu = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/thuc-don');
    }
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStores = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/cua-hang');
    }
    const el = document.getElementById('stores');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetHome = () => {
    setSelectedCategory('all');
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(false);
    setIsSeoShareOpen(false);
    setIsGoogleDriveOpen(false);
    setIsChatbotOpen(false);
    setIsComboModalOpen(false);
    setIsFeedbackModalOpen(false);
    setCustomizingItem(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#f7f2e7] text-[#2b1d14] flex flex-col relative selection:bg-[#801419] selection:text-amber-100 pb-16 md:pb-0">
      {/* Toast Notification in Vintage Seal Style */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#23150d] text-amber-100 px-4 py-3 rounded-sm shadow-xl border-2 border-[#d4af37] text-xs sm:text-sm font-serif font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Status Bar (Only shown to Store Owner when authenticated) */}
      {isAdminLoggedIn && (
        <div className="bg-stone-900 border-b border-amber-500/40 text-stone-200 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-300">👑 Chế Độ Chủ Quán GO.COFFEE</span>
            <span className="hidden md:inline text-stone-400">• Đang hoạt động riêng tư</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
            >
              Bảng Quản Trị & Google Sheet
            </button>
            <button
              onClick={() => {
                safeStorage.removeItem('go_coffee_admin_session');
                setIsAdminLoggedIn(false);
                showToast('Đã đăng xuất, chuyển về chế độ khách hàng thông thường.');
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSeoShare={() => setIsSeoShareOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        selectedStore={selectedStore}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
        }}
        onResetHome={handleResetHome}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
      />

      {/* Main flow: Hero -> PackagingGuide -> MenuSection -> StoreLocator -> StorySection */}
      <main className="flex-1">
        {/* 1. Màn hình đầu trang: Big Idea "Chấm một miếng bánh, nhớ một thời" + Sản phẩm chủ lực nắp ly */}
        <Hero
          onOrderNow={scrollToMenu}
          onOpenComboModal={() => setIsComboModalOpen(true)}
          onOpenStoreLocator={scrollToStores}
          onCustomizeItem={(item) => setCustomizingItem(item)}
          onOpenSeoShare={() => setIsSeoShareOpen(true)}
          onOpenChatbot={() => setIsChatbotOpen(true)}
        />

        {/* 2. Hướng dẫn tháo hộp & thưởng thức bánh chấm cà phê trong 3 bước */}
        <PackagingGuide
          onOpenComboModal={() => setIsComboModalOpen(true)}
          onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        />

        {/* 3. Menu & Bảng giá sản phẩm */}
        <MenuSection
          onSelectItem={(item) => setCustomizingItem(item)}
          onBuyNowItem={(item) => {
            // Instant purchase from Menu card
            const cartItem: CartItem = {
              id: `cart-${item.id}-${Date.now()}`,
              menuItemId: item.id,
              name: item.name,
              size: 'M',
              temperature: item.temperature === 'hot' ? 'hot' : 'cold',
              sugarLevel: '70%',
              iceLevel: item.temperature === 'hot' ? '0%' : '70%',
              milkType: 'standard',
              toppings: [],
              quantity: 1,
              unitPrice: item.price,
              totalPrice: item.price,
              specialInstructions: '',
              image: item.image,
            };
            handleBuyNow(cartItem);
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Thông tin điểm bán: Takeaway Booth 120 Pasteur (Dự kiến) */}
        <StoreLocator
          selectedStore={selectedStore}
          onSelectStore={(store) => {
            setSelectedStore(store);
            showToast(`Đã chuyển điểm nhận cà phê: ${store.name}`);
          }}
          onOrderNow={scrollToMenu}
        />

        {/* 5. Câu chuyện thương hiệu: Một chút Sài Gòn xưa */}
        <StorySection />
      </main>

      {/* Footer */}
      <Footer 
        onOpenSeoShare={() => setIsSeoShareOpen(true)} 
        onResetHome={handleResetHome}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
      />

      {/* Dedicated Native-feel Mobile Bottom Navigation Bar (Phone-optimized) */}
      <MobileBottomNav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToMenu={scrollToMenu}
        onScrollToStores={scrollToStores}
        onGoHome={handleResetHome}
      />

      {/* Product Customization Modal */}
      <ProductModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        orderType={orderType}
        setOrderType={handleSetOrderType}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        appliedVoucher={appliedVoucher}
        setAppliedVoucher={setAppliedVoucher}
        onProceedToCheckout={handleProceedToCheckout}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={orderType}
        selectedStore={selectedStore}
        deliveryAddress={deliveryAddress}
        appliedVoucher={appliedVoucher}
        onOrderSuccess={handleOrderSuccess}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        order={currentOrder}
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        onOrderUpdated={(updated) => setCurrentOrder(updated)}
      />

      {/* Social Share & SEO Modal */}
      <SeoShareModal
        isOpen={isSeoShareOpen}
        onClose={() => setIsSeoShareOpen(false)}
      />

      {/* Campaign Dedicated Modal for Ads & Creators */}
      <SignatureComboModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        creatorRef={creatorRef}
      />

      {/* Packaging & Firmness Feedback Modal */}
      <PackagingFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Barista AI Chatbot Widget */}
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen((prev) => !prev)}
        onScrollToMenu={scrollToMenu}
      />

      {/* Google Drive Workspace Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveOpen}
        onClose={() => {
          setIsGoogleDriveOpen(false);
          if (typeof window !== 'undefined' && (window.location.pathname === '/drive' || window.location.pathname === '/google-drive')) {
            window.history.pushState(null, '', '/');
          }
        }}
      />

      {/* Store Owner / Admin Dedicated Portal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setIsAdminLoggedIn(safeStorage.getItem('go_coffee_admin_session') === 'active');
          if (typeof window !== 'undefined') {
            if (window.location.pathname === '/admin' || window.location.pathname === '/quan-tri') {
              window.history.pushState(null, '', '/');
            }
          }
        }}
        onSwitchToCustomerView={() => {
          setIsAdminModalOpen(false);
        }}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
      />
    </div>
  );
}

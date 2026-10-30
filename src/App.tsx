/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { StorySection } from './components/StorySection';
import { StoreLocator } from './components/StoreLocator';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SeoShareModal } from './components/SeoShareModal';
import { TableBookingModal } from './components/TableBookingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { STORES } from './data/coffeeData';
import { CartItem, MenuItem, Order, StoreLocation, Voucher, TableReservation, CoffeeCategory } from './types/coffee';
import { ShoppingBag, CheckCircle, Sparkles, ArrowUp } from 'lucide-react';
import { getStoreSyncConfig } from './services/bookingSync';

export default function App() {
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORES[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('128 Nguyễn Đình Chiểu, P. Võ Thị Sáu, Q.3');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory>('all');

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
  const [isTableBookingOpen, setIsTableBookingOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const openBookingModal = () => {
    setIsTableBookingOpen(true);
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // Check if identical item (same id, size, temp, sugar, ice, milk, toppings) exists
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

  const handleOrderSuccess = (order: Order) => {
    setCurrentOrder(order);
    setCartItems([]); // clear cart
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(true);
    showToast(`Đặt hàng thành công! Mã đơn của bạn: ${order.code}`);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Check admin session on mount & Sync scroll & state with URL pathname
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('go_coffee_admin_session');
      if (savedAuth === 'active') {
        setIsAdminLoggedIn(true);
      }
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
      } else if (path === '/cua-hang') {
        setTimeout(() => {
          const el = document.getElementById('stores');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (path === '/uu-dai' || path === '/khuyen-mai') {
        setSelectedCategory('combo');
        setTimeout(() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (path === '/dat-ban') {
        setIsTableBookingOpen(true);
      } else if (path === '/gio-hang') {
        setIsCartOpen(true);
      } else if (path === '/admin' || path === '/quan-tri' || path === '/owner') {
        setIsAdminModalOpen(true);
      }
    };

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

  const handleResetHome = () => {
    setSelectedCategory('all');
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsTableBookingOpen(false);
    setIsOrderTrackerOpen(false);
    setIsSeoShareOpen(false);
    setIsChatbotOpen(false);
    setCustomizingItem(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#faf7f2] flex flex-col relative selection:bg-amber-800 selection:text-white pb-16 md:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-amber-600/40 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Status Bar (Only shown to Store Owner when authenticated) */}
      {isAdminLoggedIn && (
        <div className="bg-stone-900 border-b border-amber-500/40 text-stone-200 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-300">👑 Chế Độ Chủ Quán</span>
            <span className="hidden md:inline text-stone-400">• Đang hoạt động riêng tư (Khách hàng không nhìn thấy dữ liệu kỹ thuật)</span>
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
                localStorage.removeItem('go_coffee_admin_session');
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
        onOpenTableBooking={openBookingModal}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        selectedStore={selectedStore}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
        }}
        onResetHome={handleResetHome}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onOrderNow={scrollToMenu}
          onCustomizeItem={(item) => setCustomizingItem(item)}
          onOpenSeoShare={() => setIsSeoShareOpen(true)}
          onOpenTableBooking={() => setIsTableBookingOpen(true)}
          onOpenChatbot={() => setIsChatbotOpen(true)}
        />

        {/* Menu Section */}
        <MenuSection
          onSelectItem={(item) => setCustomizingItem(item)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Story Section */}
        <StorySection />

        {/* Store Locator */}
        <StoreLocator
          selectedStore={selectedStore}
          onSelectStore={(store) => {
            setSelectedStore(store);
            showToast(`Đã chuyển điểm nhận cà phê: ${store.name}`);
          }}
          onOpenTableBooking={(store) => {
            if (store) setSelectedStore(store);
            setIsTableBookingOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer 
        onOpenSeoShare={() => setIsSeoShareOpen(true)} 
        onResetHome={handleResetHome}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Dedicated Native-feel Mobile Bottom Navigation Bar (Phone-optimized) */}
      <MobileBottomNav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTableBooking={openBookingModal}
        onScrollToMenu={scrollToMenu}
        onScrollToStores={() => {
          const el = document.getElementById('stores');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoHome={handleResetHome}
      />

      {/* Modals */}
      <ProductModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        orderType={orderType}
        setOrderType={setOrderType}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        appliedVoucher={appliedVoucher}
        setAppliedVoucher={setAppliedVoucher}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={orderType}
        selectedStore={selectedStore}
        deliveryAddress={deliveryAddress}
        appliedVoucher={appliedVoucher}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        order={currentOrder}
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      <SeoShareModal
        isOpen={isSeoShareOpen}
        onClose={() => setIsSeoShareOpen(false)}
      />

      {/* Table Reservation Customer Modal */}
      <TableBookingModal
        isOpen={isTableBookingOpen}
        onClose={() => {
          setIsTableBookingOpen(false);
          if (typeof window !== 'undefined' && window.location.pathname === '/dat-ban') {
            window.history.pushState(null, '', '/');
          }
        }}
        selectedStore={selectedStore}
        onBookingSuccess={(res) => showToast(`Đặt bàn thành công cho ${res.guestCount} khách! Mã vé: ${res.code}`)}
        onGoToMenu={scrollToMenu}
      />

      {/* Barista AI Chatbot Widget (Gemini 3.8 Flash) */}
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen((prev) => !prev)}
        onOpenTableBooking={() => setIsTableBookingOpen(true)}
        onScrollToMenu={scrollToMenu}
      />

      {/* Store Owner / Admin Dedicated Portal (PIN-protected, completely hidden from customers) */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          if (typeof window !== 'undefined') {
            setIsAdminLoggedIn(localStorage.getItem('go_coffee_admin_session') === 'active');
            if (window.location.pathname === '/admin' || window.location.pathname === '/quan-tri') {
              window.history.pushState(null, '', '/');
            }
          }
        }}
        onSwitchToCustomerView={() => {
          setIsAdminModalOpen(false);
        }}
      />
    </div>
  );
}

export type CoffeeCategory = 
  | 'all'
  | 'phin'
  | 'phindi'
  | 'freeze'
  | 'tea'
  | 'pastry'
  | 'combo'
  | 'traditional'
  | 'espresso'
  | 'coldbrew';

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  vietnameseName?: string;
  category: CoffeeCategory;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isSignature?: boolean;
  isBestSeller?: boolean;
  calories?: number;
  temperature?: 'both' | 'cold' | 'hot';
  tags: string[];
}

export interface CartItem {
  id: string; // unique item uuid in cart
  menuItemId: string;
  name: string;
  image: string;
  basePrice: number;
  totalPrice: number;
  size: 'S' | 'M' | 'L';
  temperature: 'cold' | 'hot';
  sugarLevel: '0%' | '30%' | '50%' | '100%';
  iceLevel: '0%' | '50%' | '100%';
  milkType: 'standard' | 'oat' | 'almond' | 'sweetened_condensed';
  toppings: Topping[];
  quantity: number;
  specialInstructions?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  distance: string;
  estimatedPickupMinutes: number;
  phone: string;
  hours: string;
  isOpen: boolean;
}

export type PaymentMethodType = 'vietqr' | 'momo' | 'zalopay' | 'applepay' | 'card' | 'cash';

export interface Order {
  id: string;
  code: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  orderType: 'pickup' | 'delivery';
  store?: StoreLocation;
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid';
  status: 'received' | 'brewing' | 'ready' | 'completed';
  createdAt: string;
  estimatedReadyTime: string;
}

export interface Voucher {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  description: string;
}

export interface TableReservation {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  store: StoreLocation;
  seatingArea: string;
  note?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}


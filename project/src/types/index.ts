export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: string[];
  sizes: string[];
  badge?: 'new' | 'trending' | 'limited' | 'soldout';
  inStock: boolean;
  stockCount?: number;
  description: string;
  specifications: Record<string, string>;
  tags: string[];
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  loyaltyPoints: number;
  joinedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export type OrderStatus =
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  createdAt: Date;
  verified: boolean;
}

export interface FilterState {
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  categories: string[];
  genders: string[];
  availability: string;
  badge: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export type ThemeMode = 'light' | 'dark';

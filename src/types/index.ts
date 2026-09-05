export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string; // e.g., '28', '30', '32', '34', '36' or 'M', 'L', 'XL'
  color: string;
  colorCode: string; // hex or color indicator
  stockQuantity: number;
  salePrice?: number;
}

export interface SizeMeasurement {
  size: string;
  waist?: string;
  chest?: string;
  length?: string;
  shoulder?: string;
  sleeve?: string;
  thigh?: string;
  legOpening?: string;
}

export interface SizeChart {
  id: string;
  name: string;
  category: string;
  columns: string[];
  rows: SizeMeasurement[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  sizePurchased: string;
  fitFeedback?: 'Runs small' | 'True to size' | 'Runs large' | string;
  customerPhoto?: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  sku: string;
  category: 'jeans' | 'shirts' | 't-shirts' | 'polo' | 'casual-wear' | 'winter-wear';
  categoryLabel: string;
  brand: string;
  fabric: string;
  fit: string;
  price: number;
  salePrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive: boolean;
  description: string;
  descriptionBn?: string;
  careInstructions: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  sizeChartId: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
}

export interface OrderTimelineEvent {
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. '#ONE-10842'
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: {
    district: string;
    area: string;
    fullAddress: string;
    deliveryNote?: string;
  };
  deliveryZone: 'inside_dhaka' | 'outside_dhaka' | 'express';
  deliveryFee: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'pending' | 'verified' | 'paid';
  transactionId?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: OrderItemSnapshot[];
  timeline: OrderTimelineEvent[];
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: string;
  estimatedDelivery: string;
  courierTracking?: {
    courierName: string;
    trackingCode: string;
    currentHub: string;
    phone: string;
  };
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  discountAmount: number;
  code: string;
  minOrder: number;
}

export interface LoyaltyHistoryItem {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus';
  points: number;
  description: string;
  date: string;
}

export interface LoyaltyProfile {
  points: number;
  tier: 'Member' | 'Silver' | 'Gold' | 'Black Tier' | string;
  totalSpent: number;
  ordersCount: number;
  memberSince: string;
  history: LoyaltyHistoryItem[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 10 for 10% or 100 for 100 BDT
  minSpend: number;
  description: string;
}

export interface DeliveryZoneOption {
  id: 'inside_dhaka' | 'outside_dhaka' | 'express';
  name: string;
  fee: number;
  duration: string;
}

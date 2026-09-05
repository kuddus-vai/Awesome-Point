import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  Order,
  LoyaltyProfile,
  Coupon,
  OrderItemSnapshot,
  OrderTimelineEvent,
  LoyaltyReward,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_LOYALTY,
  AVAILABLE_COUPONS,
  INITIAL_SIZE_CHARTS,
} from '../data/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  loyalty: LoyaltyProfile;
  coupons: Coupon[];
  viewMode: 'store' | 'admin' | 'tracking' | 'account';
  setViewMode: (mode: 'store' | 'admin' | 'tracking' | 'account') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  activeSizeGuideId: string;
  setActiveSizeGuideId: (id: string) => void;
  isLoyaltyOpen: boolean;
  setIsLoyaltyOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  toasts: ToastInfo[];
  toast: string | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Cart operations
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string; coupon?: Coupon };
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: { district: string; area: string; fullAddress: string; deliveryNote?: string };
    deliveryZone: 'inside_dhaka' | 'outside_dhaka' | 'express';
    deliveryFee: number;
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
    transactionId?: string;
    appliedCoupon?: Coupon | null;
    discountAmount: number;
    useLoyaltyPoints?: number;
  }) => Order;
  findOrder: (query: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: Order['status'], note?: string) => void;

  // Admin Inventory & Product actions
  updateVariantStock: (productId: string, variantId: string, newStock: number) => void;
  addNewProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Loyalty actions
  redeemLoyaltyReward: (reward: LoyaltyReward) => { success: boolean; couponCode?: string; message: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State Hydration with LocalStorage & Self-Healing Image / Language Migration
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('one_outfit_products_v3');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const productMap = new Map(parsed.map((p) => [p.id, p]));
        INITIAL_PRODUCTS.forEach((ip) => {
          if (!productMap.has(ip.id)) {
            productMap.set(ip.id, ip);
          } else {
            // Update with latest metadata if needed
            const existing = productMap.get(ip.id)!;
            productMap.set(ip.id, {
              ...existing,
              name: ip.name,
              nameBn: ip.nameBn,
              categoryLabel: ip.categoryLabel,
              fabric: ip.fabric,
              fit: ip.fit,
              description: ip.description,
              descriptionBn: ip.descriptionBn,
              price: ip.price,
              salePrice: ip.salePrice,
              images: ip.images,
            });
          }
        });
        return Array.from(productMap.values());
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('one_outfit_products_v3', JSON.stringify(products));
    } catch {}
  }, [products]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('one_outfit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('one_outfit_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('one_outfit_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map((o) => ({
          ...o,
          items: o.items.map((item) => {
            if (item.imageUrl.includes('photo-1625910513413-5626a575a7b6')) {
              return {
                ...item,
                imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=400&auto=format&fit=crop',
              };
            }
            return item;
          }),
        }));
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [loyalty, setLoyalty] = useState<LoyaltyProfile>(() => {
    try {
      const saved = localStorage.getItem('one_outfit_loyalty');
      return saved ? JSON.parse(saved) : INITIAL_LOYALTY;
    } catch {
      return INITIAL_LOYALTY;
    }
  });

  const [coupons] = useState<Coupon[]>(AVAILABLE_COUPONS);

  // UI state
  const [viewMode, setViewMode] = useState<'store' | 'admin' | 'tracking' | 'account'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [activeSizeGuideId, setActiveSizeGuideId] = useState<string>('jeans-chart');
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('one_outfit_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('one_outfit_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('one_outfit_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('one_outfit_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('one_outfit_loyalty', JSON.stringify(loyalty));
    } catch {}
  }, [loyalty]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1): boolean => {
    // Check available stock in product list
    const currentProduct = products.find((p) => p.id === product.id) || product;
    const currentVariant = currentProduct.variants.find((v) => v.id === variant.id) || variant;

    if (currentVariant.stockQuantity <= 0) {
      showToast(`সাইজ ${currentVariant.size} বর্তমানে স্টক শেষ।`, 'error');
      return false;
    }

    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.variant.id === variant.id
    );

    const currentInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    if (currentInCart + quantity > currentVariant.stockQuantity) {
      showToast(
        `সাইজ ${currentVariant.size}-এ মাত্র ${currentVariant.stockQuantity}টি পণ্য স্টকে রয়েছে।`,
        'error'
      );
      return false;
    }

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        variant,
        quantity,
        addedAt: new Date().toISOString(),
      };
      setCart((prev) => [newItem, ...prev]);
    }

    showToast(`ব্যাগে যোগ হয়েছে: ${product.nameBn || product.name} (সাইজ: ${variant.size})`, 'success');
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('ব্যাগ থেকে পণ্যটি সরানো হয়েছে', 'info');
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          // Validate stock
          const prod = products.find((p) => p.id === item.product.id);
          const variant = prod?.variants.find((v) => v.id === item.variant.id);
          const maxStock = variant ? variant.stockQuantity : item.variant.stockQuantity;

          if (newQty > maxStock) {
            showToast(`সাইজ ${item.variant.size}-এ সর্বোচ্চ ${maxStock}টি স্টকে রয়েছে`, 'error');
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const unitPrice = item.variant.salePrice ?? item.product.salePrice ?? item.product.price;
    return total + unitPrice * item.quantity;
  }, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('উইশলিস্ট থেকে সরানো হয়েছে', 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('পছন্দের তালিকায় যুক্ত হয়েছে', 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon check
  const applyCoupon = (code: string, subtotal: number) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);

    if (!found) {
      return { valid: false, discount: 0, message: 'ভুল কুপন কোড। অনুগ্রহ করে সঠিক কোড লিখুন।' };
    }

    if (subtotal < found.minSpend) {
      return {
        valid: false,
        discount: 0,
        message: `${found.code} কুপনের জন্য সর্বনিম্ন ৳${found.minSpend.toLocaleString()} টাকার অর্ডার প্রয়োজন।`,
      };
    }

    let discount = 0;
    if (found.discountType === 'percentage') {
      discount = Math.round((subtotal * found.value) / 100);
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    } else if (found.discountType === 'fixed') {
      discount = found.value;
    } else if (found.discountType === 'free_shipping') {
      discount = found.value; // typically ৳80 or ৳150
    }

    return {
      valid: true,
      discount,
      message: `কুপন ${found.code} সক্রিয় হয়েছে! ৳${discount} টাকা ছাড় পেয়েছেন।`,
      coupon: found,
    };
  };

  // Place Order with Variant-level Inventory Deduction
  const placeOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: { district: string; area: string; fullAddress: string; deliveryNote?: string };
    deliveryZone: 'inside_dhaka' | 'outside_dhaka' | 'express';
    deliveryFee: number;
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
    transactionId?: string;
    appliedCoupon?: Coupon | null;
    discountAmount: number;
    useLoyaltyPoints?: number;
  }): Order => {
    const orderNumber = `#AP-${Math.floor(10000 + Math.random() * 90000)}`;

    const items: OrderItemSnapshot[] = cart.map((item) => {
      const unitPrice = item.variant.salePrice ?? item.product.salePrice ?? item.product.price;
      return {
        productId: item.product.id,
        productName: item.product.name,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        unitPrice,
        quantity: item.quantity,
        totalPrice: unitPrice * item.quantity,
        imageUrl: item.product.images[0]?.url || '',
      };
    });

    const subtotal = cartSubtotal;
    const finalTotal = Math.max(0, subtotal - orderData.discountAmount + orderData.deliveryFee);

    // Points earned: 1 point per ৳10 of final total
    const pointsEarned = Math.floor(finalTotal / 10);
    const pointsUsed = orderData.useLoyaltyPoints || 0;

    const timeline: OrderTimelineEvent[] = [
      {
        status: 'pending',
        title: 'অর্ডার গৃহীত হয়েছে',
        description: `অর্ডার ${orderNumber} গ্রহণ করা হয়েছে (${orderData.paymentMethod.toUpperCase()})।`,
        timestamp: 'এইমাত্র',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'অর্ডার কনফার্মেশন',
        description: 'স্টক ও শিপিং তথ্য যাচাই করা হচ্ছে।',
        timestamp: '১ ঘণ্টার মধ্যে',
        completed: orderData.paymentMethod !== 'cod',
      },
      {
        status: 'packed',
        title: 'প্যাকেজিং ও কোয়ালিটি চেক',
        description: 'অসাম পয়েন্ট প্রিমিয়াম প্যাকেজিং প্রস্তুত হচ্ছে।',
        timestamp: 'প্রক্রিয়াধীন',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'কুরিয়ারে হস্তান্তর',
        description: 'স্টিভফাস্ট / পাঠাও কুরিয়ারে বুকিং সম্পন্ন।',
        timestamp: 'সম্ভাব্য কালকে',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'হোম ডেলিভারি',
        description: 'আপনার ঠিকানায় পার্সেল পৌঁছে দেওয়া হবে।',
        timestamp:
          orderData.deliveryZone === 'express'
            ? 'আজকের মধ্যেই (একই দিনে ঢাকা)'
            : orderData.deliveryZone === 'inside_dhaka'
            ? 'আগামীকাল'
            : '২–৩ কার্যদিবস',
        completed: false,
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      deliveryZone: orderData.deliveryZone,
      deliveryFee: orderData.deliveryFee,
      subtotal,
      discount: orderData.discountAmount,
      couponCode: orderData.appliedCoupon?.code,
      total: finalTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'verified',
      transactionId: orderData.transactionId,
      status: 'pending',
      items,
      timeline,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsUsed: pointsUsed,
      createdAt: new Date().toISOString(),
      estimatedDelivery:
        orderData.deliveryZone === 'express'
          ? 'আজকের মধ্যে'
          : orderData.deliveryZone === 'inside_dhaka'
          ? 'আগামীকাল'
          : '২–৩ কার্যদিবস',
      courierTracking: {
        courierName: 'Steadfast Courier',
        trackingCode: `STDF-${Math.floor(1000000 + Math.random() * 9000000)}`,
        currentHub: 'ঢাকা সেন্ট্রাল হাব — তেজগাঁও সর্টিং সেন্টার',
        phone: '০৯৬৭৮-০০০৯৯৯',
      },
    };

    // 1. DEDUCT VARIANT STOCK!
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const cartItemsForThisProd = cart.filter((ci) => ci.product.id === prod.id);
        if (cartItemsForThisProd.length === 0) return prod;

        const updatedVariants = prod.variants.map((v) => {
          const matchCartItem = cartItemsForThisProd.find((ci) => ci.variant.id === v.id);
          if (matchCartItem) {
            return {
              ...v,
              stockQuantity: Math.max(0, v.stockQuantity - matchCartItem.quantity),
            };
          }
          return v;
        });

        return { ...prod, variants: updatedVariants };
      })
    );

    // 2. Add to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Update Loyalty
    setLoyalty((prev) => {
      const netPoints = Math.max(0, prev.points - pointsUsed) + pointsEarned;
      const newTotalSpent = prev.totalSpent + finalTotal;
      const newOrdersCount = prev.ordersCount + 1;

      // Tier calculation
      let tier: LoyaltyProfile['tier'] = 'Member';
      if (newTotalSpent > 10000 || newOrdersCount >= 8) tier = 'Black Tier';
      else if (newTotalSpent > 5000 || newOrdersCount >= 4) tier = 'Gold';
      else if (newTotalSpent > 2000 || newOrdersCount >= 2) tier = 'Silver';

      const newHistory = [
        {
          id: `lh-${Date.now()}-earn`,
          type: 'earned' as const,
          points: pointsEarned,
          description: `অর্ডার ${orderNumber} থেকে অর্জিত পয়েন্ট`,
          date: 'এইমাত্র',
        },
        ...(pointsUsed > 0
          ? [
              {
                id: `lh-${Date.now()}-redeem`,
                type: 'redeemed' as const,
                points: pointsUsed,
                description: `অর্ডার ${orderNumber}-এ ব্যবহৃত পয়েন্ট`,
                date: 'এইমাত্র',
              },
            ]
          : []),
        ...prev.history,
      ];

      return {
        ...prev,
        points: netPoints,
        totalSpent: newTotalSpent,
        ordersCount: newOrdersCount,
        tier,
        history: newHistory,
      };
    });

    // 4. Clear cart
    clearCart();
    showToast(`অর্ডার ${orderNumber} সফলভাবে গ্রহণ করা হয়েছে! অর্জিত ক্লাব পয়েন্ট: ${pointsEarned}।`, 'success');
    return newOrder;
  };

  // Find order by order number or phone
  const findOrder = (query: string): Order | undefined => {
    const q = query.trim().toLowerCase().replace('#', '');
    return orders.find(
      (ord) =>
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerPhone.replace(/[\s-]/g, '').includes(q) ||
        ord.courierTracking?.trackingCode.toLowerCase().includes(q)
    );
  };

  // Update order status (Admin)
  const updateOrderStatus = (orderId: string, newStatus: Order['status'], note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((evt) => {
            if (evt.status === newStatus) {
              return { ...evt, completed: true, timestamp: 'এইমাত্র আপডেট করা হয়েছে' };
            }
            return evt;
          });

          // Check if newly marked delivered or cancelled
          const wasCancelled = ord.status !== 'cancelled' && newStatus === 'cancelled';
          if (wasCancelled) {
            // Restore variant stock
            setProducts((prodList) =>
              prodList.map((prod) => {
                const orderItemsForProd = ord.items.filter((i) => i.productId === prod.id);
                if (orderItemsForProd.length === 0) return prod;
                return {
                  ...prod,
                  variants: prod.variants.map((v) => {
                    const matchedItem = orderItemsForProd.find((i) => i.sku === v.sku);
                    if (matchedItem) {
                      return { ...v, stockQuantity: v.stockQuantity + matchedItem.quantity };
                    }
                    return v;
                  }),
                };
              })
            );
          }

          return {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
    showToast(`অর্ডার স্ট্যাটাস পরিবর্তন হয়েছে: ${newStatus.toUpperCase()}`, 'info');
  };

  // Admin inventory variant update
  const updateVariantStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            variants: prod.variants.map((v) => {
              if (v.id === variantId) {
                return { ...v, stockQuantity: Math.max(0, newStock) };
              }
              return v;
            }),
          };
        }
        return prod;
      })
    );
    showToast('ইনভেন্টরি স্টক সফলভাবে আপডেট করা হয়েছে', 'success');
  };

  // Admin Product updates
  const addNewProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    showToast(`নতুন পণ্য "${product.name}" যুক্ত হয়েছে`, 'success');
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    setSelectedProduct((prev) => (prev && prev.id === productId ? { ...prev, ...updates } : prev));
    setEditingProduct((prev) => (prev && prev.id === productId ? { ...prev, ...updates } : prev));
    showToast('পণ্য সফলভাবে আপডেট করা হয়েছে', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setSelectedProduct((prev) => (prev && prev.id === productId ? null : prev));
    setEditingProduct((prev) => (prev && prev.id === productId ? null : prev));
    showToast('পণ্যটি ক্যাটালগ থেকে মুছে ফেলা হয়েছে', 'info');
  };

  // Loyalty reward redemption
  const redeemLoyaltyReward = (reward: LoyaltyReward) => {
    if (loyalty.points < reward.pointsCost) {
      return {
        success: false,
        message: `এই রিওয়ার্ড পেতে ${reward.pointsCost} পয়েন্ট প্রয়োজন। আপনার আছে ${loyalty.points} পয়েন্ট।`,
      };
    }

    setLoyalty((prev) => ({
      ...prev,
      points: prev.points - reward.pointsCost,
      history: [
        {
          id: `lh-${Date.now()}`,
          type: 'redeemed',
          points: reward.pointsCost,
          description: `রিডিম করা হয়েছে: ${reward.title}`,
          date: 'এইমাত্র',
        },
        ...prev.history,
      ],
    }));

    showToast(`অভিনন্দন! চেকআউটে "${reward.code}" কোডটি ব্যবহার করে ৳${reward.discountAmount} ছাড় পান।`, 'success');
    return {
      success: true,
      couponCode: reward.code,
      message: `রিওয়ার্ড সফলভাবে রিডিম হয়েছে! পরবর্তী অর্ডারের জন্য কোড ${reward.code} সংরক্ষণ করুন।`,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        loyalty,
        coupons,
        viewMode,
        setViewMode,
        selectedProduct,
        setSelectedProduct,
        editingProduct,
        setEditingProduct,
        isCartOpen,
        setIsCartOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        activeSizeGuideId,
        setActiveSizeGuideId,
        isLoyaltyOpen,
        setIsLoyaltyOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        searchQuery,
        setSearchQuery,
        activeCategoryFilter,
        setActiveCategoryFilter,
        selectedCategory: activeCategoryFilter,
        setSelectedCategory: setActiveCategoryFilter,
        toasts,
        toast: toasts.length > 0 ? toasts[toasts.length - 1].message : null,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        placeOrder,
        findOrder,
        updateOrderStatus,
        updateVariantStock,
        addNewProduct,
        updateProduct,
        deleteProduct,
        redeemLoyaltyReward,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

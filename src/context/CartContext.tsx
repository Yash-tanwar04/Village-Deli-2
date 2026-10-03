import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, StoreSettings } from '../types';
import { api } from '../lib/api';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selected_variant?: ProductVariant) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  total: number;
  itemCount: number;
  deliveryPincode: string;
  setDeliveryPincode: (pin: string) => void;
  isPincodeServiceable: boolean;
  storeSettings: StoreSettings | null;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('villagedeli_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryPincode, setDeliveryPincode] = useState<string>(() => {
    return localStorage.getItem('villagedeli_pincode') || '122017';
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('villagedeli_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('villagedeli_pincode', deliveryPincode);
  }, [deliveryPincode]);

  useEffect(() => {
    api.getStoreSettings()
      .then(res => setStoreSettings(res))
      .catch(err => console.error('Failed to load store settings', err));
  }, []);

  const addToCart = (product: Product, quantity = 1, selected_variant?: ProductVariant) => {
    setItems(prev => {
      const matchIndex = prev.findIndex(item => {
        if (item.product.id !== product.id) return false;
        if (selected_variant || item.selected_variant) {
          return item.selected_variant?.id === selected_variant?.id;
        }
        return true;
      });

      const maxStock = selected_variant ? selected_variant.stock_quantity : product.stock_quantity;

      if (matchIndex > -1) {
        const existing = prev[matchIndex];
        const newQty = Math.min(maxStock, existing.quantity + quantity);
        const updated = [...prev];
        updated[matchIndex] = { ...existing, quantity: newQty, selected_variant };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: Math.min(maxStock, quantity),
          selected_variant
        }
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        const isMatch =
          item.product.id === productId &&
          (variantId ? item.selected_variant?.id === variantId : !item.selected_variant);
        if (isMatch) {
          const maxQty = item.selected_variant ? item.selected_variant.stock_quantity : item.product.stock_quantity;
          return { ...item, quantity: Math.min(maxQty, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems(prev =>
      prev.filter(item => {
        if (item.product.id !== productId) return true;
        if (variantId) {
          return item.selected_variant?.id !== variantId;
        }
        return false;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => {
    let price = item.product.discount_price !== null && item.product.discount_price !== undefined
      ? item.product.discount_price
      : item.product.price;
    if (item.selected_variant) {
      price = item.selected_variant.price;
    }
    return sum + price * item.quantity;
  }, 0);

  const freeDeliveryThreshold = storeSettings?.free_delivery_threshold || 500;
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : (storeSettings?.delivery_fee ?? 30);
  const total = subtotal + deliveryFee;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isPincodeServiceable = Boolean(
    !storeSettings?.serviceable_pincodes ||
    storeSettings.serviceable_pincodes.length === 0 ||
    storeSettings.serviceable_pincodes.includes(deliveryPincode.trim())
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold,
        total,
        itemCount,
        deliveryPincode,
        setDeliveryPincode,
        isPincodeServiceable,
        storeSettings,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        toggleCartDrawer: () => setIsCartDrawerOpen(prev => !prev)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  artistId: string;
  artistName: string;
  serviceType: 'home-visit' | 'digital';
  scheduledDate?: string;
  scheduledTime?: string;
  quantity: number;
  addOns: { id: string; name: string; price: number }[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateItem: (productId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotal: () => { subtotal: number; tax: number; total: number };
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kalakart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kalakart_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.productId === item.productId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateItem = (productId: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    const subtotal = items.reduce((sum, item) => {
      const addOnsTotal = item.addOns.reduce((a, addon) => a + addon.price, 0);
      return sum + (item.price + addOnsTotal) * item.quantity;
    }, 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    return { subtotal, tax, total: subtotal + tax };
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clearCart, getTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

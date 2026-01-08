import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import demoData from '@/data/demo-data.json';

export interface Order {
  id: string;
  transactionId: string;
  customerId: string;
  artistId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  serviceType: 'home-visit' | 'digital';
  scheduledDate: string | null;
  scheduledTime: string | null;
  status: 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';
  price: number;
  addOns: { name: string; price: number }[];
  tax: number;
  total: number;
  address: string;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getCustomerOrders: (customerId: string) => Order[];
  getArtistOrders: (artistId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kalakart_orders');
    if (saved) {
      return JSON.parse(saved);
    }
    return demoData.orders as Order[];
  });

  useEffect(() => {
    localStorage.setItem('kalakart_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getArtistOrders = (artistId: string) => {
    return orders.filter(order => order.artistId === artistId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getCustomerOrders, getArtistOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

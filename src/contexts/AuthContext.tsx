import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import demoData from '@/data/demo-data.json';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'artist';
  avatar: string;
  address?: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  // Artist specific fields
  bio?: string;
  verified?: boolean;
  rating?: number;
  totalOrders?: number;
  earnings?: number;
  pendingPayout?: number;
  languages?: string[];
  location?: string;
  sampleId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateEarnings: (amount: number) => void;
  requestPayout: () => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'customer' | 'artist';
  bio?: string;
  sampleId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('kalakart_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Demo authentication
    const customerData = demoData.users.customer;
    const artistData = demoData.users.artist;

    if (email === customerData.email && password === customerData.password) {
      const userData: User = {
        id: customerData.id,
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        role: 'customer',
        avatar: customerData.avatar,
        address: customerData.address,
      };
      setUser(userData);
      localStorage.setItem('kalakart_user', JSON.stringify(userData));
      return { success: true };
    }

    if (email === artistData.email && password === artistData.password) {
      const userData: User = {
        id: artistData.id,
        email: artistData.email,
        name: artistData.name,
        phone: artistData.phone,
        role: 'artist',
        avatar: artistData.avatar,
        bio: artistData.bio,
        verified: artistData.verified,
        rating: artistData.rating,
        totalOrders: artistData.totalOrders,
        earnings: artistData.earnings,
        pendingPayout: artistData.pendingPayout,
        languages: artistData.languages,
        location: artistData.location,
        sampleId: artistData.sampleId,
      };
      setUser(userData);
      localStorage.setItem('kalakart_user', JSON.stringify(userData));
      return { success: true };
    }

    // Check custom registered users
    const customUsers = JSON.parse(localStorage.getItem('kalakart_custom_users') || '[]');
    const customUser = customUsers.find((u: any) => u.email === email && u.password === password);
    if (customUser) {
      const { password: _, ...userData } = customUser;
      setUser(userData);
      localStorage.setItem('kalakart_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    const customUsers = JSON.parse(localStorage.getItem('kalakart_custom_users') || '[]');
    
    // Check if email already exists
    const emailExists = customUsers.some((u: any) => u.email === data.email) ||
      data.email === demoData.users.customer.email ||
      data.email === demoData.users.artist.email;

    if (emailExists) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      bio: data.bio || '',
      sampleId: data.sampleId || '',
      verified: false,
      rating: 0,
      totalOrders: 0,
      earnings: 0,
      pendingPayout: 0,
      languages: [],
      location: '',
    };

    customUsers.push(newUser);
    localStorage.setItem('kalakart_custom_users', JSON.stringify(customUsers));

    const { password: _, ...userData } = newUser;
    setUser(userData as User);
    localStorage.setItem('kalakart_user', JSON.stringify(userData));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kalakart_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('kalakart_user', JSON.stringify(updatedUser));
    }
  };

  const updateEarnings = (amount: number) => {
    if (user && user.role === 'artist') {
      const updatedUser = {
        ...user,
        earnings: (user.earnings || 0) + amount,
        pendingPayout: (user.pendingPayout || 0) + amount,
        totalOrders: (user.totalOrders || 0) + 1,
      };
      setUser(updatedUser);
      localStorage.setItem('kalakart_user', JSON.stringify(updatedUser));
    }
  };

  const requestPayout = () => {
    if (user && user.role === 'artist') {
      const updatedUser = {
        ...user,
        pendingPayout: 0,
      };
      setUser(updatedUser);
      localStorage.setItem('kalakart_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser, updateEarnings, requestPayout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

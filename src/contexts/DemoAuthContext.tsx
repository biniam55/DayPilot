'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Demo user for testing without Firebase
const DEMO_USER = {
  uid: 'demo-user-123',
  email: 'demo@daypilot.com',
  displayName: 'Demo User',
  emailVerified: true,
};

interface DemoUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: DemoUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (stored in localStorage)
    const storedUser = localStorage.getItem('demo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In demo mode, any email/password works
    const demoUser = {
      ...DEMO_USER,
      email,
      displayName: email.split('@')[0],
    };
    
    setUser(demoUser);
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
    router.push('/');
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoUser = {
      ...DEMO_USER,
      email,
      displayName,
    };
    
    setUser(demoUser);
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
    router.push('/');
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('demo-user');
    router.push('/login');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a DemoAuthProvider');
  }
  return context;
}

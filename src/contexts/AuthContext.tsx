'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let redirectChecked = false;

    const initAuth = async () => {
      try {
        // Set persistence
        await setPersistence(auth, browserLocalPersistence);
        
        // Try to get redirect result
        const result = await getRedirectResult(auth);
        redirectChecked = true;
        
        if (result?.user) {
          console.log('Google redirect successful:', result.user.email);
          // Don't navigate here, let onAuthStateChanged handle it
        } else {
          console.log('No redirect result');
        }
      } catch (error: any) {
        console.error('Redirect error:', error.code, error.message);
        redirectChecked = true;
      }
    };

    initAuth();

    // Listen to auth state - this is the source of truth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state:', currentUser ? currentUser.email : 'no user');
      
      setUser(currentUser);
      
      // Only set loading to false after redirect check is done
      if (redirectChecked) {
        setLoading(false);
        
        // If user just logged in via redirect, navigate to dashboard
        if (currentUser && window.location.pathname === '/login') {
          console.log('User logged in, navigating to dashboard');
          router.push('/');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('Starting Google redirect sign-in');
        await signInWithRedirect(auth, provider);
      } else {
        console.log('Starting Google popup sign-in');
        await signInWithPopup(auth, provider);
        router.push('/');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error.code, error.message);
      if (error.code === 'auth/cancelled-popup-request' || 
          error.code === 'auth/popup-closed-by-user') {
        return;
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
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
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

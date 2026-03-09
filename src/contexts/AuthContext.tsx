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
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;

    const initAuth = async () => {
      try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence);
        console.log('Auth persistence set to LOCAL');

        // Check for redirect result (for mobile Google Sign-In)
        console.log('Checking for Google redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          console.log('✓ Redirect successful, user:', result.user.email);
          if (mounted) {
            setUser(result.user);
            setLoading(false);
            setInitializing(false);
            // Navigate after state is set
            setTimeout(() => router.push('/'), 100);
          }
          return;
        } else {
          console.log('No redirect result found');
        }
      } catch (error: any) {
        console.error('Redirect error:', error.code, error.message);
      }

      // Listen to auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? user.email : 'no user');
        if (mounted) {
          setUser(user);
          setLoading(false);
          setInitializing(false);
        }
      });

      return () => {
        mounted = false;
        unsubscribe();
      };
    };

    initAuth();
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
      
      // Update profile with display name
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
      
      // Detect if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      console.log('Starting Google Sign-In, mobile:', isMobile);
      
      if (isMobile) {
        // Use redirect for mobile devices
        console.log('Using redirect method');
        await signInWithRedirect(auth, provider);
        // Page will navigate away, code after this won't execute
      } else {
        // Use popup for desktop
        console.log('Using popup method');
        const result = await signInWithPopup(auth, provider);
        console.log('Popup successful:', result.user.email);
        router.push('/');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error.code, error.message);
      // Don't throw error if user cancelled
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
    loading: loading || initializing,
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

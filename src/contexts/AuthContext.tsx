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
  updateProfile
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

    let redirectHandled = false;

    // Check for redirect result (for mobile Google Sign-In)
    const handleRedirectResult = async () => {
      try {
        console.log('[AuthContext] Checking for redirect result...');
        console.log('[AuthContext] Current URL:', window.location.href);
        console.log('[AuthContext] Auth flag:', localStorage.getItem('daypilot-auth-in-progress'));
        
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          console.log('[AuthContext] ✓ Google Sign-In redirect successful:', result.user.email);
          redirectHandled = true;
          // Clear auth in progress flag immediately
          localStorage.removeItem('daypilot-auth-in-progress');
          console.log('[AuthContext] Cleared auth flag, redirecting to dashboard...');
          // Wait a moment for auth state to settle, then redirect
          setTimeout(() => {
            router.push('/');
          }, 500);
        } else {
          console.log('[AuthContext] No redirect result found');
          // Check if we have a stale auth flag
          const authInProgress = localStorage.getItem('daypilot-auth-in-progress');
          if (authInProgress) {
            const timestamp = parseInt(authInProgress);
            const now = Date.now();
            const age = now - timestamp;
            console.log(`[AuthContext] Auth flag age: ${age}ms`);
            // If flag is older than 30 seconds, it's stale
            if (age > 30000) {
              console.log('[AuthContext] Clearing stale auth flag (>30s old)');
              localStorage.removeItem('daypilot-auth-in-progress');
            } else {
              console.log('[AuthContext] Auth in progress flag exists, waiting for redirect...');
            }
          }
        }
      } catch (error: any) {
        console.error('[AuthContext] Redirect sign-in error:', error);
        // Clear auth in progress flag on error
        localStorage.removeItem('daypilot-auth-in-progress');
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[AuthContext] Auth state changed:', user ? user.email : 'no user');
      setUser(user);
      setLoading(false);
      
      // Clear auth in progress flag when user is authenticated
      if (user) {
        console.log('[AuthContext] User authenticated, clearing auth flag');
        localStorage.removeItem('daypilot-auth-in-progress');
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
      // Add prompt to always show account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Detect if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('Using redirect for mobile Google Sign-In');
        // Use redirect for mobile devices
        await signInWithRedirect(auth, provider);
        // Note: redirect will navigate away, so code after this won't execute
      } else {
        console.log('Using popup for desktop Google Sign-In');
        // Use popup for desktop
        const result = await signInWithPopup(auth, provider);
        console.log('Popup sign-in successful:', result.user.email);
        // Clear auth flag immediately on desktop success
        localStorage.removeItem('daypilot-auth-in-progress');
        router.push('/');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error.code, error.message);
      // Clear auth flag on error
      localStorage.removeItem('daypilot-auth-in-progress');
      // Don't throw error if user cancelled (this is expected behavior)
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
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

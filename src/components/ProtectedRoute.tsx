'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!loading) {
      // Add small delay to ensure redirect result is processed
      const timer = setTimeout(() => {
        setCheckComplete(true);
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  // Show loading while auth is initializing or checking
  if (loading || !checkComplete) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r bg-card hidden md:block p-4 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

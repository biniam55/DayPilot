"use client"

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Set initial state
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Don't render on server
  if (!isMounted) {
    return null;
  }

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      {!isOnline ? (
        <Alert variant="destructive" className="border-2">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="text-xs">
            You're offline. Don't worry - your data is saved locally and will sync when you're back online.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-2 border-green-500 bg-green-50 dark:bg-green-950">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-xs text-green-600 dark:text-green-400">
            You're back online!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

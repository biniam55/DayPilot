'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdateTestButton() {
  const testUpdate = () => {
    // Simulate an old version in localStorage
    localStorage.setItem('app-version', '1.0.0');
    alert('Test setup complete! Refresh the page to see the update notification.');
  };

  const clearVersion = () => {
    localStorage.removeItem('app-version');
    localStorage.removeItem('last-version-check');
    alert('Version data cleared! Refresh to reset.');
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={testUpdate}
        className="shadow-lg"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Test Update
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={clearVersion}
        className="shadow-lg"
      >
        Clear Version
      </Button>
    </div>
  );
}

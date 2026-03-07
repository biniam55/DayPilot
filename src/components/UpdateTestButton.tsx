'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdateTestButton() {
  const testUpdate = () => {
    // Simulate an old version to trigger update notification
    localStorage.setItem('app-version', '1.0.0');
    window.location.reload();
  };

  const clearVersion = () => {
    localStorage.removeItem('app-version');
    localStorage.removeItem('dismissed-version');
    alert('Version data cleared. Reload to test fresh state.');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
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

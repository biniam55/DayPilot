import { useState, useEffect } from 'react';

const APP_VERSION = '1.0.1'; // Update this when you deploy new versions

export function useVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(APP_VERSION);

  useEffect(() => {
    // Check version from localStorage
    const storedVersion = localStorage.getItem('app-version');
    
    if (storedVersion && storedVersion !== APP_VERSION) {
      setNewVersionAvailable(true);
    }

    // Store current version
    localStorage.setItem('app-version', APP_VERSION);
    setCurrentVersion(APP_VERSION);

    // Check for updates periodically (every 10 minutes)
    const checkVersion = async () => {
      try {
        // In production, you could fetch version from an API endpoint
        // For now, we'll use a simple timestamp-based check
        const lastCheck = localStorage.getItem('last-version-check');
        const now = Date.now();
        
        if (!lastCheck || now - parseInt(lastCheck) > 10 * 60 * 1000) {
          // Simulate version check by checking if page was updated
          const response = await fetch(window.location.href, {
            method: 'HEAD',
            cache: 'no-cache',
          });
          
          const lastModified = response.headers.get('last-modified');
          const storedLastModified = localStorage.getItem('page-last-modified');
          
          if (lastModified && storedLastModified && lastModified !== storedLastModified) {
            setNewVersionAvailable(true);
          }
          
          if (lastModified) {
            localStorage.setItem('page-last-modified', lastModified);
          }
          localStorage.setItem('last-version-check', now.toString());
        }
      } catch (error) {
        console.log('Version check failed:', error);
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const dismissUpdate = () => {
    setNewVersionAvailable(false);
  };

  const reloadApp = () => {
    window.location.reload();
  };

  return { newVersionAvailable, currentVersion, dismissUpdate, reloadApp };
}

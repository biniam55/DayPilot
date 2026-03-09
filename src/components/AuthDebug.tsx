'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function AuthDebug() {
  const { user, loading } = useAuthContext();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    addLog('AuthDebug mounted');
    addLog(`Auth loading: ${loading}`);
    addLog(`User: ${user ? user.email : 'null'}`);
    
    const authFlag = localStorage.getItem('daypilot-auth-in-progress');
    addLog(`Auth flag: ${authFlag || 'not set'}`);
    
    const welcomeFlag = localStorage.getItem('daypilot-welcome-seen');
    addLog(`Welcome seen: ${welcomeFlag || 'not set'}`);
    
    const urlParams = new URLSearchParams(window.location.search);
    addLog(`URL params: ${urlParams.toString() || 'none'}`);
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    addLog(`Is mobile: ${isMobile}`);
  }, [user, loading]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-black/90 text-white text-xs p-4 rounded-lg max-h-96 overflow-auto z-50">
      <div className="font-bold mb-2">Auth Debug</div>
      {logs.map((log, i) => (
        <div key={i} className="mb-1">{log}</div>
      ))}
    </div>
  );
}

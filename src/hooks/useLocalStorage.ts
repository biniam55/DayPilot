import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const { user } = useAuthContext();
  
  // Create user-specific key
  const userKey = user ? `${key}-${user.uid}` : key;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(userKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading localStorage key "${userKey}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(userKey, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error saving localStorage key "${userKey}":`, error);
    }
  }, [userKey, storedValue]);

  // Reset to initial or stored value when user changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.localStorage.getItem(userKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn(`Error loading localStorage key "${userKey}":`, error);
      setStoredValue(initialValue);
    }
  }, [userKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error setting value for key "${userKey}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

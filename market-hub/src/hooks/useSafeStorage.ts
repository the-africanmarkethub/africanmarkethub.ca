import { useState, useEffect } from 'react';

/**
 * A custom hook for safely accessing localStorage/sessionStorage in SSR environments
 * Prevents hydration mismatches by only accessing storage on the client side
 */
export function useSafeLocalStorage(key: string, defaultValue: string | null = null) {
  const [value, setValue] = useState<string | null>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedValue = localStorage.getItem(key);
        setValue(storedValue);
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
        setValue(defaultValue);
      } finally {
        setIsLoaded(true);
      }
    }
  }, [key, defaultValue]);

  const setStoredValue = (newValue: string | null) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        if (newValue === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, newValue);
        }
      }
    } catch (error) {
      console.warn('Error setting localStorage:', error);
    }
  };

  return [value, setStoredValue, isLoaded] as const;
}

export function useSafeSessionStorage(key: string, defaultValue: string | null = null) {
  const [value, setValue] = useState<string | null>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedValue = sessionStorage.getItem(key);
        setValue(storedValue);
      } catch (error) {
        console.warn('Error accessing sessionStorage:', error);
        setValue(defaultValue);
      } finally {
        setIsLoaded(true);
      }
    }
  }, [key, defaultValue]);

  const setStoredValue = (newValue: string | null) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        if (newValue === null) {
          sessionStorage.removeItem(key);
        } else {
          sessionStorage.setItem(key, newValue);
        }
      }
    } catch (error) {
      console.warn('Error setting sessionStorage:', error);
    }
  };

  return [value, setStoredValue, isLoaded] as const;
}

/**
 * Hook for safely checking if we're on the client side
 * Useful for preventing hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
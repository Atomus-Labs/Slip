import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook specifically for boolean settings with toast notifications
export function useBooleanSetting(key: string, initialValue: boolean, onToggle?: (value: boolean) => void) {
  const [value, setValue] = useLocalStorage<boolean>(key, initialValue);

  const toggle = () => {
    const newValue = !value;
    setValue(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return [value, toggle, setValue] as const;
}
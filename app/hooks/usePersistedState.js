'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * useState that persists to localStorage.
 * SSR-safe: reads from localStorage only after mount.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value
 * @returns {[*, Function]}
 */
export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors — use initialValue
    }
    setHydrated(true);
  }, [key]);

  // Write to localStorage on change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors silently
    }
  }, [key, value, hydrated]);

  const update = useCallback((newValue) => {
    setValue((prev) => {
      const resolved = typeof newValue === 'function' ? newValue(prev) : newValue;
      return resolved;
    });
  }, []);

  return [value, update];
}

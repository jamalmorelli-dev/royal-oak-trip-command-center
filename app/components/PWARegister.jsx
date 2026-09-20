'use client';
import { useEffect } from 'react';
import { withBase } from '../lib/basePath';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const sw = withBase('/sw.js');
    const scope = withBase('/') || '/';
    navigator.serviceWorker.register(sw, { scope }).catch(() => {});
  }, []);
  return null;
}

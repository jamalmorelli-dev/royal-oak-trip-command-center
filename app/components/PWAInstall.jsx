'use client';
import { useEffect, useState } from 'react';

export default function PWAInstall() {
  const [deferred, setDeferred] = useState(null);
  const [iosHint, setIosHint] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isSafari = /safari/i.test(window.navigator.userAgent) && !/crios|fxios|edgios/i.test(window.navigator.userAgent);
    if (isIos && isSafari) setIosHint(true);

    function onPrompt(e) {
      e.preventDefault();
      setDeferred(e);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferred(null);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) {
    return <span className="pill good" style={{ fontSize: 10 }}>INSTALLED PWA</span>;
  }

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    setDeferred(null);
  }

  return (
    <div className="pwa-install no-print">
      {deferred ? (
        <button type="button" className="hud-btn hud-btn-primary" onClick={install}>
          Install Trip HQ
        </button>
      ) : iosHint ? (
        <span className="muted" style={{ fontSize: 11 }}>
          iPhone: Share → Add to Home Screen
        </span>
      ) : (
        <span className="muted" style={{ fontSize: 11 }}>
          Installable PWA — use browser Install / Add to Home Screen
        </span>
      )}
    </div>
  );
}

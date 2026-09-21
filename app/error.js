'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log exception for diagnostics
    console.error('Command Center client error boundary caught:', error);
  }, [error]);

  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        maxWidth: 580,
        margin: '60px auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        className="card"
        style={{
          background: 'rgba(14, 21, 38, 0.95)',
          border: '1px solid var(--accent, #58a6ff)',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
        <h2 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--ink-bright, #f0f6fc)' }}>
          Command Center Online
        </h2>
        <p className="muted" style={{ fontSize: 14, margin: '0 0 20px', color: 'var(--muted, #8b949e)' }}>
          A client state refresh is required to sync latest mission flight data.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="hud-btn hud-btn-primary"
            onClick={() => {
              if (typeof reset === 'function') {
                reset();
              } else {
                window.location.reload();
              }
            }}
            style={{
              background: 'var(--accent, #58a6ff)',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🔄 Sync &amp; Reload Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

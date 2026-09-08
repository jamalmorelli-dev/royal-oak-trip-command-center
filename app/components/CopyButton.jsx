'use client';
import { useState, useCallback } from 'react';

/**
 * One-tap copy-to-clipboard button with visual feedback.
 */
export default function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [text]);

  return (
    <button
      className="copy-btn"
      onClick={handleCopy}
      aria-label={`Copy ${label || text}`}
      title={`Copy ${label || text}`}
      type="button"
    >
      {copied ? '✓' : '⧉'}
    </button>
  );
}

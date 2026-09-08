'use client';

/**
 * Deep-link to Google Maps from an address string.
 * Uses the free search URL — no paid API.
 */
export default function MapLink({ address, children }) {
  if (!address) return null;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="map-link"
      aria-label={`Open ${address} in Google Maps`}
      title={`Open in Maps`}
    >
      {children || '📍'}
    </a>
  );
}

export const metadata = {
  title: 'Royal Oak Trip Command Center',
  description: 'Royal Oak trip budget, itinerary, transport and local guide — Sep 14–25, 2026',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1020',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="./icon.svg" />
        <link rel="apple-touch-icon" href="./icon.svg" />
        <link rel="manifest" href="./manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Trip HQ" />
      </head>
      <body>{children}</body>
    </html>
  );
}

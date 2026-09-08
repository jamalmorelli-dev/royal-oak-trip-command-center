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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}

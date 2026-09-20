import PWARegister from './components/PWARegister';

export const metadata = {
  title: 'Royal Oak Trip Command Center',
  description:
    'CHECKED IN. Collect the Air France boarding pass at RBA. Seats 22D / 38H. Offline trip HQ.',
  applicationName: 'Trip HQ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Trip HQ',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1020',
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="./manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Trip HQ" />
      </head>
      <body>
        {children}
        <PWARegister />
      </body>
    </html>
  );
}

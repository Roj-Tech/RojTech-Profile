import type { Metadata } from 'next';
import './globals.css';
import './overrides.css';
import './rtl.css';

export const metadata: Metadata = {
  title: 'RojTech — Security Learning Platform',
  description: 'RojTech — cybersecurity, software, and emerging technologies learning platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content="RojTech — cybersecurity, software, and emerging technologies learning platform." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@200;400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}


import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { BottomNav } from '@/components/layout/bottom-nav';
import { getThemeData } from '@/app/admin/theme/actions';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'AI Forex Signals Live',
  description: 'Live forex signals, AI-powered technical analysis, and economic calendar.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#333333',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeData();

  const themeStyle = `
    :root {
      --primary: ${theme.primary};
      --background: ${theme.background};
      --accent: ${theme.accent};
    }
    .dark {
      --primary: ${theme.primary};
      --background: ${theme.background};
      --accent: ${theme.accent};
    }
  `;

  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-body antialiased min-h-screen">
        <AuthProvider>
            <AnimatedBackground />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="p-4 sm:p-6 lg:p-8 relative z-10 flex-grow pb-24">
                {children}
              </main>
              <BottomNav />
            </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

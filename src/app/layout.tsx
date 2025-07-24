
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { ParticlesBackground } from '@/components/layout/particles-background';
import { AuroraBackground } from '@/components/layout/aurora-background';
import { BottomNav } from '@/components/layout/bottom-nav';
import { getAppearanceData } from '@/app/admin/appearance/actions';
import { AuthProvider } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { fontMap } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'AI Forex Signals Live',
  description: 'Live forex signals, AI-powered technical analysis, and economic calendar.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#333333',
};

const backgroundComponents = {
  lines: AnimatedBackground,
  particles: ParticlesBackground,
  aurora: AuroraBackground,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appearance = await getAppearanceData();
  const SelectedBackground = backgroundComponents[appearance.background] || AnimatedBackground;
  
  const fontBody = fontMap[appearance.fontBody] || fontMap['Inter'];
  const fontHeadline = fontMap[appearance.fontHeadline] || fontMap['Space Grotesk'];

  const themeStyle = `
    :root {
      --primary: ${appearance.primary};
      --background: ${appearance.backgroundHsl};
      --accent: ${appearance.accent};
      --font-body: ${fontBody.variable};
      --font-headline: ${fontHeadline.variable};
    }
    .dark {
      --primary: ${appearance.primary};
      --background: ${appearance.backgroundHsl};
      --accent: ${appearance.accent};
      --font-body: ${fontBody.variable};
      --font-headline: ${fontHeadline.variable};
    }
  `;
  
  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontBody.url} rel="stylesheet" />
        <link href={fontHeadline.url} rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={cn("font-body antialiased min-h-screen", fontBody.className, fontHeadline.className)}>
        <AuthProvider>
            <SelectedBackground />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="p-4 sm:p-6 lg:p-8 relative z-10 flex-grow pb-24 md:pb-4">
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

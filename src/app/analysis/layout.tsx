
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This layout is now public, no redirect needed.
    // Logic for premium features within the page would handle auth.
  }, [user, loading, router]);

  // Render children immediately
  return <>{children}</>;
}

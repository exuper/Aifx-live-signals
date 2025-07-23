
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
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.replace('/login?redirect=/analysis');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

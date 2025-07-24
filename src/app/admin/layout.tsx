
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  // While checking for authentication, show a loading spinner.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there's no user, render nothing while the redirect happens.
  if (!user) {
    return null;
  }
  
  // If user is authenticated, render the admin layout.
  return (
    <SidebarProvider>
        <div className="flex min-h-screen">
            <Sidebar>
                <SidebarNav />
            </Sidebar>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                 {children}
            </main>
        </div>
    </SidebarProvider>
  );
}

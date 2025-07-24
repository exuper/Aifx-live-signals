
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // This will be briefly shown before the redirect happens.
    return null;
  }
  
  return (
    <SidebarProvider>
        <div className="flex">
            <div className="hidden md:block">
                 <Sidebar>
                    <SidebarNav />
                </Sidebar>
            </div>
            <div className="flex-1">
                 {children}
            </div>
        </div>
    </SidebarProvider>
  );
}

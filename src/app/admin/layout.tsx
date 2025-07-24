
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

// --- IMPORTANT: Add your admin emails here ---
const adminEmails = ['victormbuya2@gmail.com'];
// ---------------------------------------------

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (!user) {
      // If there's no user, redirect to the admin login page.
      router.replace('/login/admin');
      return;
    }

    // If the user's email is not in the admin list, deny access.
    if (!adminEmails.includes(user.email || '')) {
      toast({
        title: 'Access Denied',
        description: 'You are not authorized to view this page.',
        variant: 'destructive',
      });
      router.replace('/'); // Redirect to the homepage
    }

  }, [user, loading, router, toast]);

  // While checking for authentication or if the user is not an admin, show a loading spinner.
  if (loading || !user || !adminEmails.includes(user.email || '')) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is an authenticated admin, render the admin layout.
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

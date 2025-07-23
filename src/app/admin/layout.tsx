
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in.
        // If they are on the login page, redirect them to the dashboard.
        if (pathname === '/admin/login') {
          router.replace('/admin');
        } else {
            setIsLoading(false);
        }
      } else {
        // User is not logged in.
        // If they are not on the login page, redirect them there.
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        } else {
            setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

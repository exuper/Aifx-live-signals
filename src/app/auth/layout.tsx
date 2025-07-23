
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        }
    }, [user, loading, router]);
    
    // While loading, or if user is logged in (and redirecting), show nothing
    if (loading || user) {
        return null; 
    }
    
    // Only show children (login/signup form) if not loading and no user
    return (
        <div className="flex items-center justify-center w-full h-full">
            {children}
        </div>
    )
}

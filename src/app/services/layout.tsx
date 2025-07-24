
'use client';

import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { loading: subLoading } = useSubscription();
  const router = useRouter();
  
  const isLoading = authLoading || subLoading;

  useEffect(() => {
    if (!isLoading && !user) {
      // If not loading and no user, redirect to login
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
      return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
  }

  return <>{children}</>;
}

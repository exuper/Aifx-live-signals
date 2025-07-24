
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, User, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const accountNavItems = [
    {
        title: "Profile",
        href: "/account/profile",
        icon: User
    },
    {
        title: "Billing",
        href: "/account/billing",
        icon: CreditCard
    }
];


function AccountNav() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start gap-2">
            {accountNavItems.map((item, index) => (
                <Link key={index} href={item.href}>
                    <span
                        className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent" : "transparent"
                        )}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                    </span>
                </Link>
            ))}
        </nav>
    );
}


export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/account/profile');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] gap-6">
        <aside className="hidden md:flex flex-col w-full">
            <AccountNav />
        </aside>
        <main>{children}</main>
    </div>
  );
}

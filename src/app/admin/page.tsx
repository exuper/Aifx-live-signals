
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShieldCheck, Users, BarChart2, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';

const adminFeatures = [
  {
    title: "Manage Signals",
    description: "Create, update, and expire trading signals.",
    icon: BarChart2,
    href: "/admin/signals",
    comingSoon: false,
  },
  {
    title: "Manage Users",
    description: "View and manage user accounts and permissions.",
    icon: Users,
    comingSoon: true,
  },
  {
    title: "View Payments",
    description: "Track and verify user payments and subscriptions.",
    icon: DollarSign,
    comingSoon: true,
  },
  {
    title: "Manage Content",
    description: "Update community links and other app content.",
    icon: LinkIcon,
    comingSoon: true,
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.replace('/admin/login');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/admin/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  const renderFeatureCard = (feature: typeof adminFeatures[0]) => (
     <Card key={feature.title} className="relative overflow-hidden flex flex-col">
      {feature.comingSoon && (
        <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs font-bold px-2 py-1 rounded">
          SOON
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <feature.icon className="w-8 h-8 text-primary" />
            </div>
          <div>
            <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
        <CardContent className="flex-grow flex items-end">
          {feature.comingSoon ? (
             <div className="text-sm text-muted-foreground w-full">
                This feature is under development.
              </div>
          ) : (
             <Button asChild className="w-full">
                <Link href={feature.href!}>Manage</Link>
              </Button>
          )}
        </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Admin Dashboard"
          description="Manage your application's content and features from here."
        />
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {adminFeatures.map(renderFeatureCard)}
      </div>
    </div>
  );
}

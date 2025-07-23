
'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BarChart2, Loader2, Link as LinkIcon, Calendar, Palette, Network } from "lucide-react";
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const adminFeatures = [
  {
    title: "Manage Signals",
    description: "Create, update, and expire trading signals.",
    icon: BarChart2,
    href: "/admin/signals",
    comingSoon: false,
  },
  {
    title: "Manage Calendar",
    description: "Add, edit, and delete economic calendar events.",
    icon: Calendar,
    href: "/admin/calendar",
    comingSoon: false,
  },
  {
    title: "Manage Content",
    description: "Update community links and other app content.",
    icon: LinkIcon,
    href: "/admin/content",
    comingSoon: false,
  },
  {
    title: "Theme Settings",
    description: "Customize the application's look and feel.",
    icon: Palette,
    href: "/admin/theme",
    comingSoon: false,
  },
   {
    title: "Payment Gateways",
    description: "Configure your payment provider details.",
    icon: Network,
    href: "/admin/gateways",
    comingSoon: false,
  },
  {
    title: "View Payments",
    description: "Track and verify user payments and subscriptions.",
    icon: DollarSign,
    href: "/admin/payments",
    comingSoon: false,
  },
  {
    title: "Manage Users",
    description: "View and manage user accounts and permissions.",
    icon: Users,
    href: "/admin/users",
    comingSoon: true,
  },
];

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/admin/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {adminFeatures.map(renderFeatureCard)}
      </div>
    </div>
  );
}

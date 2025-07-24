
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
    isExternal: false,
  },
  {
    title: "Manage Calendar",
    description: "Add, edit, and delete economic calendar events.",
    icon: Calendar,
    href: "/admin/calendar",
    isExternal: false,
  },
  {
    title: "Manage Content",
    description: "Update community links and other app content.",
    icon: LinkIcon,
    href: "/admin/content",
    isExternal: false,
  },
  {
    title: "Theme Settings",
    description: "Customize the application's look and feel.",
    icon: Palette,
    href: "/admin/theme",
    isExternal: false,
  },
   {
    title: "Payment Gateways",
    description: "Configure your payment provider details.",
    icon: Network,
    href: "/admin/gateways",
    isExternal: false,
  },
  {
    title: "View Payments",
    description: "Track and verify user payments and subscriptions.",
    icon: DollarSign,
    href: "/admin/payments",
    isExternal: false,
  },
  {
    title: "Manage Users",
    description: "View, edit, and manage users in the Firebase Console.",
    icon: Users,
    href: `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/authentication/users`,
    isExternal: true,
  },
];

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login/admin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const renderFeatureCard = (feature: typeof adminFeatures[0]) => (
     <Card key={feature.title} className="relative overflow-hidden flex flex-col">
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
            <Button asChild className="w-full">
              {feature.isExternal ? (
                <a href={feature.href} target="_blank" rel="noopener noreferrer">Manage</a>
              ) : (
                <Link href={feature.href!}>Manage</Link>
              )}
            </Button>
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

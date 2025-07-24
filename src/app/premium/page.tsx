
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal, Crown, Bot, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const services = [
  {
    id: "premium_signals",
    href: "/services/premium-signals",
    icon: Signal,
    title: "Premium Signals",
    price: "$15 / month",
    priceAmount: 15,
    description: "Get access to our high-accuracy premium trading signals.",
    cta: "Get Access"
  },
  {
    id: "elite_premium",
    href: "/services/elite-premium",
    icon: Crown,
    title: "Elite Premium",
    price: "$100",
    priceAmount: 100,
    description: "Includes all premium signals plus one-on-one mentorship sessions.",
    cta: "Get Elite Access"
  },
  {
    id: "premium_ea",
    href: "/services/premium-ea",
    icon: Bot,
    title: "Premium EA",
    price: "$100",
    priceAmount: 100,
    description: "Automate your trading with our exclusive Expert Advisor bot.",
    cta: "Get the EA"
  },
  {
    id: "mentorship",
    href: "/services/mentorship",
    icon: GraduationCap,
    title: "Mentorship",
    price: "$50",
    priceAmount: 50,
    description: "One-on-one sessions with our expert traders.",
    cta: "Get Mentorship"
  }
];

export default function PremiumPage() {
  const { user } = useAuth();
  const { hasSubscription } = useSubscription();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Premium & VIP Services"
        description="Unlock exclusive features, mentorship, and advanced signals."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => {
          const isSubscribed = user ? hasSubscription(service.id) : false;
          return (
            <Card key={service.id} className={cn("flex flex-col", isSubscribed ? "border-primary/80" : "border-border")}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-full", isSubscribed ? "bg-primary/20" : "bg-secondary")}>
                    <service.icon className={cn("w-8 h-8", isSubscribed ? "text-primary" : "text-secondary-foreground")} />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end items-center text-center space-y-4">
                <p className="text-3xl font-bold text-primary">{service.price}</p>
                <Button asChild className="w-full" variant={isSubscribed ? "outline" : "premium"} disabled={isSubscribed}>
                   <Link href={user ? service.href : '/login'}>
                    {isSubscribed ? (
                        <>
                            <CheckCircle className="mr-2" />
                            Subscribed
                        </>
                    ) : service.cta}
                    </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

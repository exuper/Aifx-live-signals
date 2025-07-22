import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal, Crown, Bot } from "lucide-react";

const services = [
  {
    icon: Signal,
    title: "Premium Signals",
    price: "$15 / month",
    description: "Get access to our high-accuracy premium trading signals.",
    cta: "Subscribe Now"
  },
  {
    icon: Crown,
    title: "Elite Premium",
    price: "$100",
    description: "Includes all premium signals plus one-on-one mentorship sessions.",
    cta: "Get Elite Access"
  },
  {
    icon: Bot,
    title: "Premium EA",
    price: "$100",
    description: "Automate your trading with our exclusive Expert Advisor bot.",
    cta: "Get the EA"
  }
];

export default function PremiumPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Premium & VIP Services"
        description="Unlock exclusive features, mentorship, and advanced signals."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col border-primary/50">
            <CardHeader>
              <div className="flex items-start gap-4">
                 <div className="p-3 rounded-full bg-primary/20">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end items-center text-center space-y-4">
               <p className="text-3xl font-bold text-primary">{service.price}</p>
              <Button className="w-full">{service.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

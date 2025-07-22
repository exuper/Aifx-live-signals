
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShieldCheck, Users, BarChart2 } from "lucide-react";

const adminFeatures = [
  {
    title: "Manage Signals",
    description: "Create, update, and expire trading signals.",
    icon: BarChart2,
    comingSoon: true,
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
    icon: ShieldCheck,
    comingSoon: true,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage your application's content and features from here."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {adminFeatures.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden">
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
             <CardContent>
              <div className="text-sm text-muted-foreground">
                This feature is under development.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-8 border-destructive/50">
        <CardHeader>
          <CardTitle className="font-headline text-destructive">Security Warning</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">
            This admin panel is currently not protected by authentication.
            Access control should be implemented to secure these features before use in a production environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

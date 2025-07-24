
'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubscription } from "@/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldX } from "lucide-react";

const services: { [key: string]: string } = {
  premium_signals: "Premium Signals",
  elite_premium: "Elite Premium",
  premium_ea: "Premium EA",
  mentorship: "Mentorship"
};

export default function BillingPage() {
    const { subscriptions, loading: subLoading, hasSubscription } = useSubscription();
    
    const allServiceIds = Object.keys(services);

    if (subLoading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Billing & Subscriptions"
                    description="Manage your active and expired subscriptions."
                />
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
             <PageHeader
                title="Billing & Subscriptions"
                description="Manage your active and expired subscriptions."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Subscriptions</CardTitle>
                    <CardDescription>
                        This is a list of all your current and past subscriptions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expires On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allServiceIds.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                        No subscriptions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allServiceIds.map(serviceId => {
                                    const sub = subscriptions[serviceId];
                                    if (!sub) return null; // Don't show services user has never subscribed to

                                    const isActive = hasSubscription(serviceId);

                                    return (
                                        <TableRow key={serviceId}>
                                            <TableCell className="font-medium">{services[serviceId] || serviceId}</TableCell>
                                            <TableCell>
                                                <Badge variant={isActive ? "default" : "destructive"} className={cn(isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                                    {isActive ? <ShieldCheck className="mr-2"/> : <ShieldX className="mr-2" />}
                                                    {isActive ? 'Active' : 'Expired'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(sub.expiresAt.toDate(), 'PPP')}</TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

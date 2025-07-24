
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../page-header";

interface AccessDeniedProps {
    serviceTitle: string;
}

export function AccessDenied({ serviceTitle }: AccessDeniedProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
             <PageHeader title={serviceTitle} />
            <Card className="max-w-md mt-8 w-full">
                <CardHeader>
                    <div className="mx-auto bg-destructive/20 p-4 rounded-full w-fit">
                        <Lock className="w-12 h-12 text-destructive" />
                    </div>
                     <CardTitle className="pt-4 font-headline">Access Denied</CardTitle>
                    <CardDescription>
                       You do not have an active subscription for the "{serviceTitle}" service. Please subscribe to gain access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/premium">View Premium Services</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

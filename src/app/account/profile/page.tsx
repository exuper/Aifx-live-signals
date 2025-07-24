
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { handleSignOut } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const onSignOut = async () => {
        await handleSignOut();
        router.replace('/login');
    }

    if (!user) {
        return null;
    }
    
    return (
        <div className="space-y-8">
            <PageHeader
                title="My Profile"
                description="View and manage your account details."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Account Information</CardTitle>
                    <CardDescription>
                        This is your account information. Password changes can be done via email reset.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Email Address</span>
                        <p className="font-semibold">{user.email}</p>
                    </div>
                     <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Account Created</span>
                        <p className="font-semibold">{new Date(user.metadata.creationTime!).toLocaleDateString()}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                     <Button variant="destructive" onClick={onSignOut}>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

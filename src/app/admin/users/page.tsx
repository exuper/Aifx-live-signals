'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUsers, UserData } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function ManageUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function loadUsers() {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                toast({
                    title: "Error loading users",
                    description: "Could not fetch user data.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadUsers();
    }, [toast]);

    const formatTimestamp = (timestamp: string | undefined) => {
        if (!timestamp) return 'Never';
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Manage Users"
                description="View all registered users in your application."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">User List</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No registered users found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Last Seen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>{formatTimestamp(user.createdAt)}</TableCell>
                                        <TableCell>{formatTimestamp(user.lastSeen)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

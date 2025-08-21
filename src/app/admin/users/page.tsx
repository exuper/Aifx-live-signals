'use client';

import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUsers, UserData } from './actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import Link from 'next/link';

export default function ManageUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
    
    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        return users.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const formatTimestamp = (timestamp: string | undefined) => {
        if (!timestamp) return 'Never';
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        toast({ title: "Copied!", description: "User email copied to clipboard."});
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Manage Users"
                description="View and search for registered users in your application."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">User List</CardTitle>
                    <CardDescription>
                        For advanced user management like deleting or modifying users, please use the{' '}
                        <a 
                            href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/authentication/users`} 
                            target="_blank" rel="noopener noreferrer"
                            className="text-primary underline"
                        >
                            Firebase Console
                        </a>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input 
                            placeholder="Search by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
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
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <span>{user.email}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyEmail(user.email)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
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

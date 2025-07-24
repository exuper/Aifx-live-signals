
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PageHeader } from '@/components/page-header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createAlert, deleteAlert } from './actions';
import { Loader2, PlusCircle, Trash2, Megaphone } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

const alertSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(50),
  message: z.string().min(10, "Message must be at least 10 characters.").max(200),
});

type AlertFormData = z.infer<typeof alertSchema>;

interface Alert {
  id: string;
  title: string;
  message: string;
  createdAt: Timestamp;
}

export default function ManageAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
  });

  useEffect(() => {
    const q = query(collection(db, "alerts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const alertsData: Alert[] = [];
      querySnapshot.forEach((doc) => {
        alertsData.push({ id: doc.id, ...doc.data() } as Alert);
      });
      setAlerts(alertsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching alerts:", error);
      toast({ title: "Error", description: "Could not fetch alerts.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: AlertFormData) => {
    setIsSubmitting(true);
    try {
      await createAlert(data);
      toast({ title: "Alert Sent!", description: "The new alert is now visible to all users." });
      reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to send the alert.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!alertToDelete) return;
    try {
      await deleteAlert(alertToDelete);
      toast({ title: "Alert Deleted", description: "The alert has been removed." });
      setAlertToDelete(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete the alert.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Alerts"
        description="Create and delete global announcements for your users."
      />

       <AlertDialog open={!!alertToDelete} onOpenChange={() => setAlertToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the alert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky top-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Create New Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Alert Title</Label>
                  <Input id="title" {...register('title')} placeholder="e.g., Market Update" />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Alert Message</Label>
                  <Textarea id="message" {...register('message')} placeholder="e.g., Important news regarding USD pairs..." />
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Sending...' : 'Send Alert'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Sent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : alerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No alerts sent yet.</p>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg bg-card/50">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/20 mt-1">
                            <Megaphone className="w-5 h-5 text-primary"/>
                        </div>
                        <div>
                            <p className="font-semibold">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">{formatDistanceToNow(alert.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setAlertToDelete(alert.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

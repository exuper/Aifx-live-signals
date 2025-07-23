
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Signal } from '@/lib/mock-data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { createSignal, updateSignalStatus, deleteSignal } from './actions';
import { Loader2, PlusCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const signalSchema = z.object({
  pair: z.string().min(3, "Pair is required").toUpperCase(),
  action: z.enum(['BUY', 'SELL']),
  entry: z.coerce.number().positive("Entry price must be positive"),
  stopLoss: z.coerce.number().positive("Stop loss must be positive"),
  takeProfit1: z.coerce.number().positive("Take profit 1 must be positive"),
  takeProfit2: z.coerce.number().positive("Take profit 2 must be positive"),
});

export default function ManageSignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(signalSchema),
    defaultValues: {
        pair: '',
        action: 'BUY',
        entry: 0,
        stopLoss: 0,
        takeProfit1: 0,
        takeProfit2: 0,
    }
  });

  useEffect(() => {
    const q = query(collection(db, "signals"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const signalsData: Signal[] = [];
      querySnapshot.forEach((doc) => {
        signalsData.push({ id: doc.id, ...doc.data() } as Signal);
      });
      setSignals(signalsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching signals:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const onSubmit = async (data: z.infer<typeof signalSchema>) => {
    setIsSubmitting(true);
    try {
      await createSignal(data);
      toast({
        title: "Signal Created!",
        description: `${data.pair} has been successfully added.`,
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create signal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Active' | 'Expired') => {
      try {
        await updateSignalStatus(id, status);
        toast({
            title: "Status Updated",
            description: `Signal has been marked as ${status}.`
        })
      } catch (error) {
           toast({
            title: "Error",
            description: "Failed to update signal status.",
            variant: "destructive",
      });
      }
  };
  
  const handleDeleteSignal = async (id: string) => {
      try {
          await deleteSignal(id);
          toast({
              title: "Signal Deleted",
              description: "The signal has been permanently removed.",
          })
      } catch (error) {
           toast({
            title: "Error",
            description: "Failed to delete signal.",
            variant: "destructive",
      });
      }
  }

  const activeSignals = signals.filter(s => s.status === 'Active');
  const expiredSignals = signals.filter(s => s.status === 'Expired');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Signals"
        description="Create new trading signals and manage existing ones."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Create New Signal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pair">Pair (e.g., EUR/USD)</Label>
                  <Input id="pair" {...register('pair')} />
                  {errors.pair && <p className="text-red-500 text-xs">{errors.pair.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Controller
                    name="action"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BUY">BUY</SelectItem>
                          <SelectItem value="SELL">SELL</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="entry">Entry Price</Label>
                        <Input id="entry" type="number" step="any" {...register('entry')} />
                         {errors.entry && <p className="text-red-500 text-xs">{errors.entry.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="stopLoss">Stop Loss</Label>
                        <Input id="stopLoss" type="number" step="any" {...register('stopLoss')} />
                         {errors.stopLoss && <p className="text-red-500 text-xs">{errors.stopLoss.message}</p>}
                    </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="takeProfit1">Take Profit 1</Label>
                        <Input id="takeProfit1" type="number" step="any" {...register('takeProfit1')} />
                        {errors.takeProfit1 && <p className="text-red-500 text-xs">{errors.takeProfit1.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="takeProfit2">Take Profit 2</Label>
                        <Input id="takeProfit2" type="number" step="any" {...register('takeProfit2')} />
                        {errors.takeProfit2 && <p className="text-red-500 text-xs">{errors.takeProfit2.message}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Creating...' : 'Create Signal'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <div className="space-y-6">
                <SignalTable title="Active Signals" signals={activeSignals} onUpdate={handleUpdateStatus} onDelete={handleDeleteSignal} isLoading={isLoading} />
                <SignalTable title="Signal History" signals={expiredSignals} onUpdate={handleUpdateStatus} onDelete={handleDeleteSignal} isLoading={isLoading} />
           </div>
        </div>
      </div>
    </div>
  );
}


function SignalTable({title, signals, onUpdate, onDelete, isLoading}: {title: string, signals: Signal[], onUpdate: (id: string, status: 'Active' | 'Expired') => void, onDelete: (id: string) => void, isLoading: boolean}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pair</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entry</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {signals.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No {title.toLowerCase()} found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            signals.map((signal) => (
                                <TableRow key={signal.id}>
                                    <TableCell className="font-bold">{signal.pair}</TableCell>
                                    <TableCell>
                                        <Badge variant={signal.action === 'BUY' ? 'default' : 'destructive'} className={cn(signal.action === 'BUY' ? "bg-green-600" : "bg-red-600")}>
                                            {signal.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">{signal.entry}</TableCell>
                                    <TableCell>
                                         <Badge variant={signal.status === 'Active' ? 'outline' : 'secondary'} className={cn(signal.status === 'Active' && "border-primary text-primary")}>
                                            {signal.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {signal.status === 'Active' && (
                                            <Button variant="ghost" size="icon" onClick={() => onUpdate(signal.id, 'Expired')}>
                                                <XCircle className="w-4 h-4 text-orange-500" />
                                            </Button>
                                        )}
                                        {signal.status === 'Expired' && (
                                             <Button variant="ghost" size="icon" onClick={() => onUpdate(signal.id, 'Active')}>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the signal
                                                    for {signal.pair}.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => onDelete(signal.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
}


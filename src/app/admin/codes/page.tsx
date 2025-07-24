
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { createAccessCode, getAccessCodes, GenerateCodeFormData } from './actions';
import { Loader2, PlusCircle, KeyRound, Copy, Check, ShieldCheck, Clock, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';


const generateCodeSchema = z.object({
  serviceId: z.string().min(1, "Please select a service."),
  durationDays: z.coerce.number().min(1, "Duration must be at least 1 day."),
});

const services = [
  { id: "premium_signals", title: "Premium Signals" },
  { id: "elite_premium", title: "Elite Premium" },
  { id: "premium_ea", title: "Premium EA" },
  { id: "mentorship", title: "Mentorship" }
];

interface AccessCode {
  id: string;
  code: string;
  serviceId: string;
  durationDays: number;
  isUsed: boolean;
  usedByEmail?: string;
  expiresAt: string; // Changed from Timestamp
  usedAt?: string;   // Changed from Timestamp
  createdAt: string;  // Changed from Timestamp
}

export default function ManageCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<GenerateCodeFormData>({
    resolver: zodResolver(generateCodeSchema),
  });
  
  const fetchCodes = async () => {
    setIsLoading(true);
    try {
        const codesData = await getAccessCodes();
        setCodes(codesData as AccessCode[]);
    } catch (error) {
        toast({ title: "Error", description: "Could not fetch access codes." });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCodes();
  }, []);

  const onSubmit = async (data: GenerateCodeFormData) => {
    setIsSubmitting(true);
    setLastGeneratedCode(null);
    try {
      const result = await createAccessCode(data);
      if (result.success && result.code) {
        toast({ title: "Code Generated!", description: "A new access code has been created." });
        setLastGeneratedCode(result.code);
        reset({ serviceId: '', durationDays: 30 });
        await fetchCodes(); // Refresh the list
      } else {
        throw new Error(result.error || "Failed to generate code.");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `Code ${code} copied to clipboard.`});
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Access Codes"
        description="Generate unique codes to grant users access to premium services."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky top-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generate New Code</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Service</Label>
                   <Controller
                      name="serviceId"
                      control={control}
                      render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                          <SelectValue placeholder="Select a service to unlock" />
                          </SelectTrigger>
                          <SelectContent>
                          {services.map(service => (
                              <SelectItem key={service.id} value={service.id}>{service.title}</SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                      )}
                  />
                  {errors.serviceId && <p className="text-red-500 text-xs">{errors.serviceId.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label>Access Duration (in days)</Label>
                  <Input {...register('durationDays')} type="number" defaultValue={30} />
                  {errors.durationDays && <p className="text-red-500 text-xs">{errors.durationDays.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Generating...' : 'Generate Code'}
                </Button>
              </form>
               {lastGeneratedCode && (
                    <div className="mt-4 p-3 border-2 border-dashed rounded-lg text-center">
                        <Label>Last Generated Code</Label>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <p className="font-mono text-lg text-primary">{lastGeneratedCode}</p>
                            <Button variant="ghost" size="icon" onClick={() => handleCopyCode(lastGeneratedCode)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">Generated Codes</CardTitle>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
               ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Expires</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {codes.map(code => {
                            const expiresDate = new Date(code.expiresAt);
                            const isExpired = new Date() > expiresDate;
                            
                            let status: 'Used' | 'Expired' | 'Active' = 'Active';
                            let statusClass = 'bg-green-500/20 text-green-400';
                            if (code.isUsed) {
                                status = 'Used';
                                statusClass = 'bg-blue-500/20 text-blue-400';
                            }
                            if (isExpired) {
                                status = 'Expired';
                                statusClass = 'bg-muted text-muted-foreground';
                            }
                            
                           return (
                             <TableRow key={code.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono">{code.code}</span>
                                        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => handleCopyCode(code.code)}>
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        {services.find(s => s.id === code.serviceId)?.title || code.serviceId}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={cn(statusClass)}>{status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {code.usedByEmail ? (
                                        <div className="flex items-center gap-2 text-xs">
                                            <UserCircle className="w-4 h-4" />
                                            {code.usedByEmail}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                 <TableCell>
                                     <div className="flex items-center gap-2 text-xs">
                                        <Clock className="w-4 h-4" />
                                        {isExpired ? `Expired ${formatDistanceToNow(expiresDate)} ago` : `in ${formatDistanceToNow(expiresDate)}`}
                                     </div>
                                 </TableCell>
                            </TableRow>
                           )
                        })}
                    </TableBody>
                </Table>
               )}
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

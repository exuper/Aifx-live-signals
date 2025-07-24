
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Landmark, Copy, Upload, Smartphone, Bitcoin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { submitPayment } from '@/app/premium/actions';
import { getPaymentGateways, PaymentGatewaysData } from '@/app/admin/gateways/actions';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useRouter } from 'next/navigation';

interface PaymentFormProps {
  service: {
    id: string;
    title: string;
    priceAmount: number;
  };
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({ title: 'Copied to clipboard!', description: `${label} copied.` });
  };
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-secondary">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm break-all">{value}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function PaymentForm({ service }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gateways, setGateways] = useState<PaymentGatewaysData | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [senderName, setSenderName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadGateways() {
      try {
        const data = await getPaymentGateways();
        setGateways(data);
      } catch (error) {
        toast({ title: "Error", description: "Could not load payment methods.", variant: "destructive" });
      }
    }
    loadGateways();
  }, []);

  const handleSubmit = async (method: string) => {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to make a payment.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('userId', user.uid);
        formData.append('userEmail', user.email || 'unknown');
        formData.append('serviceId', service.id);
        formData.append('serviceTitle', service.title);
        formData.append('priceAmount', service.priceAmount.toString());
        formData.append('paymentMethod', method);
        if (senderName) {
            formData.append('senderName', senderName);
        }
        if (receipt) {
            formData.append('receipt', receipt);
        }

        const result = await submitPayment(formData);

        if (result.success) {
            toast({
                title: 'Payment Submitted!',
                description: `Your payment for ${service.title} is being processed. Please contact an admin with your transaction details to receive your access code.`,
            });
            setIsSubmitted(true);
        } else {
            throw new Error(result.error || 'An unknown error occurred.');
        }

    } catch (error: any) {
        toast({
            title: 'Submission Failed',
            description: error.message || "Could not submit payment. Please try again.",
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
      return (
          <Card className="max-w-lg mx-auto bg-transparent border-none shadow-none">
              <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">Submission Received!</CardTitle>
                  <CardDescription>
                      Your payment submission for "{service.title}" has been received. Please contact an admin with your transaction details to get your access code.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                  <Button onClick={() => setIsSubmitted(false)}>Make Another Payment</Button>
              </CardContent>
          </Card>
      )
  }

  const ReceiptUpload = ({ id }: { id: string }) => (
    <div className="space-y-2 pt-4">
       <Label htmlFor={`receipt-upload-${id}`}>Upload Receipt (Optional)</Label>
       <div className="flex gap-2">
          <Input id={`receipt-upload-${id}`} type="file" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
          <Button variant="secondary" size="icon"><Upload className="h-4 w-4"/></Button>
       </div>
       {receipt && <p className="text-xs text-muted-foreground">Selected: {receipt.name}</p>}
    </div>
  );

  const renderPaymentContent = (category: keyof PaymentGatewaysData, type: string, needsSenderInfo: boolean) => {
      if (!gateways) {
          return (
              <div className="space-y-4 pt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </div>
          )
      }
      return (
           <Card className="bg-background/50 border-none shadow-none">
                <CardContent className="p-0 pt-6 space-y-4">
                    <p className="text-sm text-center text-muted-foreground">Send ${service.priceAmount} to one of the options below.</p>
                    <Accordion type="single" collapsible className="w-full">
                        {gateways[category].map(gateway => (
                            <AccordionItem key={gateway.id} value={gateway.id}>
                                <AccordionTrigger>{gateway.title}</AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    {gateway.details.map(detail => (
                                        <InfoRow key={detail.label} label={detail.label} value={detail.value} />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    {needsSenderInfo && (
                        <div className="space-y-2">
                            <Label htmlFor="sender-name">Sender/Agent Name</Label>
                            <Input 
                                id="sender-name" 
                                placeholder="e.g. John Doe or Agent 123" 
                                value={senderName} 
                                onChange={(e) => setSenderName(e.target.value)} 
                            />
                        </div>
                    )}
                    <ReceiptUpload id={category} />
                    <Button onClick={() => handleSubmit(type)} className="w-full" disabled={isSubmitting || (needsSenderInfo && !senderName)}>
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        I Have Paid, Submit for Verification
                    </Button>
                </CardContent>
           </Card>
      )
  }

  return (
    <>
      <TabsContent value="crypto">{renderPaymentContent('crypto', 'Crypto', false)}</TabsContent>
      <TabsContent value="transfer">{renderPaymentContent('transfer', 'Transfer', true)}</TabsContent>
      <TabsContent value="mobile">{renderPaymentContent('mobile', 'Mobile Money', true)}</TabsContent>
    </>
  );
}

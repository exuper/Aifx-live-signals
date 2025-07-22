
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Loader2, Landmark, Copy, Upload, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from '@/components/ui/label';

const cardPaymentSchema = z.object({
  cardholderName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), {
    message: 'Card number must be 16 digits.',
  }),
  expiryDate: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), {
    message: 'Expiry date must be in MM/YY format.',
  }),
  cvc: z.string().refine((value) => /^\d{3,4}$/.test(value), {
    message: 'CVC must be 3 or 4 digits.',
  }),
});

type CardPaymentFormValues = z.infer<typeof cardPaymentSchema>;

interface PaymentFormProps {
  service: {
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
        <p className="font-mono text-sm">{value}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function PaymentForm({ service }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);

  const cardForm = useForm<CardPaymentFormValues>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: { cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' },
  });

  const onCardSubmit = async (data: CardPaymentFormValues) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Card Payment data:', data);
    toast({
      title: 'Payment Successful!',
      description: `You have successfully subscribed to ${service.title}.`,
      variant: 'default',
    });
  };

  const onOtherPaymentSubmit = async (method: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Payment method:', method, 'Receipt:', receipt?.name);
    toast({
      title: 'Payment Submitted!',
      description: `Your payment for ${service.title} via ${method} is being processed.`,
      variant: 'default',
    });
  };

  return (
    <Tabs defaultValue="card" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
        <TabsTrigger value="crypto">Crypto</TabsTrigger>
        <TabsTrigger value="transfer"><Landmark className="mr-2 h-4 w-4"/>Transfer</TabsTrigger>
        <TabsTrigger value="mobile"><Smartphone className="mr-2 h-4 w-4"/>Mobile</TabsTrigger>
      </TabsList>

      {/* CARD PAYMENT */}
      <TabsContent value="card">
        <Form {...cardForm}>
          <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4 pt-4">
            <FormField control={cardForm.control} name="cardholderName" render={({ field }) => ( <FormItem> <FormLabel>Cardholder Name</FormLabel> <FormControl> <Input placeholder="John Doe" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField
              control={cardForm.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="0000 0000 0000 0000" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={cardForm.control} name="expiryDate" render={({ field }) => ( <FormItem> <FormLabel>Expiry Date</FormLabel> <FormControl> <Input placeholder="MM/YY" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={cardForm.control} name="cvc" render={({ field }) => ( <FormItem> <FormLabel>CVC</FormLabel> <FormControl> <Input placeholder="123" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            <Button type="submit" className="w-full text-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <DollarSign className="mr-2 h-5 w-5" />}
              Pay ${service.priceAmount}
            </Button>
          </form>
        </Form>
      </TabsContent>

      {/* CRYPTO PAYMENT */}
      <TabsContent value="crypto">
        <div className="space-y-4 pt-4">
            <p className="text-sm text-center text-muted-foreground">Send ${service.priceAmount} to one of the addresses below.</p>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="usdt">
                    <AccordionTrigger>USDT (TRC20)</AccordionTrigger>
                    <AccordionContent>
                        <InfoRow label="USDT Address (TRC20)" value="Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="btc">
                    <AccordionTrigger>BTC</AccordionTrigger>
                    <AccordionContent>
                        <InfoRow label="BTC Address" value="bc1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
             <Button onClick={() => onOtherPaymentSubmit('Crypto')} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                I Have Paid
            </Button>
        </div>
      </TabsContent>

      {/* BANK/MONEY TRANSFER */}
      <TabsContent value="transfer">
        <div className="space-y-4 pt-4">
            <p className="text-sm text-center text-muted-foreground">Complete your payment and upload the receipt if applicable.</p>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="western">
                    <AccordionTrigger>Western Union</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <p className="text-sm">Please send ${service.priceAmount} to the details below, then upload your receipt.</p>
                        <InfoRow label="Recipient Name" value="Forex Signals Inc." />
                        <InfoRow label="Location" value="New York, USA" />
                         <div className="space-y-2">
                             <Label htmlFor="receipt-upload-wu">Upload Receipt</Label>
                             <div className="flex gap-2">
                                <Input id="receipt-upload-wu" type="file" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
                                <Button variant="secondary" size="icon"><Upload className="h-4 w-4"/></Button>
                             </div>
                             {receipt && <p className="text-xs text-muted-foreground">Selected: {receipt.name}</p>}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bank">
                    <AccordionTrigger>Bank Transfer</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <p className="text-sm">Please transfer ${service.priceAmount} to the bank account below.</p>
                        <InfoRow label="Bank Name" value="Global Trade Bank" />
                        <InfoRow label="Account Number" value="1234567890" />
                        <InfoRow label="SWIFT/BIC" value="GTBIUS33" />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="skrill">
                    <AccordionTrigger>Skrill</AccordionTrigger>
                    <AccordionContent>
                       <InfoRow label="Skrill Email" value="payment@forexsignals.com" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Button onClick={() => onOtherPaymentSubmit('Transfer')} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                I Have Paid
            </Button>
        </div>
      </TabsContent>
      
      {/* MOBILE MONEY */}
      <TabsContent value="mobile">
         <div className="space-y-4 pt-4">
            <p className="text-sm text-center text-muted-foreground">Pay with your mobile money provider.</p>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tigo">
                    <AccordionTrigger>Tigo/Yass</AccordionTrigger>
                    <AccordionContent>
                        <InfoRow label="Tigo/Yass Number" value="+255 712 345 678" />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="airtel">
                    <AccordionTrigger>Airtel</AccordionTrigger>
                    <AccordionContent>
                        <InfoRow label="Airtel Number" value="+255 789 012 345" />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="mpesa">
                    <AccordionTrigger>M-Pesa</AccordionTrigger>
                    <AccordionContent>
                       <InfoRow label="M-Pesa Number" value="+255 756 789 012" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Button onClick={() => onOtherPaymentSubmit('Mobile Money')} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                I Have Paid
            </Button>
        </div>
      </TabsContent>

    </Tabs>
  );
}

    
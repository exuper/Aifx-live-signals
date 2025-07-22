
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Loader2 } from 'lucide-react';
import { useState } from 'react';

const paymentSchema = z.object({
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

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  service: {
    title: string;
    priceAmount: number;
  };
}

export function PaymentForm({ service }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    console.log('Payment data:', data);

    toast({
      title: 'Payment Successful!',
      description: `You have successfully subscribed to ${service.title}.`,
      variant: 'default',
    });
    
    // Here you would typically close the dialog.
    // This can be handled by the parent component using onOpenChange on the Dialog.
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="0000 0000 0000 0000" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full text-lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <DollarSign className="mr-2 h-5 w-5" />
          )}
          Pay ${service.priceAmount}
        </Button>
      </form>
    </Form>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Landmark, Copy, Upload, Smartphone, Bitcoin, FileCheck2, Send } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { submitPayment } from '@/app/premium/actions';
import { getPaymentGateways, PaymentGatewaysData } from '@/app/admin/gateways/actions';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useRouter } from 'next/navigation';
import GooglePayButton from '@google-pay/button-react';
import { Separator } from './ui/separator';


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
  const [selectedMethod, setSelectedMethod] = useState('');

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

  const handleManualSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to make a payment.", variant: "destructive" });
        return;
    }
    if (!selectedMethod) {
        toast({ title: "Payment Method Required", description: "Please select a payment method from the options.", variant: "destructive" });
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
        formData.append('paymentMethod', selectedMethod);
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
                description: `Your payment proof for ${service.title} is being processed.`,
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

  const onGooglePayLoadPaymentData = (paymentData: google.payments.api.PaymentData) => {
      console.log('Load payment data', paymentData);
      
      // This is a placeholder. Here you would send the paymentData.paymentMethodData.tokenizationData.token
      // to your server, which would then use a payment processor (like Stripe) to charge the user.
      
      // After your server successfully processes the payment, you would create the subscription.
      toast({
        title: "Google Pay Success (Demo)",
        description: "Payment token received. In a real app, this would now be processed by the server."
      });

      // For this demo, we'll mark it as "submitted"
      setIsSubmitted(true);
  }
  
  if (isSubmitted) {
      return (
          <Card className="max-w-lg mx-auto bg-transparent border-none shadow-none text-center">
              <CardHeader>
                  <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                        <FileCheck2 className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Submission Received!</CardTitle>
                  <CardDescription>
                      Your payment submission for "{service.title}" has been received. An admin will verify it shortly. You can also contact an admin with your transaction details to get your access code.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                  <Button onClick={() => setIsSubmitted(false)}>Make Another Submission</Button>
              </CardContent>
          </Card>
      )
  }

  const renderPaymentOptions = (category: keyof PaymentGatewaysData, gatewayTitle: string) => {
      if (!gateways || gateways[category].length === 0) {
          return null;
      }
      return (
           <Accordion type="single" collapsible className="w-full">
                {gateways[category].map(gateway => (
                    <AccordionItem key={gateway.id} value={gateway.id}>
                        <AccordionTrigger onClick={() => setSelectedMethod(gateway.title)}>{gateway.title}</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            {gateway.details.map(detail => (
                                <InfoRow key={detail.label} label={detail.label} value={detail.value} />
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
      )
  }
  
  if (!gateways) {
    return (
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Card className="bg-background/50 border-none shadow-none">
        <CardContent className="p-0 pt-6">
            <div className="space-y-6">
                
                <div className="px-4">
                     <GooglePayButton
                        environment="TEST"
                        paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                                {
                                    type: 'CARD',
                                    parameters: {
                                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                    },
                                    tokenizationSpecification: {
                                        type: 'PAYMENT_GATEWAY',
                                        parameters: {
                                            gateway: 'example', // Replace with your payment gateway
                                            gatewayMerchantId: 'exampleGatewayMerchantId', // Replace
                                        },
                                    },
                                },
                            ],
                            merchantInfo: {
                                merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID || "your-merchant-id-here",
                                merchantName: 'AI Forex Signals Live',
                            },
                            transactionInfo: {
                                totalPriceStatus: 'FINAL',
                                totalPriceLabel: 'Total',
                                totalPrice: service.priceAmount.toString(),
                                currencyCode: 'USD',
                                countryCode: 'US',
                            },
                        }}
                        onLoadPaymentData={onGooglePayLoadPaymentData}
                        buttonColor="black"
                        buttonType="pay"
                        buttonSizeMode="fill"
                    />
                    <p className="text-xs text-muted-foreground text-center mt-2">A fast and secure way to pay.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR PAY MANUALLY</span>
                    <Separator className="flex-1" />
                </div>


                <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div>
                        <Label className="text-base font-semibold">1. Choose Manual Method</Label>
                        <p className="text-sm text-muted-foreground mb-4">Select a method and send ${service.priceAmount} to the provided details.</p>
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="crypto">
                                <AccordionTrigger className="text-lg font-headline"><Bitcoin className="mr-2"/>Crypto</AccordionTrigger>
                                <AccordionContent>
                                    {renderPaymentOptions('crypto', 'Crypto')}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="transfer">
                                <AccordionTrigger className="text-lg font-headline"><Landmark className="mr-2"/>Bank/Wire Transfer</AccordionTrigger>
                                <AccordionContent>
                                    {renderPaymentOptions('transfer', 'Transfer')}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="mobile">
                                <AccordionTrigger className="text-lg font-headline"><Smartphone className="mr-2"/>Mobile Money</AccordionTrigger>
                                <AccordionContent>
                                    {renderPaymentOptions('mobile', 'Mobile Money')}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div>
                        <Label className="text-base font-semibold">2. Submit Your Proof</Label>
                        <p className="text-sm text-muted-foreground mb-4">Fill out the details below so we can verify your payment.</p>
                        <div className="space-y-4 p-4 border rounded-md">
                            <div className="space-y-2">
                                <Label htmlFor="sender-name">Sender/Agent Name or Transaction ID</Label>
                                <Input 
                                    id="sender-name" 
                                    placeholder="e.g. John Doe or #123XYZ" 
                                    value={senderName} 
                                    onChange={(e) => setSenderName(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="receipt-upload">Upload Receipt (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input id="receipt-upload" type="file" onChange={(e) => setReceipt(e.target.files?.[0] || null)} className="pt-2 text-xs" />
                                </div>
                                {receipt && <p className="text-xs text-muted-foreground">Selected: {receipt.name}</p>}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !selectedMethod || !senderName}>
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2" />}
                        I Have Paid, Submit for Verification
                    </Button>
                </form>
            </div>
        </CardContent>
    </Card>
  );
}

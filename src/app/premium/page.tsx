import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Bitcoin, CreditCard, Landmark, MessageSquare, ShieldCheck, UploadCloud, Users } from "lucide-react";

const mentorshipNumber = '+1234567890'; // Placeholder
const mentorshipMessage = encodeURIComponent("I'm requesting mentorship. My account number is: ");

const paymentMethods = [
  { 
    name: "Mentorship Program",
    icon: Users,
    content: (
      <div className="space-y-4">
        <p>Join our exclusive mentorship program for personalized guidance, weekly one-on-one sessions, and access to our private trading group.</p>
        <p className="text-2xl font-bold text-primary">$40 / month</p>
        <Button asChild>
          <a href={`https://wa.me/${mentorshipNumber}?text=${mentorshipMessage}`} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-2 h-4 w-4" /> Request via WhatsApp
          </a>
        </Button>
      </div>
    )
  },
  { 
    name: "USDT (TRC20)",
    icon: Bitcoin,
    content: (
      <div className="space-y-4">
        <p>Send USDT on the TRC20 network to the address below.</p>
        <div className="p-4 rounded-md bg-secondary font-mono text-center">
          TXYZ...YourWalletAddress...1234
        </div>
        <p>After sending, please upload your transaction receipt.</p>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="usdt-receipt">Upload Receipt</Label>
          <Input id="usdt-receipt" type="file" />
        </div>
      </div>
    )
  },
  { 
    name: "Bank Transfer",
    icon: Landmark,
    content: (
      <div className="space-y-4">
        <p>Transfer to the following bank account:</p>
        <ul className="list-disc list-inside p-4 rounded-md bg-secondary space-y-2">
          <li><strong>Bank Name:</strong> Global Forex Bank</li>
          <li><strong>Account Name:</strong> AI Forex Signals Live</li>
          <li><strong>Account Number:</strong> 1234567890</li>
          <li><strong>SWIFT/BIC:</strong> GFBXXX</li>
        </ul>
        <p>After sending, please upload your transfer receipt.</p>
         <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="bank-receipt">Upload Receipt</Label>
          <Input id="bank-receipt" type="file" />
        </div>
      </div>
    )
  },
  {
    name: "Skrill",
    icon: CreditCard,
    content: (
       <div className="space-y-4">
        <p>Send payment to our Skrill account.</p>
        <div className="p-4 rounded-md bg-secondary font-mono text-center">
          aifx-signals@email.com
        </div>
        <p>Please include your username in the transaction notes.</p>
      </div>
    )
  },
  {
    name: "Mobile Money",
    icon: Banknote,
    content: (
      <div className="space-y-2">
        <p>Pay using one of our supported Mobile Money providers:</p>
        <ul className="list-disc list-inside p-4 rounded-md bg-secondary space-y-2">
          <li><strong>Tigo/Yas:</strong> 07...</li>
          <li><strong>Airtel:</strong> 07...</li>
          <li><strong>M-Pesa:</strong> 07...</li>
        </ul>
      </div>
    )
  }
];


export default function PremiumPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Premium & VIP Services"
        description="Unlock exclusive features, mentorship, and advanced signals."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Payment & Subscription</CardTitle>
          <CardDescription>
            Choose your preferred service and payment method below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {paymentMethods.map((method, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <method.icon className="h-6 w-6 text-primary" />
                    <span>{method.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  {method.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="font-headline">Sponsor Broker Verification</CardTitle>
          <CardDescription>Verify your sponsored broker account to track your status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-number">Broker Account Number</Label>
            <Input id="account-number" placeholder="Enter your account number" />
          </div>
          <Button>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verify Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

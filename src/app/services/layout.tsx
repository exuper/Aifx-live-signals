
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/payment-form";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Loader2 } from "lucide-react";

const services: {[key: string]: any} = {
  "premium-signals": { id: "premium_signals", title: "Premium Signals", priceAmount: 15 },
  "elite-premium": { id: "elite_premium", title: "Elite Premium", priceAmount: 100 },
  "premium-ea": { id: "premium_ea", title: "Premium EA", priceAmount: 100 },
  "mentorship": { id: "mentorship", title: "Mentorship", priceAmount: 50 }
};

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { hasSubscription, loading: subLoading } = useSubscription();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const serviceKey = pathname.split('/').pop() || '';
  const currentServiceId = services[serviceKey]?.id;

  useEffect(() => {
    const isLoading = authLoading || subLoading;
    if (!isLoading && user && currentServiceId && !hasSubscription(currentServiceId)) {
        setSelectedService(services[serviceKey]);
        setIsDialogOpen(true);
    }
  }, [authLoading, subLoading, user, hasSubscription, currentServiceId, serviceKey, pathname]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      router.push('/premium');
    }
  }

  return (
    <>
      {children}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        {selectedService && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">{selectedService.title}</DialogTitle>
              <DialogDescription>
                Your subscription for "{selectedService.title}" is not active. Please choose a payment method to subscribe.
              </DialogDescription>
            </DialogHeader>
            <PaymentForm service={selectedService} />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

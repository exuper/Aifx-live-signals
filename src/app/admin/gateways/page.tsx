
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getPaymentGateways, updatePaymentGateways, PaymentGatewaysData } from './actions';
import { Loader2, Trash2, PlusCircle, Landmark, Smartphone, Bitcoin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const gatewayDetailSchema = z.object({
  label: z.string().min(1, "Label is required."),
  value: z.string().min(1, "Value is required."),
});

const gatewaySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  details: z.array(gatewayDetailSchema),
});

const formSchema = z.object({
  crypto: z.array(gatewaySchema),
  transfer: z.array(gatewaySchema),
  mobile: z.array(gatewaySchema),
});

export default function ManageGatewaysPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PaymentGatewaysData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crypto: [],
      transfer: [],
      mobile: []
    }
  });

  const { fields: cryptoFields, append: appendCrypto, remove: removeCrypto } = useFieldArray({ control, name: "crypto" });
  const { fields: transferFields, append: appendTransfer, remove: removeTransfer } = useFieldArray({ control, name: "transfer" });
  const { fields: mobileFields, append: appendMobile, remove: removeMobile } = useFieldArray({ control, name: "mobile" });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPaymentGateways();
        reset(data);
      } catch (error) {
        toast({ title: "Error loading gateways", description: "Could not fetch payment gateway data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: PaymentGatewaysData) => {
    setIsSubmitting(true);
    try {
      await updatePaymentGateways(data);
      toast({ title: "Gateways Updated!", description: "Your payment gateway information has been saved." });
    } catch (error) {
      toast({ title: "Update Failed", description: "Could not save your changes. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Payment Gateways" description="Manage your payment provider details." />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PageHeader title="Payment Gateways" description="Manage the details for your payment providers." />

      <Tabs defaultValue="crypto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crypto"><Bitcoin className="mr-2"/>Crypto</TabsTrigger>
          <TabsTrigger value="transfer"><Landmark className="mr-2"/>Transfer</TabsTrigger>
          <TabsTrigger value="mobile"><Smartphone className="mr-2"/>Mobile</TabsTrigger>
        </TabsList>
        <TabsContent value="crypto">
          <GatewayCategoryControl fields={cryptoFields} name="crypto" register={register} control={control} errors={errors.crypto} onRemove={removeCrypto} onAdd={appendCrypto} />
        </TabsContent>
        <TabsContent value="transfer">
          <GatewayCategoryControl fields={transferFields} name="transfer" register={register} control={control} errors={errors.transfer} onRemove={removeTransfer} onAdd={appendTransfer} />
        </TabsContent>
        <TabsContent value="mobile">
          <GatewayCategoryControl fields={mobileFields} name="mobile" register={register} control={control} errors={errors.mobile} onRemove={removeMobile} onAdd={appendMobile} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </form>
  );
}

const GatewayCategoryControl = ({ fields, name, register, control, errors, onRemove, onAdd }: any) => {
  return (
    <Card className="mt-4">
      <CardContent className="p-6 space-y-6">
        {fields.map((gateway: any, index: number) => (
          <div key={gateway.id} className="p-4 border rounded-lg space-y-4 relative">
            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => onRemove(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="space-y-2">
              <Label>Gateway Title</Label>
              <Input {...register(`${name}.${index}.title`)} placeholder="e.g. USDT (TRC20)" />
              {errors?.[index]?.title && <p className="text-red-500 text-xs">{errors[index].title.message}</p>}
            </div>
            <GatewayDetailsControl gatewayIndex={index} parentName={name} control={control} register={register} errors={errors?.[index]?.details} />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => onAdd({ id: `new_${Date.now()}`, title: '', details: [{ label: '', value: '' }] })}>
          <PlusCircle className="mr-2" /> Add Gateway
        </Button>
      </CardContent>
    </Card>
  );
};

const GatewayDetailsControl = ({ gatewayIndex, parentName, control, register, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${parentName}.${gatewayIndex}.details`,
  });

  return (
    <div className="space-y-4 pl-4 border-l">
        <Label className="text-sm text-muted-foreground">Gateway Fields</Label>
      {fields.map((detail, detailIndex) => (
        <div key={detail.id} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 relative">
          <Button type="button" variant="ghost" size="icon" className="absolute -top-1 right-0 w-6 h-6 text-destructive" onClick={() => remove(detailIndex)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          <div className="space-y-1">
            <Label className="text-xs">Field Label</Label>
            <Input {...register(`${parentName}.${gatewayIndex}.details.${detailIndex}.label`)} placeholder="e.g. Wallet Address" />
             {errors?.[detailIndex]?.label && <p className="text-red-500 text-xs">{errors[detailIndex].label.message}</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Field Value</Label>
            <Input {...register(`${parentName}.${gatewayIndex}.details.${detailIndex}.value`)} placeholder="e.g. 0x123..." />
            {errors?.[detailIndex]?.value && <p className="text-red-500 text-xs">{errors[detailIndex].value.message}</p>}
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="secondary" onClick={() => append({ label: '', value: '' })}>
        <PlusCircle className="mr-2" /> Add Field
      </Button>
    </div>
  );
};

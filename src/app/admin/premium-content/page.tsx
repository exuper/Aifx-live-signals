
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { getPremiumContent, updatePremiumContent, PremiumContentData } from './actions';
import { Loader2, Bot, GraduationCap, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const premiumContentSchema = z.object({
  eaDownloadUrl: z.string().url("Must be a valid URL."),
  mentorshipContent: z.string().min(1, "Mentorship content is required."),
  elitePremiumContent: z.string().min(1, "Elite Premium content is required."),
});

export default function ManagePremiumContentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PremiumContentData>({
    resolver: zodResolver(premiumContentSchema),
    defaultValues: {
      eaDownloadUrl: '',
      mentorshipContent: '',
      elitePremiumContent: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getPremiumContent();
        reset(data);
      } catch (error) {
        toast({
          title: "Error loading content",
          description: "Could not fetch premium content data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: PremiumContentData) => {
    setIsSubmitting(true);
    try {
      await updatePremiumContent(data);
      toast({
        title: "Content Updated!",
        description: "Your premium service content has been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Manage Premium Content"
          description="Update the exclusive content for your subscribers."
        />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-8 mt-6">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PageHeader
        title="Manage Premium Content"
        description="Update the exclusive content for your subscribers."
      />

      <Tabs defaultValue="premium_ea" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="premium_ea"><Bot className="mr-2"/>Premium EA</TabsTrigger>
          <TabsTrigger value="mentorship"><GraduationCap className="mr-2"/>Mentorship</TabsTrigger>
          <TabsTrigger value="elite_premium"><Crown className="mr-2"/>Elite Premium</TabsTrigger>
        </TabsList>
        <TabsContent value="premium_ea">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Expert Advisor Download</CardTitle>
              <CardDescription>Enter the direct download link for your Premium EA file.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="eaDownloadUrl">Download URL</Label>
                <Input id="eaDownloadUrl" {...register('eaDownloadUrl')} placeholder="https://example.com/download/premium-ea.ex4" />
                {errors.eaDownloadUrl && <p className="text-red-500 text-xs">{errors.eaDownloadUrl.message}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mentorship">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Mentorship Content</CardTitle>
              <CardDescription>
                This content will be shown to users subscribed to Mentorship. Use it for welcome messages, instructions, or scheduling links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="mentorshipContent">Content</Label>
                <Textarea id="mentorshipContent" {...register('mentorshipContent')} rows={10} placeholder="Welcome to the mentorship program..." />
                {errors.mentorshipContent && <p className="text-red-500 text-xs">{errors.mentorshipContent.message}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="elite_premium">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Elite Premium Content</CardTitle>
              <CardDescription>
                This content is for your top-tier subscribers. Include all relevant info and links here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="elitePremiumContent">Content</Label>
                <Textarea id="elitePremiumContent" {...register('elitePremiumContent')} rows={10} placeholder="Welcome to the Elite club..." />
                {errors.elitePremiumContent && <p className="text-red-500 text-xs">{errors.elitePremiumContent.message}</p>}
              </div>
            </CardContent>
          </Card>
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

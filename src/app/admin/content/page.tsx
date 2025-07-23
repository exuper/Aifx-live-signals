
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { getCommunityLinks, updateCommunityLinks, CommunityLinksData } from './actions';
import { Loader2, MessageCircle, Rss } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const communityLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid URL"),
  cta: z.string().min(1, "Button text is required"),
});

const formSchema = z.object({
  whatsapp_group: communityLinkSchema,
  whatsapp_channel: communityLinkSchema,
});

export default function ManageContentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommunityLinksData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCommunityLinks();
        reset(data);
      } catch (error) {
        toast({
          title: "Error loading content",
          description: "Could not fetch community link data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: CommunityLinksData) => {
    setIsSubmitting(true);
    try {
      await updateCommunityLinks(data);
      toast({
        title: "Content Updated!",
        description: "Your community links have been saved.",
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
                title="Manage Content"
                description="Update the links for your WhatsApp communities."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Community Links</CardTitle>
                    <CardDescription>Edit the details for your community links below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-1/2" />
                   </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PageHeader
        title="Manage Content"
        description="Update the links and text for your WhatsApp communities."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Community Links</CardTitle>
          <CardDescription>
            Edit the details for your community group and channel below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* WhatsApp Group */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <MessageCircle className="w-5 h-5 text-primary" />
              WhatsApp Group
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_group.name">Name</Label>
                <Input id="whatsapp_group.name" {...register('whatsapp_group.name')} />
                {errors.whatsapp_group?.name && <p className="text-red-500 text-xs">{errors.whatsapp_group.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_group.url">URL</Label>
                <Input id="whatsapp_group.url" {...register('whatsapp_group.url')} />
                {errors.whatsapp_group?.url && <p className="text-red-500 text-xs">{errors.whatsapp_group.url.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_group.description">Description</Label>
              <Textarea id="whatsapp_group.description" {...register('whatsapp_group.description')} />
              {errors.whatsapp_group?.description && <p className="text-red-500 text-xs">{errors.whatsapp_group.description.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="whatsapp_group.cta">Button Text (CTA)</Label>
                <Input id="whatsapp_group.cta" {...register('whatsapp_group.cta')} />
                {errors.whatsapp_group?.cta && <p className="text-red-500 text-xs">{errors.whatsapp_group.cta.message}</p>}
            </div>
          </div>

          {/* WhatsApp Channel */}
          <div className="space-y-4 p-4 border rounded-lg">
             <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Rss className="w-5 h-5 text-primary" />
              WhatsApp Channel
            </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="whatsapp_channel.name">Name</Label>
                    <Input id="whatsapp_channel.name" {...register('whatsapp_channel.name')} />
                    {errors.whatsapp_channel?.name && <p className="text-red-500 text-xs">{errors.whatsapp_channel.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp_channel.url">URL</Label>
                    <Input id="whatsapp_channel.url" {...register('whatsapp_channel.url')} />
                    {errors.whatsapp_channel?.url && <p className="text-red-500 text-xs">{errors.whatsapp_channel.url.message}</p>}
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="whatsapp_channel.description">Description</Label>
              <Textarea id="whatsapp_channel.description" {...register('whatsapp_channel.description')} />
              {errors.whatsapp_channel?.description && <p className="text-red-500 text-xs">{errors.whatsapp_channel.description.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="whatsapp_channel.cta">Button Text (CTA)</Label>
                <Input id="whatsapp_channel.cta" {...register('whatsapp_channel.cta')} />
                {errors.whatsapp_channel?.cta && <p className="text-red-500 text-xs">{errors.whatsapp_channel.cta.message}</p>}
            </div>
          </div>

        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

    </form>
  );
}

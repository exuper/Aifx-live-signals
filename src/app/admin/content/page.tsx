
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { getCommunityLinks, updateCommunityLinks, CommunityLinksFormData, CommunityLinkData } from './actions';
import { Loader2, Trash2, PlusCircle, Link as LinkIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Schema for a single link
const communityLinkSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid URL"),
  cta: z.string().min(1, "Button text is required"),
  icon: z.string().min(1, "Icon name is required (e.g., MessageCircle, Rss)"),
});

// Form schema is an object containing an array of links
const formSchema = z.object({
  links: z.array(communityLinkSchema),
});

const defaultLinks: Omit<CommunityLinkData, 'id'>[] = [
    {
        name: "WhatsApp Group",
        description: "Join our interactive community group to discuss strategies, share insights, and connect with other traders.",
        url: "https://chat.whatsapp.com/yourgroupinvite",
        cta: "Join Group",
        icon: "MessageCircle"
    },
    {
        name: "WhatsApp Channel",
        description: "Subscribe to our channel for important announcements, market updates, and exclusive content from our analysts.",
        url: "https://whatsapp.com/channel/yourchannelinvite",
        cta: "Subscribe to Channel",
        icon: "Rss"
    }
];

export default function ManageContentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CommunityLinksFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      links: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links"
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getCommunityLinks();
        if (data && data.length > 0) {
            reset({ links: data });
        } else {
            // If no data, set the form with default links, giving them temporary unique IDs
            const linksWithIds = defaultLinks.map(link => ({...link, id: `new_${Date.now()}_${Math.random()}`}));
            reset({ links: linksWithIds });
        }
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

  const onSubmit = async (data: CommunityLinksFormData) => {
    setIsSubmitting(true);
    try {
      await updateCommunityLinks(data);
      toast({
        title: "Content Updated!",
        description: "Your community links have been saved.",
      });
      // After saving, we reload the data to get the new permanent IDs from Firestore
      const freshData = await getCommunityLinks();
      reset({ links: freshData });
    } catch (error) {
       console.error("Detailed update error:", error);
      toast({
        title: "Update Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewLink = () => {
    // Append a new link with a unique temporary ID
    append({
        id: `new_${Date.now()}`,
        name: 'New Link',
        description: 'A description for the new link.',
        url: 'https://example.com',
        cta: 'Learn More',
        icon: 'Link'
    });
  }
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Manage Content"
          description="Update the links for your communities."
        />
        <Card>
          <CardHeader>
            <CardTitle>Community Links</CardTitle>
            <CardDescription>Edit the details for your community links below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PageHeader
        title="Manage Content"
        description="Update the links and text for your communities."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Community Links</CardTitle>
          <CardDescription>
            Add, edit, or remove community links below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-lg relative bg-card/50">
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                    onClick={() => remove(index)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
                
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    Editing Link
                </h3>

                {/* Hidden input for the ID */}
                <input type="hidden" {...register(`links.${index}.id`)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input {...register(`links.${index}.name`)} />
                        {errors.links?.[index]?.name && <p className="text-red-500 text-xs">{errors.links[index]?.name?.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input {...register(`links.${index}.url`)} />
                        {errors.links?.[index]?.url && <p className="text-red-500 text-xs">{errors.links[index]?.url?.message}</p>}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea {...register(`links.${index}.description`)} />
                    {errors.links?.[index]?.description && <p className="text-red-500 text-xs">{errors.links[index]?.description?.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Button Text (CTA)</Label>
                        <Input {...register(`links.${index}.cta`)} />
                        {errors.links?.[index]?.cta && <p className="text-red-500 text-xs">{errors.links[index]?.cta?.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Icon Name</Label>
                        <Input {...register(`links.${index}.icon`)} placeholder="e.g. MessageCircle" />
                        {errors.links?.[index]?.icon && <p className="text-red-500 text-xs">{errors.links[index]?.icon?.message}</p>}
                    </div>
                </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addNewLink}>
            <PlusCircle className="mr-2" /> Add New Link
          </Button>

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

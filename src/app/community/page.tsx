
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Rss, Loader2, Link as LinkIcon } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface CommunityLink {
  id: string;
  name: string;
  description: string;
  url: string;
  cta: string;
  icon: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  ...LucideIcons,
  // Add any custom mappings if needed
};

export default function CommunityPage() {
  const [links, setLinks] = useState<CommunityLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communityLinks'), (snapshot) => {
      if (snapshot.empty) {
        setIsLoading(false);
        return;
      }
      const linksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityLink));
      // Ensure a consistent order
      linksData.sort((a, b) => a.name.localeCompare(b.name));
      setLinks(linksData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderCard = (link: CommunityLink) => {
    const Icon = iconMap[link.icon] || LinkIcon;
    return (
      <Card key={link.id} className="flex flex-col">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">{link.name}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-end">
          <Button asChild className="w-full">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.cta}
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Join Our Community"
        description="Connect with fellow traders and our team through our official channels."
      />

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      ) : links.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {links.map(renderCard)}
        </div>
      ) : (
         <div className="text-center text-muted-foreground py-10 border-2 border-dashed border-muted rounded-lg">
            <p className='font-semibold'>No Community Links Found</p>
            <p className='text-sm'>Community links can be added by an admin in the dashboard.</p>
          </div>
      )}
    </div>
  );
}

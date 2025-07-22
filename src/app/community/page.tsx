import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Rss } from "lucide-react";

const communityLinks = [
  {
    name: "WhatsApp Group",
    description: "Join our interactive community group to discuss strategies, share insights, and connect with other traders.",
    icon: MessageCircle,
    url: "https://chat.whatsapp.com/yourgroupinvite", // Placeholder
    cta: "Join Group"
  },
  {
    name: "WhatsApp Channel",
    description: "Subscribe to our channel for important announcements, market updates, and exclusive content directly from our analysts.",
    icon: Rss,
    url: "https://whatsapp.com/channel/yourchannelinvite", // Placeholder
    cta: "Subscribe to Channel"
  }
];

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Join Our Community"
        description="Connect with fellow traders and our team on WhatsApp."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {communityLinks.map((link) => (
          <Card key={link.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <link.icon className="w-8 h-8 text-primary" />
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
        ))}
      </div>
    </div>
  );
}

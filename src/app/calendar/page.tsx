
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const EventDataItem = ({ label, value }: { label: string, value: string | undefined }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-mono">{value || '-'}</span>
  </div>
);

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'calendarEvents'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData: CalendarEvent[] = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as CalendarEvent);
      });
      setEvents(eventsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching calendar events:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Economic Calendar"
        description="Key economic events that could impact the Forex market."
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full md:hidden" />
          <Skeleton className="h-40 w-full md:hidden" />
          <Skeleton className="h-64 w-full hidden md:block" />
        </div>
      ) : (
        <>
          {/* Mobile View: List of Cards */}
          <div className="space-y-4 md:hidden">
            {events.map((event) => (
              <Card key={`mobile-${event.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="font-headline text-lg">{event.event}</CardTitle>
                      <div className="text-sm text-muted-foreground">{event.time}</div>
                    </div>
                    <Badge variant="outline">{event.currency}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Impact</span>
                      <Badge variant="secondary" className={cn({
                          'bg-red-500/20 text-red-400 border-red-500/30': event.impact === 'High',
                          'bg-orange-500/20 text-orange-400 border-orange-500/30': event.impact === 'Medium',
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': event.impact === 'Low',
                        })}>
                          {event.impact}
                        </Badge>
                  </div>
                  <Separator />
                  <EventDataItem label="Actual" value={event.actual} />
                  <EventDataItem label="Forecast" value={event.forecast} />
                  <EventDataItem label="Previous" value={event.previous} />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Desktop View: Table */}
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Impact</TableHead>
                      <TableHead className="w-[40%]">Event</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Forecast</TableHead>
                      <TableHead>Previous</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={`desktop-${event.id}`}>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.currency}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn({
                            'bg-red-500/20 text-red-400 border-red-500/30': event.impact === 'High',
                            'bg-orange-500/20 text-orange-400 border-orange-500/30': event.impact === 'Medium',
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': event.impact === 'Low',
                          })}>
                            {event.impact}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.event}</TableCell>
                        <TableCell className="font-mono">{event.actual || '-'}</TableCell>
                        <TableCell className="font-mono">{event.forecast || '-'}</TableCell>
                        <TableCell className="font-mono">{event.previous || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

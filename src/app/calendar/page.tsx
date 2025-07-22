import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calendarEvents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Economic Calendar"
        description="Key economic events that could impact the Forex market."
      />
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
              {calendarEvents.map((event) => (
                <TableRow key={event.id}>
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
  );
}

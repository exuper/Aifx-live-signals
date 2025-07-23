
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CalendarEvent } from '@/lib/mock-data';
import { PageHeader } from '@/components/page-header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './actions';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const eventSchema = z.object({
  id: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be in HH:MM format"),
  currency: z.string().min(3, "Currency is required").toUpperCase(),
  impact: z.enum(['High', 'Medium', 'Low']),
  event: z.string().min(1, "Event name is required"),
  actual: z.string().optional(),
  forecast: z.string().optional(),
  previous: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function ManageCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });
  
  useEffect(() => {
    const q = query(collection(db, "calendarEvents"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData: CalendarEvent[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventsData.push({ 
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate() 
        } as unknown as CalendarEvent);
      });
      setEvents(eventsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openEditDialog = (event: CalendarEvent) => {
    setEditingEvent(event);
    reset({
      ...event,
      date: (event.date as unknown as Timestamp).toDate(),
      actual: event.actual ?? '',
      forecast: event.forecast ?? '',
      previous: event.previous ?? '',
    });
    setIsDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setEditingEvent(null);
    reset({
      id: undefined,
      date: new Date(),
      time: '',
      currency: '',
      impact: 'Medium',
      event: '',
      actual: '',
      forecast: '',
      previous: '',
    });
    setIsDialogOpen(true);
  }

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateCalendarEvent(editingEvent.id, data);
        toast({ title: "Event Updated!", description: "The calendar event has been successfully updated." });
      } else {
        await createCalendarEvent(data);
        toast({ title: "Event Created!", description: "The new event has been added to the calendar." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save the event. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
      if (!eventToDelete) return;
      try {
          await deleteCalendarEvent(eventToDelete);
          toast({ title: "Event Deleted", description: "The event has been permanently removed." });
          setEventToDelete(null);
      } catch (error) {
           toast({ title: "Error", description: "Failed to delete the event.", variant: "destructive" });
      }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Manage Calendar Events"
          description="Add, edit, or delete economic events."
        />
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2" />
          Create New Event
        </Button>
      </div>

      <EventFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        editingEvent={editingEvent}
        control={control}
        errors={errors}
        register={register}
      />
      
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event from the calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Calendar Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No events found.</p>
          ) : (
            <div className="space-y-4">
                {events.map((event) => (
                    <Card key={event.id} className="w-full overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 bg-muted/50">
                            <div>
                                <CardTitle className="font-headline text-lg">{event.event}</CardTitle>
                                <div className="text-sm text-muted-foreground">{format(event.date as unknown as Date, 'PPP')} @ {event.time}</div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Badge variant="outline">{event.currency}</Badge>
                                <Badge variant="secondary" className={cn({
                                'bg-red-500/20 text-red-400 border-red-500/30': event.impact === 'High',
                                'bg-orange-500/20 text-orange-400 border-orange-500/30': event.impact === 'Medium',
                                'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': event.impact === 'Low',
                                })}>
                                {event.impact}
                                </Badge>
                             </div>
                        </CardHeader>
                         <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">Actual</span>
                                <span className="font-mono">{event.actual || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">Forecast</span>
                                <span className="font-mono">{event.forecast || '-'}</span>
                            </div>
                             <div className="flex flex-col">
                                <span className="text-muted-foreground">Previous</span>
                                <span className="font-mono">{event.previous || '-'}</span>
                            </div>
                         </CardContent>
                         <CardFooter className="bg-muted/50 p-2 flex justify-end gap-2">
                             <Button variant="ghost" size="sm" onClick={() => openEditDialog(event)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setEventToDelete(event.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                         </CardFooter>
                    </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EventFormDialog({isOpen, setIsOpen, onSubmit, isSubmitting, editingEvent, control, errors, register}: any) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-2xl">
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </AlertDialogTitle>
            <CardDescription>
              Fill in the details for the economic calendar event.
            </CardDescription>
          </AlertDialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                 <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time (HH:MM)</Label>
                <Input id="time" {...register('time')} placeholder="e.g. 08:30" />
                {errors.time && <p className="text-red-500 text-xs">{errors.time.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event Name</Label>
              <Textarea id="event" {...register('event')} placeholder="e.g. Non-Farm Employment Change" />
              {errors.event && <p className="text-red-500 text-xs">{errors.event.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" {...register('currency')} placeholder="e.g. USD"/>
                  {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message as string}</p>}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Controller
                    name="impact"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="actual">Actual</Label>
                    <Input id="actual" {...register('actual')} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="forecast">Forecast</Label>
                    <Input id="forecast" {...register('forecast')} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="previous">Previous</Label>
                    <Input id="previous" {...register('previous')} />
                </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    
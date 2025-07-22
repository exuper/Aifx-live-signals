import { PageHeader } from "@/components/page-header";
import { SignalCard } from "@/components/signal-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signals } from "@/lib/mock-data";

export default function Home() {
  const activeSignals = signals.filter((signal) => signal.status === 'Active');
  const expiredSignals = signals.filter((signal) => signal.status === 'Expired');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Signals"
        description="Real-time Forex signals. Stay updated with the latest market movements."
      />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="active">Active Signals</TabsTrigger>
          <TabsTrigger value="expired">Signal History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeSignals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {activeSignals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-muted-foreground">
              No active signals at the moment.
            </div>
          )}
        </TabsContent>
        <TabsContent value="expired">
          {expiredSignals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {expiredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
          ) : (
            <div className="mt-8 text-center text-muted-foreground">
              No expired signals found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

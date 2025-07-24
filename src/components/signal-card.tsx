import { Signal } from "@/lib/mock-data";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Star } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

type SignalCardProps = {
  signal: Signal;
};

const InfoPill = ({ label, value, className }: { label: string, value: string | number, className?: string }) => (
    <div className="flex flex-col items-center">
        <div className={cn("text-xs px-4 py-1 rounded-full w-full text-center font-semibold", className)}>
            {value}
        </div>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
);

export function SignalCard({ signal }: SignalCardProps) {
  const isBuy = signal.action === 'BUY';
  const isActive = signal.status === 'Active';

  const formatTimestamp = (timestamp: Timestamp | Date) => {
    if (!timestamp) return { date: 'N/A', time: 'N/A' };
    const dateObj = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return { date, time };
  };

  const { date, time } = formatTimestamp(signal.createdAt as any);

  return (
    <Card className={cn("flex flex-col", isActive ? "" : "opacity-60")}>
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
            <div className={cn("flex items-center font-bold", isBuy ? "text-green-400" : "text-red-400")}>
                {isBuy ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                <span className="ml-1">{signal.action}</span>
            </div>
            <p className="font-bold text-lg text-center font-headline flex items-center justify-center gap-2">
              {signal.pair}
              {signal.isPremium && <Star className="w-4 h-4 text-yellow-400" />}
            </p>
            <p className="font-mono text-lg">{signal.entry}</p>
        </div>

        <div className="text-xs text-muted-foreground text-center">
            <span>{date}</span> <span className="ml-2">{time}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
            <InfoPill 
                label="Status" 
                value={signal.status} 
                className={cn(isActive ? (isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400') : 'bg-muted text-muted-foreground')}
            />
             <InfoPill 
                label="TP1" 
                value={signal.takeProfit1} 
                className="bg-secondary text-foreground"
            />
             <InfoPill 
                label="SL" 
                value={signal.stopLoss} 
                className="bg-secondary text-foreground"
            />
        </div>
      </CardContent>
    </Card>
  );
}

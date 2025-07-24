import { Signal } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Star } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import { Badge } from "./ui/badge";

type SignalCardProps = {
  signal: Signal;
};

const InfoPill = ({ label, value, className }: { label: string, value: string | number, className?: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={cn("text-sm px-2 py-0.5 rounded-md w-full text-center font-semibold font-mono", className)}>
            {value}
        </div>
    </div>
);

export function SignalCard({ signal }: SignalCardProps) {
  const isBuy = signal.action === 'BUY';
  const isActive = signal.status === 'Active';

  const formatTimestamp = (timestamp: Timestamp | Date) => {
    if (!timestamp) return { date: 'N/A', time: 'N/A' };
    const dateObj = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const { date, time } = formatTimestamp(signal.createdAt as any);

  return (
    <Card className={cn("flex flex-col", isActive ? "" : "opacity-60")}>
       <CardHeader className="p-3">
         <div className="flex justify-between items-center">
            <div className={cn("flex items-center font-bold text-lg", isBuy ? "text-green-400" : "text-red-400")}>
                {isBuy ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                <span className="ml-1">{signal.action}</span>
            </div>
             <Badge variant={isActive ? 'default' : 'secondary'} className={cn(isActive ? (isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400') : 'bg-muted text-muted-foreground')}>
                {signal.status}
            </Badge>
         </div>
         <div className="flex justify-between items-baseline">
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                {signal.pair}
                {signal.isPremium && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            </CardTitle>
            <div className="text-xs text-muted-foreground">
                <span>{date}</span> <span className="ml-1">{time}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-dashed">
             <InfoPill 
                label="Entry" 
                value={signal.entry}
            />
             <InfoPill 
                label="SL" 
                value={signal.stopLoss} 
                className="text-red-400"
            />
             <InfoPill 
                label="TP1" 
                value={signal.takeProfit1} 
                className="text-green-400"
            />
             <InfoPill 
                label="TP2" 
                value={signal.takeProfit2} 
                className="text-green-400"
            />
        </div>
      </CardContent>
    </Card>
  );
}

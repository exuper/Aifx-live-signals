import { Signal } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";

type SignalCardProps = {
  signal: Signal;
};

export function SignalCard({ signal }: SignalCardProps) {
  const isBuy = signal.action === 'BUY';
  const isActive = signal.status === 'Active';

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    // Firebase timestamps can be seconds/nanoseconds objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };


  return (
    <Card className={cn("flex flex-col", isActive ? "border-primary/50" : "opacity-70")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-2xl">{signal.pair}</CardTitle>
          <Badge variant={isBuy ? "default" : "destructive"} className={cn(
            isBuy ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
            "text-white"
          )}>
            {isBuy ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            {signal.action}
          </Badge>
        </div>
        <CardDescription>Entry Price: {signal.entry}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-center p-3 rounded-md bg-secondary">
          <span className="text-muted-foreground">Stop Loss</span>
          <span className="font-mono text-red-400">{signal.stopLoss}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 rounded-md bg-secondary">
            <span className="text-muted-foreground">Take Profit 1</span>
            <span className="font-mono text-green-400">{signal.takeProfit1}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-md bg-secondary">
            <span className="text-muted-foreground">Take Profit 2</span>
            <span className="font-mono text-green-400">{signal.takeProfit2}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant={isActive ? "outline" : "secondary"} className={cn(isActive && "border-primary text-primary")}>
          {signal.status}
        </Badge>
         <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {/* Format timestamp if it exists */}
          {signal.createdAt && formatTimestamp(signal.createdAt)}
        </div>
      </CardFooter>
    </Card>
  );
}

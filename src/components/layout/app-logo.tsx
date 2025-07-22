import { Bot } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <Bot className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold font-headline text-foreground">
        AI Forex Signals
      </h1>
    </div>
  );
}

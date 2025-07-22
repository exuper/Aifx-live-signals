'use client';

import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { AppLogo } from "./app-logo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <AppLogo />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle alerts</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none font-headline">Alerts</h4>
              <p className="text-sm text-muted-foreground">
                You have no new notifications.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}

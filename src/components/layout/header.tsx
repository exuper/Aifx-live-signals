
'use client';

import { Bell, LogOut, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { AppLogo } from "./app-logo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { handleSignOut } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const onSignOut = async () => {
    await handleSignOut();
    router.push('/');
  }

  const renderAuthControls = () => {
    if (loading) {
      return null;
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Profile</DropdownMenuItem>
              <DropdownMenuItem disabled>Billing</DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  };
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <AppLogo />
      </div>
      {renderAuthControls()}
    </header>
  );
}


'use client';

import { Bell, LogOut, Menu, User, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { AppLogo } from "./app-logo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { handleSignOut } from "@/app/auth/actions";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils";


const navItems = [
  { href: '/', label: 'Signals' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/trading-plan', label: 'Trading Plan' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/premium', label: 'Premium' },
  { href: '/community', label: 'Community' },
];

function DesktopNav() {
    const pathname = usePathname();
     const getIsActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="flex items-center gap-4">
            {navItems.map(item => (
                 <Link 
                    href={item.href} 
                    key={item.href}
                    className={cn("p-2 text-lg font-semibold transition-colors", 
                        getIsActive(item.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const onSignOut = async () => {
    await handleSignOut();
    router.push('/login');
  }
  
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  const renderAuthControls = () => {
    if (loading) {
      return <Skeleton className="h-8 w-24" />;
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
              <DropdownMenuItem asChild>
                <Link href="/account/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="flex flex-col gap-4 py-8">
                         {navItems.map(item => (
                            <Link href={item.href} key={item.href} className="text-2xl font-bold font-headline">{item.label}</Link>
                         ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        <div className="hidden md:block">
            <AppLogo />
        </div>
      </div>
       <div className="hidden md:flex">
          <DesktopNav />
        </div>
      {renderAuthControls()}
    </header>
  );
}

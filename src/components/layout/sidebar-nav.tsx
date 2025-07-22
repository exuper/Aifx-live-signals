'use client';

import { BarChart2, BotMessageSquare, Calendar, ShieldCheck, Users, LandPlot } from "lucide-react";
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { AppLogo } from "./app-logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: '/', icon: BarChart2, label: 'Live Signals' },
  { href: '/analysis', icon: BotMessageSquare, label: 'Chart Analysis' },
  { href: '/calendar', icon: Calendar, label: 'Economic Calendar' },
  { href: '/premium', icon: ShieldCheck, label: 'Premium / VIP' },
  { href: '/community', icon: Users, label: 'Community' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4 border-b">
         {/* Logo removed from here as it's in the header now. Can be re-added if needed for desktop expanded sidebar */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                  <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

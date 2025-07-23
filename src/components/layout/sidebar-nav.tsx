
'use client';

import { BarChart2, BotMessageSquare, Calendar, ShieldCheck, Users, LayoutDashboard, Settings } from "lucide-react";
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AppLogo } from "./app-logo";

const navItems = [
  { href: '/', icon: BarChart2, label: 'Live Signals' },
  { href: '/analysis', icon: BotMessageSquare, label: 'Chart Analysis' },
  { href: '/calendar', icon: Calendar, label: 'Economic Calendar' },
  { href: '/premium', icon: ShieldCheck, label: 'Premium / VIP' },
  { href: '/community', icon: Users, label: 'Community' },
];

const adminItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/signals', icon: BarChart2, label: 'Manage Signals' },
    { href: '/admin/calendar', icon: Calendar, label: 'Manage Calendar' },
]

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4 border-b">
         <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <p className="text-xs text-muted-foreground px-4 py-2 font-semibold">MENU</p>
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
           <p className="text-xs text-muted-foreground px-4 py-2 mt-4 font-semibold">ADMIN</p>
           {adminItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)} tooltip={item.label}>
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

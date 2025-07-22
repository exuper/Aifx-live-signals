'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, BotMessageSquare, Calendar, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: BarChart2, label: 'Signals' },
  { href: '/analysis', icon: BotMessageSquare, label: 'Analysis' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/premium', icon: ShieldCheck, label: 'Premium' },
  { href: '/community', icon: Users, label: 'Community' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 border-t bg-background/80 backdrop-blur-sm md:hidden">
      {navItems.map((item) => (
        <Link href={item.href} key={item.href} passHref>
          <div
            className={cn(
              'flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors',
              pathname === item.href
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}

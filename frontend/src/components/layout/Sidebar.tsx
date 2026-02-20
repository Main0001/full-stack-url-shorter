'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Мои ссылки', icon: LayoutDashboard },
  { href: '/dashboard/create', label: 'Создать ссылку', icon: Plus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-full border-r bg-background p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
              pathname === href
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

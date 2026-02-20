'use client';

import { MousePointerClick, Globe, Monitor, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { StatsSummary } from '@/types';

type Props = { summary: StatsSummary };

export function StatsSummaryCards({ summary }: Props) {
  const topBrowser = summary.byBrowser[0]?.browser ?? '—';
  const topOs = summary.byOs[0]?.os ?? '—';
  const countriesCount = summary.byCountry.length;

  const cards = [
    {
      label: 'Total clicks',
      value: summary.total,
      icon: MousePointerClick,
    },
    {
      label: 'Countries',
      value: countriesCount,
      icon: Globe,
    },
    {
      label: 'Top browser',
      value: topBrowser,
      icon: Monitor,
    },
    {
      label: 'Top OS',
      value: topOs,
      icon: Smartphone,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </div>
            <p className="truncate text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

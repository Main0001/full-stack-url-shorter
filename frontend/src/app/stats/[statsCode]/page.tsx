'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats, fetchSummary, clearStats } from '@/store/slices/statsSlice';
import { StatsSummaryCards } from '@/components/stats/StatsSummaryCards';
import { ClicksTable } from '@/components/stats/ClicksTable';
import { ClicksByDateChart } from '@/components/stats/ClicksByDateChart';
import { ClicksByBrowserChart } from '@/components/stats/ClicksByBrowserChart';
import { ClicksByOsChart } from '@/components/stats/ClicksByOsChart';
import { ClicksByCountryChart } from '@/components/stats/ClicksByCountryChart';
import { ClicksByCityChart } from '@/components/stats/ClicksByCityChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatsPage() {
  const { statsCode } = useParams<{ statsCode: string }>();
  const dispatch = useAppDispatch();
  const { stats, summary, loading, error } = useAppSelector((state) => state.stats);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSummary(statsCode));
    return () => { dispatch(clearStats()); };
  }, [dispatch, statsCode]);

  useEffect(() => {
    dispatch(fetchStats({ statsCode, page, limit: 10 }));
  }, [dispatch, statsCode, page]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-7xl font-bold text-muted-foreground/30">404</p>
        <h1 className="text-2xl font-semibold">Stats not found</h1>
        <p className="text-muted-foreground">
          This stats link doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Link Statistics</h1>
          {summary ? (
            <a
              href={summary.link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate text-sm text-muted-foreground hover:underline"
            >
              {summary.link.originalUrl}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          ) : (
            <Skeleton className="h-4 w-64" />
          )}
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      {summary ? (
        <StatsSummaryCards summary={summary} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {/* Charts */}
      {summary && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clicks over time</CardTitle>
            </CardHeader>
            <CardContent>
              <ClicksByDateChart data={summary.byDate} />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By browser</CardTitle>
              </CardHeader>
              <CardContent>
                <ClicksByBrowserChart data={summary.byBrowser} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By OS</CardTitle>
              </CardHeader>
              <CardContent>
                <ClicksByOsChart data={summary.byOs} />
              </CardContent>
            </Card>
          </div>

          {summary.byCountry.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By country</CardTitle>
              </CardHeader>
              <CardContent>
                <ClicksByCountryChart data={summary.byCountry} />
              </CardContent>
            </Card>
          )}

          {summary.byCity.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By city</CardTitle>
              </CardHeader>
              <CardContent>
                <ClicksByCityChart data={summary.byCity} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Clicks table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Click history</h2>
        {loading && !stats ? (
          <Skeleton className="h-48 w-full rounded-md" />
        ) : stats ? (
          <ClicksTable stats={stats} onPageChange={setPage} />
        ) : null}
      </div>

    </div>
  );
}

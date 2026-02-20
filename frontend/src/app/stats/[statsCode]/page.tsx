'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats, fetchSummary, clearStats } from '@/store/slices/statsSlice';
import { StatsSummaryCards } from '@/components/stats/StatsSummaryCards';
import { ClicksTable } from '@/components/stats/ClicksTable';
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      {/* Header */}
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

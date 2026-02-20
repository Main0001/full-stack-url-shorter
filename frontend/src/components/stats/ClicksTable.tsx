'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { StatsResponse } from '@/types';

type Props = {
  stats: StatsResponse;
  onPageChange: (page: number) => void;
};

export function ClicksTable({ stats, onPageChange }: Props) {
  const { data, page, totalPages, total } = stats;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No clicks recorded yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((click) => (
                <TableRow key={click.id}>
                  <TableCell className="text-sm">{formatDate(click.createdAt)}</TableCell>
                  <TableCell className="text-sm">{click.country ?? '—'}</TableCell>
                  <TableCell className="text-sm">{click.city ?? '—'}</TableCell>
                  <TableCell className="text-sm">{click.browser ?? '—'}</TableCell>
                  <TableCell className="text-sm">{click.os ?? '—'}</TableCell>
                  <TableCell className="text-sm">{click.device ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

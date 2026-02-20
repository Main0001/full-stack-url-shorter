'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLinks } from '@/store/slices/linksSlice';
import { LinkCard } from './LinkCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function LinkList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.links);

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">You haven&apos;t created any links yet.</p>
        <Link href="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create your first link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Trash2, ExternalLink } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { deleteLink } from '@/store/slices/linksSlice';
import type { Link } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Props = { link: Link };

export function LinkCard({ link }: Props) {
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteLink(link.id));
    if (deleteLink.rejected.match(result)) {
      toast.error(result.payload ?? 'Failed to delete link');
      setDeleting(false);
    }
  };

  const formattedDate = new Date(link.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        {/* Original URL + click count */}
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 truncate text-sm font-medium" title={link.originalUrl}>
            {link.originalUrl}
          </p>
          <Badge variant="secondary" className="shrink-0">
            {link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}
          </Badge>
        </div>

        {/* Short URL */}
        <div className="flex items-center gap-2">
          <span className="w-10 shrink-0 text-xs text-muted-foreground">Short</span>
          <span className="flex-1 truncate font-mono text-sm">{link.shortUrl}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => copy(link.shortUrl, 'Short URL')}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Stats URL */}
        <div className="flex items-center gap-2">
          <span className="w-10 shrink-0 text-xs text-muted-foreground">Stats</span>
          <span className="flex-1 truncate font-mono text-sm">{link.statsUrl}</span>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => copy(link.statsUrl, 'Stats URL')}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <a href={link.statsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Footer: date + delete */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

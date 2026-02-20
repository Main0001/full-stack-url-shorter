'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createLink } from '@/store/slices/linksSlice';
import type { Link } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  originalUrl: z.url('Enter a valid URL'),
});

type FormValues = z.infer<typeof schema>;

export function CreateLinkForm() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.links.loading);
  const [createdLink, setCreatedLink] = useState<Link | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { originalUrl: '' },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(createLink(values));

    if (createLink.fulfilled.match(result)) {
      setCreatedLink(result.payload);
      toast.success('Link created!');
      form.reset();
    } else {
      toast.error(result.payload ?? 'Failed to create link');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (createdLink) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Short URL</Label>
          <div className="flex gap-2">
            <Input readOnly value={createdLink.shortUrl} className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(createdLink.shortUrl, 'Short URL')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Stats URL</Label>
          <div className="flex gap-2">
            <Input readOnly value={createdLink.statsUrl} className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(createdLink.statsUrl, 'Stats URL')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <Button variant="outline" className="w-full" onClick={() => setCreatedLink(null)}>
          Create another link
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="originalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/very/long/url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create short link'}
        </Button>
      </form>
    </Form>
  );
}

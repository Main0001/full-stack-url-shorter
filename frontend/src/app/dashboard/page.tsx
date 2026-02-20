import Link from 'next/link';
import { Plus } from 'lucide-react';
import { LinkList } from '@/components/links/LinkList';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Links</h1>
        <Link href="/dashboard/create">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New link
          </Button>
        </Link>
      </div>
      <LinkList />
    </div>
  );
}

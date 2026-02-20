import { CreateLinkForm } from '@/components/links/CreateLinkForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateLinkPage() {
  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">Create Link</h1>
      <Card>
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>
            Paste a long URL to get a short link and a stats page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLinkForm />
        </CardContent>
      </Card>
    </div>
  );
}

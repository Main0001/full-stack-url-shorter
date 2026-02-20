import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?&nbsp;
        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
          Register
        </Link>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function Home() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) return;
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [initialized, isAuthenticated, router]);

  return null;
}

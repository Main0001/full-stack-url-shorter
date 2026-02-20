'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';

export function AuthInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
}

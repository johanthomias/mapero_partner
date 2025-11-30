"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function useProfile() {
  const { user, fetchProfile, token, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user && token) {
      void fetchProfile();
    }
  }, [user, token, fetchProfile]);

  return { user, isLoading };
}

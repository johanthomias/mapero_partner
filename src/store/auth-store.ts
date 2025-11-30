"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, authApi } from '@/lib/api';
import type { AuthResponse, LoginPayload, PartnerUser, RegisterPayload } from '@/lib/types';

interface AuthState {
  user?: PartnerUser;
  tokens?: AuthResponse['tokens'];
  isLoading: boolean;
  error?: string;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

const setAuthHeader = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: undefined,
      tokens: undefined,
      isLoading: false,
      error: undefined,
      login: async (payload) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await authApi.login(payload);
          setAuthHeader(response.tokens.token);
          set({ user: response.user, tokens: response.tokens });
        } catch (error: any) {
          set({
            error: error?.response?.data?.message ?? error?.message ?? 'Impossible de se connecter',
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (payload) => {
        set({ isLoading: true, error: undefined });
        try {
          const response = await authApi.register(payload);
          setAuthHeader(response.tokens.token);
          set({ user: response.user, tokens: response.tokens });
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message ?? error?.message ?? 'Impossible de créer le compte',
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      fetchCurrentUser: async () => {
        const { tokens } = get();
        if (!tokens?.token) return;
        set({ isLoading: true });
        try {
          const user = await authApi.me();
          set({ user });
        } catch (error: any) {
          set({ error: error?.response?.data?.message ?? 'Session expirée' });
          setAuthHeader(undefined);
          set({ tokens: undefined, user: undefined });
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          setAuthHeader(undefined);
          set({ user: undefined, tokens: undefined });
        }
      },
      resetError: () => set({ error: undefined }),
    }),
    {
      name: 'mapero-partner-auth',
      partialize: (state) => ({ tokens: state.tokens, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.tokens?.token) {
          setAuthHeader(state.tokens.token);
        }
      },
    },
  ),
);

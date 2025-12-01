import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (values: { email: string; password: string }) => Promise<void>;
  register: (values: any) => Promise<void>;
  logout: () => void;

  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (values) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login(values);
      set({ user: res.user, token: res.tokens.token });
    } catch (err: any) {
      set({ error: err.message ?? 'Erreur de connexion' });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (values) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.register(values);
      set({ user: res.user, token: res.tokens.token });
    } catch (err: any) {
      set({ error: err.message ?? 'Erreur lors de l’inscription' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
  },

fetchProfile: async () => {
  const token = get().token;
  if (!token) return;

  set({ isLoading: true });

  try {
    const user = await authApi.profile();
    set({ user });
  } catch (err: any) {
    set({ error: err.message ?? 'Impossible de charger le profil' });
  } finally {
    set({ isLoading: false });
  }
},

}));

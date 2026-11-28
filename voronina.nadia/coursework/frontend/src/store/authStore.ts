import {create} from 'zustand';

import {login, logout, getCurrentUser} from '../api/auth';
import {ApiError} from '../api/client';
import type {User, LoginRequest} from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    set({isLoading: true, error: null});

    try {
      const user = await getCurrentUser();

      set({user});
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        set({user: null});
      } else {
        set({
          user: null,
          error: 'Не удалось проверить авторизацию',
        });
      }
    } finally {
      set({isLoading: false});
    }
  },

  login: async (data) => {
    const user = await login(data);

    set({user, error: null});
  },

  logout: async () => {
    await logout();

    set({user: null, error: null});
  },
}));

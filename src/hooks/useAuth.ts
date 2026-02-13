'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
}

/**
 * 인증 상태 관리 스토어
 * zustand + persist로 세션 유지 관리
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token, rememberMe = false) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        // rememberMe가 false면 sessionStorage 사용 (브라우저 닫으면 삭제)
        if (!rememberMe) {
          // persist middleware가 localStorage를 사용하므로
          // 브라우저 닫을 때 삭제되도록 beforeunload 이벤트 등록
          if (typeof window !== 'undefined') {
            const handleUnload = () => {
              localStorage.removeItem('auth-storage');
            };
            window.addEventListener('beforeunload', handleUnload);
          }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * 인증 상태 훅
 * 컴포넌트에서 사용하기 쉽게 래핑
 */
export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setLoading,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setLoading,
  };
}

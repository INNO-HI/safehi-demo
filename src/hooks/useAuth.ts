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

// 전역 핸들러 참조 저장소
const unloadHandlers: { handler?: (() => void) } = {};

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
          if (typeof window !== 'undefined') {
            // 이전 리스너 교체를 위해 기존 핸들러 제거
            if (unloadHandlers.handler) {
              window.removeEventListener('beforeunload', unloadHandlers.handler);
            }
            const handleUnload = () => {
              localStorage.removeItem('auth-storage');
            };
            unloadHandlers.handler = handleUnload;
            window.addEventListener('beforeunload', handleUnload);
          }
        } else {
          // rememberMe=true면 기존 unload 핸들러 제거
          if (typeof window !== 'undefined' && unloadHandlers.handler) {
            window.removeEventListener('beforeunload', unloadHandlers.handler);
            unloadHandlers.handler = undefined;
          }
        }
      },

      logout: () => {
        // beforeunload 리스너 정리
        if (typeof window !== 'undefined' && unloadHandlers.handler) {
          window.removeEventListener('beforeunload', unloadHandlers.handler);
          unloadHandlers.handler = undefined;
        }
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
      onRehydrateStorage: () => {
        return (state) => {
          // 스토리지 복원 후 isLoading을 false로 설정
          if (state) {
            state.isLoading = false;
          }
        };
      },
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

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
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
      isLoading: false,

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
        return (_state, error) => {
          // 스토리지 복원이 끝나면 항상 isLoading=false (에러 무관)
          useAuthStore.setState({ isLoading: false });
          void error;
        };
      },
      // SSG 시 hydration이 클라이언트에서만 발생하므로 skipHydration은 사용하지 않음
      // (skipHydration: false가 기본)
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

  // Zustand persist hydration 완료까지 isLoading=true로 처리
  // (SSG/SSR HTML과 localStorage 복원 사이의 race condition 방지)
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || !isHydrated,
    login,
    logout,
    setLoading,
  };
}

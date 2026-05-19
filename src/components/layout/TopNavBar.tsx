'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';


// 알림 타입
interface NotiItem {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

// 초기 알림 데이터
const initialNotifications: NotiItem[] = [
  { id: '1', message: '김영희님 방문 일정이 30분 후입니다.', time: '10분 전', read: false },
  { id: '2', message: '이순자님 건강 체크 보고서가 도착했습니다.', time: '1시간 전', read: false },
  { id: '3', message: '박철수님 긴급 메모가 등록되었습니다.', time: '3시간 전', read: true },
];

/**
 * 상단 네비게이션 바
 * 로고 + 알림 + 프로필
 */
export function TopNavBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotiItem[]>(initialNotifications);
  const profileRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  const notificationCount = notifications.filter((n) => !n.read).length;

  // 알림 읽음 처리
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showProfileMenu || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu, showNotifications]);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    router.push('/login');
  };

  const handleProfileEdit = () => {
    setShowProfileMenu(false);
    router.push('/settings');
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setShowProfileMenu(false);
  };

  const handleProfileToggle = () => {
    setShowProfileMenu((prev) => !prev);
    setShowNotifications(false);
  };

  return (
    <>
      {/* 네비바 */}
      <header
        className="flex items-center justify-between mx-3 lg:mx-6 mt-4 pl-16 pr-4 lg:px-6 py-3 bg-white rounded-2xl shadow-lg border border-neutral-border"
      >
        {/* 왼쪽: 검색 */}
        <div className="relative flex-1 max-w-[400px]">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-text-tertiary pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="검색..."
            className="w-full h-10 pl-11 pr-4 text-sm bg-white rounded-full border border-neutral-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-text-tertiary"
          />
        </div>

        {/* 오른쪽: 알림 + 프로필 */}
        <div className="flex items-center gap-4">
          {/* 알림 버튼 + 드롭다운 */}
          <div className="relative" ref={notiRef}>
            <button
              type="button"
              onClick={handleNotificationClick}
              aria-label={`알림 ${notificationCount}개`}
              className="
                relative flex items-center justify-center
                w-10 h-10 rounded-lg
                text-[#2B2F36] hover:bg-neutral-bg
                transition-colors duration-200
              "
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-semibold bg-primary text-white">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-neutral-border z-50">
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border">
                  <span className="text-base font-semibold text-[#2B2F36]">알림</span>
                  <span className="text-sm text-primary font-medium">{notificationCount}개 읽지 않음</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((noti) => (
                    <div
                      key={noti.id}
                      className={`flex items-start gap-3 px-5 py-4 border-b border-neutral-border last:border-b-0 ${
                        !noti.read ? 'bg-primary-bg/30' : ''
                      }`}
                    >
                      {/* 읽지 않음 표시 */}
                      <div className="w-3 pt-1.5 shrink-0">
                        {!noti.read && (
                          <span className="block w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>

                      {/* 알림 내용 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#2B2F36] leading-relaxed">{noti.message}</p>
                        <p className="text-xs text-neutral-text-tertiary mt-1.5">{noti.time}</p>
                      </div>

                      {/* 체크(읽음) 버튼 */}
                      {!noti.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(noti.id)}
                          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-text-sub hover:bg-neutral-bg hover:text-primary transition-colors"
                          aria-label="읽음 처리"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-neutral-border">
                  <button
                    type="button"
                    className="w-full text-center text-sm text-primary font-medium hover:underline min-h-[44px]"
                  >
                    모든 알림 보기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 프로필 버튼 + 드롭다운 */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={handleProfileToggle}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity rounded-full"
            >
              <span
                aria-hidden="true"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-semibold text-base"
              >
                {(user?.name || '').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-[#2B2F36]">{user?.name}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-border py-2 z-50">
                <button
                  type="button"
                  onClick={handleProfileEdit}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-[#2B2F36] hover:bg-neutral-bg transition-colors min-h-[44px]"
                >
                  <svg className="w-5 h-5 text-neutral-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  프로필 수정
                </button>
                <div className="border-t border-neutral-border mx-3" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-neutral-text-sub hover:bg-neutral-bg transition-colors min-h-[44px]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

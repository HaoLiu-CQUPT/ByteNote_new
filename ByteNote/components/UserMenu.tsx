"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type User = {
  id: number;
  email: string;
  name: string;
};

export default function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store"
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [pathname]); // 监听路由变化，登录后跳转时会自动刷新

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setShowMenu(false);
      router.push("/auth/login");
      router.refresh();
    } catch {
      // 忽略错误
    }
  };

  if (loading) {
    return (
      <Link
        href="/auth/login"
        className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px] text-gray-700 shadow-sm hover:border-blue-500 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-50 dark:hover:border-blue-500 dark:hover:bg-slate-900 transition-colors"
      >
        登录 / 注册
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px] text-gray-700 shadow-sm hover:border-blue-500 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-50 dark:hover:border-blue-500 dark:hover:bg-slate-900 transition-colors"
      >
        登录 / 注册
      </Link>
    );
  }

  // 生成头像（取用户名首字母，如果没有则用邮箱首字母）
  const avatarText = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-[11px] hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900 transition-colors"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-[10px] font-semibold text-white">
          {avatarText}
        </span>
        <span className="hidden text-gray-700 dark:text-slate-200 md:inline">
          {user.name}
        </span>
      </button>
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="p-3 border-b border-gray-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-gray-900 dark:text-slate-50">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
            <div className="p-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded px-2 py-1.5 text-left text-[11px] text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


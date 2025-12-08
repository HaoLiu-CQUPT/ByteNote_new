import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import OfflineSync from "@/components/OfflineSync";

export const metadata = {
  title: "ByteNote",
  description: "支持 Markdown 的在线笔记管理平台"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                
                // 在开发模式下，完全禁用 Service Worker
                if (isDev) {
                  window.addEventListener('load', () => {
                    // 注销所有现有的 Service Worker
                    navigator.serviceWorker.getRegistrations().then((registrations) => {
                      registrations.forEach((registration) => {
                        registration.unregister().then(() => {
                          console.log('开发模式：已注销 Service Worker');
                        });
                      });
                    });
                  });
                } else {
                  // 生产环境才注册 Service Worker
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then((reg) => {
                        console.log('SW registered:', reg);
                      })
                      .catch((err) => console.log('SW registration failed:', err));
                  });
                }
              }
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-50 transition-colors">
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-base font-bold text-white shadow-md">
                  B
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight text-gray-900 dark:text-slate-50 md:text-base transition-colors">
                    ByteNote
                  </span>
                  <span className="text-[11px] leading-tight text-gray-500 dark:text-slate-400 md:text-xs transition-colors">
                    Your Smart Note Platform
                  </span>
                </div>
              </Link>
              <nav className="flex items-center gap-2 text-xs md:gap-4 md:text-sm">
                <Link
                  href="/notes"
                  className="rounded px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors"
                >
                  笔记列表
                </Link>
                <Link
                  href="/notes/new"
                  className="rounded px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors"
                >
                  新建笔记
                </Link>
                <Link
                  href="/categories"
                  className="hidden rounded px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors sm:inline"
                >
                  分类
                </Link>
                <Link
                  href="/tags"
                  className="hidden rounded px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors sm:inline"
                >
                  标签
                </Link>
                {/* AI 功能已禁用
                <Link
                  href="/ai"
                  className="rounded px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors"
                >
                  🤖 AI 功能
                </Link>
                */}
                <UserMenu />
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 md:py-10">
            <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-lg dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.85)] md:p-8 transition-colors">
              {children}
            </div>
          </main>
          <OfflineSync />
        </div>
      </body>
    </html>
  );
}

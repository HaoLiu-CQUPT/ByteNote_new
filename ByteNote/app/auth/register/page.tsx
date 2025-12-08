"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "注册失败");
      }
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-900 shadow-lg dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
        <div className="mb-4 text-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
            注册新账号
          </h1>
          <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
            创建你的个人知识空间，笔记将安全地存储在本地数据库中。
          </p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-xs text-gray-700 dark:text-slate-300">
              邮箱
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-700 dark:text-slate-300">
              昵称
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="请输入展示名称（将用作头像显示）"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-700 dark:text-slate-300">
              密码
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="至少 6 位密码"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 dark:text-rose-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-medium text-white shadow-md hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 dark:from-sky-500 dark:to-blue-600 dark:shadow-sky-500/30 dark:hover:from-sky-400 dark:hover:to-blue-500"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-600 dark:text-slate-400">
          已有账号？
          <Link
            href="/auth/login"
            className="ml-1 text-blue-600 hover:text-blue-500 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
          >
            去登录
          </Link>
        </div>
      </div>
    </div>
  );
}




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import NoteCardSkeleton from "@/components/NoteCardSkeleton";

type NoteItem = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string } | null;
  tags: { tag: { id: number; name: string } }[];
};

type Category = { id: number; name: string };
type Tag = { id: number; name: string };

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  // AI 功能已禁用
  // const [searchMode, setSearchMode] = useState<"keyword" | "ai">("keyword");
  // const [aiSearching, setAiSearching] = useState(false);
  const searchMode = "keyword"; // 固定为关键词搜索

  const loadFilters = async () => {
    const [cRes, tRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/tags")
    ]);
    const cData = await cRes.json();
    const tData = await tRes.json();
    setCategories(cData.items || []);
    setTags(tData.items || []);
  };

  const loadNotes = async (opts?: { resetPage?: boolean }) => {
    const resetPage = opts?.resetPage;
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    setLoading(true);
    setErr("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("pageSize", String(pageSize));
      if (q) params.set("q", q);
      if (categoryId) params.set("categoryId", categoryId);
      if (selectedTagIds.length > 0) {
        params.set("tagIds", selectedTagIds.join(","));
      }
      const res = await fetch(`/api/notes?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "加载失败");
      setNotes(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setErr(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // 当筛选条件变化时自动搜索
  useEffect(() => {
    if (categoryId || selectedTagIds.length > 0) {
      loadNotes({ resetPage: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, selectedTagIds]);

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const doSearch = () => {
    // AI 功能已禁用 - 只使用关键词搜索
    loadNotes({ resetPage: true });
  };

  // AI 功能已禁用 - AI 搜索
  // const doAISearch = async () => {
  //   if (!q.trim()) {
  //     setErr("请输入搜索内容");
  //     return;
  //   }
  //   setAiSearching(true);
  //   setErr("");
  //   try {
  //     const res = await fetch("/api/ai/search", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query: q, topK: 10 }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       if (res.status === 503) {
  //         throw new Error(
  //           "AI 功能未配置。请在环境变量中设置 ZHIPU_API_KEY 以使用 AI 搜索功能。"
  //         );
  //       }
  //       throw new Error(data.message || "AI 搜索失败");
  //     }
  //     setNotes(data.results || []);
  //     setTotal(data.total || 0);
  //     setPage(1);
  //   } catch (e: any) {
  //     setErr(e.message || "AI 搜索失败");
  //     setNotes([]);
  //     setTotal(0);
  //   } finally {
  //     setAiSearching(false);
  //   }
  // };

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const renderExcerpt = (content: string) => {
    const plain = content.replace(/[#>*`]/g, "");
    return plain.length > 120 ? `${plain.slice(0, 120)}...` : plain;
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70 shadow-inner shadow-gray-200/50 dark:shadow-slate-900/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                笔记检索
              </div>
              {/* AI 功能已禁用 - 搜索模式切换
              <div className="flex gap-1 rounded-lg border border-gray-300 bg-gray-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode("keyword");
                    setQ("");
                    setNotes([]);
                    setTotal(0);
                    loadNotes({ resetPage: true });
                  }}
                  className={`rounded-md px-2 py-1 text-[10px] font-medium transition ${
                    searchMode === "keyword"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                      : "text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  关键词
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode("ai");
                    setQ("");
                    setNotes([]);
                    setTotal(0);
                  }}
                  className={`rounded-md px-2 py-1 text-[10px] font-medium transition ${
                    searchMode === "ai"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                      : "text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  🤖 AI 搜索
                </button>
              </div>
              */}
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500"
                placeholder="搜索标题或内容关键词..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    doSearch();
                  }
                }}
              />
              <button
                onClick={doSearch}
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-medium text-slate-50 shadow-md shadow-sky-500/30 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 md:mt-0"
              >
                搜索
              </button>
            </div>
            {/* AI 功能已禁用
            {searchMode === "ai" && (
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                💡 AI 搜索使用语义理解，可以找到意思相近的笔记内容
              </p>
            )}
            */}
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-slate-300 md:w-[220px]">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400">分类</span>
              <select
                className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">全部</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400">标签</span>
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                      selectedTagIds.includes(t.id)
                        ? "border-sky-500 bg-sky-500/20 text-sky-300"
                        : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-sky-500/70 hover:text-sky-200"
                    }`}
                    onClick={() => toggleTag(t.id)}
                  >
                    #{t.name}
                  </button>
                ))}
                {tags.length === 0 && (
                  <span className="text-[11px] text-slate-500">暂无标签</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
            我的笔记
          </h1>
          <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
            共 {total} 条笔记，支持标题 / 内容搜索与分类、标签筛选
          </p>
        </div>
        <Link
          href="/notes/new"
          className="inline-flex items-center rounded-lg bg-emerald-500/90 px-4 py-2 text-xs font-medium text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-400"
        >
          新建笔记
        </Link>
      </div>

      {err && (
        <p className="text-xs text-red-600 dark:text-rose-400">{err}</p>
      )}
      {loading && (
        <p className="text-xs text-gray-500 dark:text-slate-400">加载中...</p>
      )}
      {!loading && notes.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-slate-400">
          暂无笔记，点击右上角「新建笔记」开始记录。
        </p>
      )}
      {/* AI 功能已禁用
      {aiSearching && (
        <p className="text-xs text-gray-500 dark:text-slate-400">
          AI 正在分析你的查询...
        </p>
      )}
      */}

      <div className="grid gap-3 md:grid-cols-2">
        {loading && notes.length === 0 ? (
          <>
            <NoteCardSkeleton />
            <NoteCardSkeleton />
          </>
        ) : (
          notes.map((n) => (
            <NoteCard key={n.id} note={n} renderExcerpt={renderExcerpt} />
          ))
        )}
      </div>

      {total > 0 && (
        <div className="mt-2 flex items-center justify-center gap-3 text-xs">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
          >
            上一页
          </button>
          <span className="text-gray-700 dark:text-slate-300">
            第 {page} / {pageCount} 页
          </span>
          <button
            disabled={page >= pageCount}
            onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}




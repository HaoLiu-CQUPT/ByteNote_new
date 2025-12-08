"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// 动态导入 ReactMarkdown，避免离线时加载失败
const ReactMarkdown = dynamic(
  () => import("react-markdown").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="text-xs text-gray-500">加载中...</div>
  }
);

type Note = {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string } | null;
  tags: { tag: { id: number; name: string } }[];
};

export default function NoteDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  // AI 功能已禁用
  // const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/notes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "加载失败");
        setNote(data);
      } catch (e: any) {
        setErr(e.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("确认删除该笔记？删除后无法恢复。")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "删除失败");
        return;
      }
      router.push("/notes");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "删除失败");
    }
  };

  // AI 功能已禁用 - 生成摘要
  // const handleGenerateSummary = async () => {
  //   if (!note) return;
  //   setGeneratingSummary(true);
  //   try {
  //     const res = await fetch("/api/ai/summarize", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ noteId: note.id }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       if (res.status === 503) {
  //         alert(
  //           "AI 功能未配置。请在环境变量中设置 ZHIPU_API_KEY 以使用 AI 摘要功能。"
  //         );
  //       } else {
  //         alert(data.message || "生成摘要失败");
  //       }
  //       return;
  //     }
  //     setNote({ ...note, summary: data.summary });
  //   } catch (e: any) {
  //     alert(e.message || "生成摘要失败");
  //   } finally {
  //     setGeneratingSummary(false);
  //   }
  // };

  if (loading) {
    return <p className="text-xs text-slate-400">加载中...</p>;
  }

  if (err) {
    return <p className="text-xs text-rose-400">{err}</p>;
  }

  if (!note) {
    return <p className="text-xs text-slate-400">未找到该笔记。</p>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
            {note.title}
          </h1>
          <div className="mt-1 text-[11px] text-gray-600 dark:text-slate-400">
            创建：{new Date(note.createdAt).toLocaleString()} · 更新：
            {new Date(note.updatedAt).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-300">
            {note.category && (
              <span className="mr-2 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-200">
                {note.category.name}
              </span>
            )}
            {note.tags.map((t) => (
              <span
                key={t.tag.id}
                className="mr-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] text-sky-300"
              >
                #{t.tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2 text-xs">
          {/* AI 功能已禁用 - 生成摘要按钮
          <button
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
            className="rounded-lg bg-purple-500/90 px-3 py-1.5 font-medium text-slate-50 shadow-sm shadow-purple-500/40 hover:bg-purple-400 disabled:opacity-50"
            title="生成 AI 摘要"
          >
            {generatingSummary ? "生成中..." : "🤖 生成摘要"}
          </button>
          */}
          <Link
            href={`/notes/${note.id}/edit`}
            className="rounded-lg bg-sky-500/90 px-3 py-1.5 font-medium text-slate-950 shadow-sm shadow-sky-500/40 hover:bg-sky-400"
          >
            编辑
          </Link>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-rose-600 px-3 py-1.5 font-medium text-slate-50 shadow-sm shadow-rose-600/40 hover:bg-rose-500"
          >
            删除
          </button>
        </div>
      </div>

      {/* AI 功能已禁用 - AI 摘要显示
      {note.summary && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
              🤖 AI 摘要
            </span>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            {note.summary}
          </p>
        </div>
      )}
      */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-900 shadow-inner shadow-gray-200/50 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:shadow-slate-950/80">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
}




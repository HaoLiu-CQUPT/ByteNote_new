"use client";

import { useRouter } from "next/navigation";
import NoteEditor from "@/components/NoteEditor";

export default function NewNotePage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    categoryId: number | null;
    tagIds: number[];
  }) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "创建失败");
    }
    // 清除新建笔记页面的草稿
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(`note-draft:${window.location.pathname}`);
      } catch {
        // ignore
      }
    }
    router.push(`/notes/${json.id}`);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
          新建笔记
        </h1>
        <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
          使用 Markdown 编写内容，左侧编辑、右侧实时预览。
        </p>
      </div>
      <NoteEditor onSubmit={handleSubmit} />
    </div>
  );
}




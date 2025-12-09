"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { isOnline, saveOfflineNote, addToSyncQueue } from "@/lib/offline";

export type Option = { id: number; name: string };

// 使用 Next.js dynamic 导入 react-markdown
const ReactMarkdown = dynamic(
  () => import("react-markdown"),
  {
    ssr: false,
    loading: () => <div className="text-xs text-gray-500 p-2">加载预览中...</div>
  }
);

const AUTO_SAVE_DELAY = 800;

type Props = {
  initialTitle?: string;
  initialContent?: string;
  initialCategoryId?: number | null;
  initialTagIds?: number[];
  onSubmit: (data: {
    title: string;
    content: string;
    categoryId: number | null;
    tagIds: number[];
  }) => Promise<void>;
};

export default function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialCategoryId = null,
  initialTagIds = [],
  onSubmit
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categoryId, setCategoryId] = useState<number | null>(
    initialCategoryId
  );
  const [tagIds, setTagIds] = useState<number[]>(initialTagIds);
  const [categories, setCategories] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 确保组件在客户端挂载后才渲染 ReactMarkdown
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 检测网络状态
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 注意：ReactMarkdown 已通过 dynamic 导入，无需手动加载

  useEffect(() => {
    const load = async () => {
      if (isOffline) {
        // 离线时使用缓存的分类和标签（如果有）
        return;
      }
      try {
        const [cRes, tRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags")
        ]);
        const cData = await cRes.json();
        const tData = await tRes.json();
        setCategories(cData.items || []);
        setTags(tData.items || []);
      } catch (e) {
        // 离线时忽略错误
      }
    };
    load();
  }, [isOffline]);

  // 计算本地存储 key（按路由区分）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname || "default";
    setStorageKey(`note-draft:${path}`);
  }, []);

  // 只在组件首次挂载时初始化，或 initialTitle 从有值变为空（切换到新建）时重置
  const isMountedRef = useRef(false);
  const prevInitialTitleRef = useRef<string | undefined>(initialTitle);
  
  useEffect(() => {
    // 首次挂载时初始化
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    
    // 只在从编辑模式切换到新建模式时重置（initialTitle 从有值变为空）
    const wasEditing = prevInitialTitleRef.current && prevInitialTitleRef.current !== "";
    const isNew = !initialTitle || initialTitle === "";
    
    if (wasEditing && isNew) {
      setTitle("");
      setContent("");
      setCategoryId(null);
      setTagIds([]);
      setErr("");
      setLastSavedAt(null);
    }
    
    prevInitialTitleRef.current = initialTitle;
  }, [initialTitle]);

  // 恢复草稿（仅在编辑模式下，且 initialTitle 不为空时）
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    // 如果是新建笔记（initialTitle 为空），清除草稿
    if (!initialTitle) {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
      return;
    }
    // 编辑模式下才恢复草稿
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        title?: string;
        content?: string;
        categoryId?: number | null;
        tagIds?: number[];
        savedAt?: number;
      };
      // 只有当草稿存在且与当前笔记不同时才恢复
      if (draft.title !== undefined && draft.title !== initialTitle) {
        setTitle(draft.title);
      }
      if (draft.content !== undefined && draft.content !== initialContent) {
        setContent(draft.content);
      }
      if (draft.categoryId !== undefined) setCategoryId(draft.categoryId);
      if (draft.tagIds) setTagIds(draft.tagIds);
      if (draft.savedAt) setLastSavedAt(draft.savedAt);
    } catch {
      // ignore
    }
  }, [storageKey, initialTitle, initialContent]);

  // 自动保存草稿
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    if (!title && !content) return;

    const id = window.setTimeout(() => {
      const now = Date.now();
      const payload = {
        title,
        content,
        categoryId,
        tagIds,
        savedAt: now
      };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
        setLastSavedAt(now);
      } catch {
        // ignore
      }
    }, AUTO_SAVE_DELAY);

    return () => window.clearTimeout(id);
  }, [storageKey, title, content, categoryId, tagIds]);

  const toggleTag = (id: number) => {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setErr("标题和内容不能为空");
      return;
    }
    setLoading(true);
    setErr("");

    const noteData = {
      title: title.trim(),
      content,
      categoryId,
      tagIds
    };

    try {
      if (isOnline()) {
        // Online: save directly
        await onSubmit(noteData);
      } else {
        // Offline: save locally and add to sync queue
        const offlineId = saveOfflineNote({
          ...noteData,
          id: initialTitle ? Number(window.location.pathname.split("/").pop()) : undefined,
          isNew: !initialTitle,
          timestamp: Date.now()
        });
        addToSyncQueue({
          type: initialTitle ? "update" : "create",
          noteId: initialTitle ? Number(window.location.pathname.split("/").pop()) : undefined,
          data: { 
            ...noteData, 
            id: initialTitle ? Number(window.location.pathname.split("/").pop()) : (isNaN(Number(offlineId)) ? undefined : Number(offlineId)), 
            isNew: !initialTitle,
            timestamp: Date.now()
          },
          timestamp: Date.now()
        });
        setErr("已保存到本地，网络恢复后将自动同步");
        // Still call onSubmit for navigation, but it will fail gracefully
        try {
          await onSubmit(noteData);
        } catch {
          // Ignore offline errors
        }
      }
    } catch (e: any) {
      if (isOnline()) {
        setErr(e.message || "保存失败");
      } else {
        // Offline fallback
        const offlineId = saveOfflineNote({
          ...noteData,
          id: initialTitle ? Number(window.location.pathname.split("/").pop()) : undefined,
          isNew: !initialTitle,
          timestamp: Date.now()
        });
        addToSyncQueue({
          type: initialTitle ? "update" : "create",
          noteId: initialTitle ? Number(window.location.pathname.split("/").pop()) : undefined,
          data: { 
            ...noteData, 
            id: initialTitle ? Number(window.location.pathname.split("/").pop()) : (isNaN(Number(offlineId)) ? undefined : Number(offlineId)), 
            isNew: !initialTitle,
            timestamp: Date.now()
          },
          timestamp: Date.now()
        });
        setErr("已保存到本地，网络恢复后将自动同步");
      }
    } finally {
      setLoading(false);
    }
  }, [title, content, categoryId, tagIds, onSubmit, initialTitle]);

  // Ctrl+S / Cmd+S 快捷保存
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const saveCombo = isMac ? e.metaKey : e.ctrlKey;
      if (saveCombo && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit]);

  // 格式化工具栏：插入文本到光标位置
  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newContent =
      content.substring(0, start) +
      before +
      textToInsert +
      after +
      content.substring(end);

    setContent(newContent);

    // 设置光标位置
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 格式化工具栏：插入多行文本（如标题、列表等）
  const insertBlock = (prefix: string, suffix: string = "", placeholder: string = "", isHeading: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textBeforeCursor = content.substring(0, start);
    const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;
    const isAtLineStart = start === lineStart;
    const currentLineHasContent = start > 0 && content[start - 1] !== "\n" && textBeforeCursor.trim().length > 0;

    let newContent = content.substring(0, start);
    let cursorOffset = 0;
    
    if (selectedText) {
      // 如果有选中文本，在每行前添加前缀
      const lines = selectedText.split("\n");
      const formattedLines = lines.map((line) => 
        line.trim() ? prefix + line.trim() + suffix : line
      ).join("\n");
      newContent += formattedLines;
      cursorOffset = formattedLines.length;
    } else {
      // 如果没有选中文本
      if (isHeading && currentLineHasContent) {
        // 标题需要在新行，如果当前行有内容，先换行
        newContent += "\n" + prefix + placeholder + suffix;
        cursorOffset = 1 + prefix.length + placeholder.length + suffix.length;
      } else if (isHeading && !isAtLineStart) {
        // 如果不在行首，先换行
        newContent += "\n" + prefix + placeholder + suffix;
        cursorOffset = 1 + prefix.length + placeholder.length + suffix.length;
      } else {
        // 普通情况，直接插入
        newContent += prefix + placeholder + suffix;
        cursorOffset = prefix.length + placeholder.length + suffix.length;
      }
    }
    
    newContent += content.substring(end);
    setContent(newContent);

    // 设置光标位置
    setTimeout(() => {
      const newCursorPos = start + cursorOffset;
      // 对于标题，光标应该在占位符文本的末尾
      if (isHeading && !selectedText) {
        const placeholderEnd = newCursorPos - suffix.length;
        textarea.focus();
        textarea.setSelectionRange(placeholderEnd, placeholderEnd);
      } else {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // 简单的 Markdown 预览（离线降级方案）
  const renderMarkdownPreview = (text: string): { __html: string } => {
    if (!text) return { __html: "这里会实时渲染 Markdown 内容..." };
    
    // 简单的 Markdown 渲染（离线时使用）
    let html = text
      // 代码块（先处理，避免被其他规则影响）
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-200 dark:bg-slate-800 p-2 rounded text-xs font-mono overflow-x-auto my-2"><code>$1</code></pre>')
      // 标题（添加样式类）
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1 text-gray-700 dark:text-slate-300">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-2 text-gray-800 dark:text-slate-200">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-slate-100">$1</h1>')
      // 分割线
      .replace(/^---$/gim, "<hr />")
      // 引用
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      // 列表（有序和无序）
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      // 行内格式
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/<u>(.*?)<\/u>/gim, "<u>$1</u>")
      // 链接
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // 换行
      .replace(/\n/gim, "<br />");
    
    // 包装列表项
    html = html.replace(/(<li>.*?<\/li>(?:<br \/>)?)+/gim, (match) => {
      return "<ul>" + match.replace(/<br \/>/g, "") + "</ul>";
    });
    
    return { __html: html };
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500"
          placeholder="请输入笔记标题，例如：React Hooks 学习笔记"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex flex-wrap gap-3 text-xs text-gray-700 dark:text-slate-300 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-slate-400">分类：</span>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500 transition-colors"
              value={categoryId ?? ""}
              onChange={(e) =>
                setCategoryId(
                  e.target.value ? Number.parseInt(e.target.value) : null
                )
              }
            >
              <option value="">无</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-slate-400">标签：</span>
            <div className="flex flex-wrap gap-1">
              {tags.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`rounded-full border px-2 py-0.5 text-[11px] transition-colors ${
                    tagIds.includes(t.id)
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-sky-500 dark:bg-sky-500/20 dark:text-sky-300"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-sky-500/70 dark:hover:text-sky-200"
                  }`}
                  onClick={() => toggleTag(t.id)}
                >
                  #{t.name}
                </button>
              ))}
              {tags.length === 0 && (
                <span className="text-[11px] text-gray-400 dark:text-slate-500">
                  暂无标签，可先在数据库或接口中添加基础标签。
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors">
              Markdown 编辑
            </span>
            {/* 格式化工具栏 */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-900/60">
              {/* 标题 */}
              <button
                type="button"
                onClick={() => insertBlock("# ", "", "一级标题", true)}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="一级标题 H1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => insertBlock("## ", "", "二级标题", true)}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="二级标题 H2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertBlock("### ", "", "三级标题", true)}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="三级标题 H3"
              >
                H3
              </button>
              <div className="mx-0.5 h-4 w-px bg-gray-300 dark:bg-slate-600" />
              {/* 文本格式 */}
              <button
                type="button"
                onClick={() => insertText("**", "**", "加粗文本")}
                className="rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="加粗"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                type="button"
                onClick={() => insertText("*", "*", "斜体文本")}
                className="rounded px-1.5 py-0.5 text-[11px] italic text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="斜体"
              >
                <span className="italic">I</span>
              </button>
              <button
                type="button"
                onClick={() => insertText("<u>", "</u>", "下划线文本")}
                className="rounded px-1.5 py-0.5 text-[11px] text-gray-700 underline hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="下划线"
              >
                <span className="underline">U</span>
              </button>
              <button
                type="button"
                onClick={() => insertText("`", "`", "代码")}
                className="rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="行内代码"
              >
                &lt;/&gt;
              </button>
              <div className="mx-0.5 h-4 w-px bg-gray-300 dark:bg-slate-600" />
              {/* 列表 */}
              <button
                type="button"
                onClick={() => insertBlock("- ", "", "列表项")}
                className="rounded px-1.5 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="无序列表"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => insertBlock("1. ", "", "列表项")}
                className="rounded px-1.5 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="有序列表"
              >
                1.
              </button>
              <div className="mx-0.5 h-4 w-px bg-gray-300 dark:bg-slate-600" />
              {/* 其他 */}
              <button
                type="button"
                onClick={() => insertText("[", "](url)", "链接文本")}
                className="rounded px-1.5 py-0.5 text-[10px] text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="链接"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={() => insertBlock("> ", "", "引用文本")}
                className="rounded px-1.5 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="引用"
              >
                "
              </button>
              <button
                type="button"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (!textarea) return;
                  const start = textarea.selectionStart;
                  const newContent = content.substring(0, start) + "\n```\n代码块\n```\n" + content.substring(start);
                  setContent(newContent);
                  setTimeout(() => {
                    const newCursorPos = start + 5;
                    textarea.focus();
                    textarea.setSelectionRange(newCursorPos, newCursorPos + 3);
                  }, 0);
                }}
                className="rounded px-1.5 py-0.5 text-[10px] text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="代码块"
              >
                ```
              </button>
              <button
                type="button"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (!textarea) return;
                  const start = textarea.selectionStart;
                  const newContent = content.substring(0, start) + "\n---\n" + content.substring(start);
                  setContent(newContent);
                  setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(start + 5, start + 5);
                  }, 0);
                }}
                className="rounded px-1.5 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="分割线"
              >
                ─
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="min-h-[260px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500 transition-colors"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`# 标题\n\n- 要点一\n- 要点二\n\n支持 **加粗**、代码块等 Markdown 语法。`}
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-1 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors">
            实时预览
            {isOffline && (
              <span className="ml-2 text-amber-600 dark:text-amber-400">
                (离线模式 - 简化预览)
              </span>
            )}
          </div>
          <div className="min-h-[260px] flex-1 overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 transition-colors">
            {!isMounted ? (
              <div className="text-xs text-gray-500 p-2">加载预览中...</div>
            ) : isOffline ? (
              <div
                className="markdown-preview [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-gray-900 dark:[&_h1]:text-slate-100 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-gray-800 dark:[&_h2]:text-slate-200 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-gray-700 dark:[&_h3]:text-slate-300 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_li]:mb-1 [&_code]:bg-gray-200 dark:[&_code]:bg-slate-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_pre]:bg-gray-200 dark:[&_pre]:bg-slate-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_a]:text-blue-600 dark:[&_a]:text-sky-400 [&_a]:hover:underline [&_strong]:font-bold [&_em]:italic"
                dangerouslySetInnerHTML={renderMarkdownPreview(content)}
              />
            ) : (
              <div className="markdown-preview [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-gray-900 dark:[&_h1]:text-slate-100 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-gray-800 dark:[&_h2]:text-slate-200 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-gray-700 dark:[&_h3]:text-slate-300 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_li]:mb-1 [&_code]:bg-gray-200 dark:[&_code]:bg-slate-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_pre]:bg-gray-200 dark:[&_pre]:bg-slate-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_a]:text-blue-600 dark:[&_a]:text-sky-400 [&_a]:hover:underline [&_strong]:font-bold [&_em]:italic">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-slate-100" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-3 mb-2 text-gray-800 dark:text-slate-200" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-2 mb-1 text-gray-700 dark:text-slate-300" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    code: ({node, inline, ...props}: any) => 
                      inline ? (
                        <code className="bg-gray-200 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                      ) : (
                        <code className="block bg-gray-200 dark:bg-slate-800 p-2 rounded text-xs font-mono overflow-x-auto" {...props} />
                      ),
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-slate-600 pl-4 italic my-2" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 dark:text-sky-400 hover:underline" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                  }}
                >
                  {content || "这里会实时渲染 Markdown 内容..."}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {err && <p className="text-xs text-red-600 dark:text-rose-400">{err}</p>}
      {lastSavedAt && !err && (
        <p className="text-[11px] text-gray-500 dark:text-slate-500">
          已自动保存 {new Date(lastSavedAt).toLocaleTimeString()}
        </p>
      )}

      <div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 disabled:opacity-60 dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:shadow-sky-500/25 dark:hover:from-sky-400 dark:hover:to-blue-500 transition-colors"
        >
          {loading ? "保存中..." : "保存笔记（Ctrl+S）"}
        </button>
      </div>
    </div>
  );
}

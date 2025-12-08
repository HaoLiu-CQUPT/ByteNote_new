import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
// AI 功能已禁用
// import { generateEmbedding } from "@/lib/ai";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
  const id = Number.parseInt(params.id);
  const note = await prisma.note.findFirst({
    where: { id, userId: user.id },
    include: { category: true, tags: { include: { tag: true } } }
  });
  if (!note) {
    return NextResponse.json({ message: "笔记不存在" }, { status: 404 });
  }
  return NextResponse.json(note, { status: 200 });
}

export async function PUT(req: Request, { params }: Params) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
  const id = Number.parseInt(params.id);
  const { title, content, categoryId, tagIds } = await req.json();
  if (!title || !content) {
    return NextResponse.json(
      { message: "标题或内容不能为空" },
      { status: 400 }
    );
  }

  await prisma.noteTag.deleteMany({ where: { noteId: id } });

  const note = await prisma.note.update({
    where: { id },
    data: {
      title,
      content,
      categoryId: categoryId || null,
      tags: {
        create: Array.isArray(tagIds)
          ? (tagIds as number[]).map((tid) => ({ tagId: tid }))
          : []
      }
    },
    include: { category: true, tags: { include: { tag: true } } }
  });

  // AI 功能已禁用 - 嵌入向量更新
  // if (process.env.ZHIPU_API_KEY && prisma.noteEmbedding) {
  //   generateEmbedding(`${title} ${content}`)
  //     .then((embedding) => {
  //       return prisma.noteEmbedding.upsert({
  //         where: { noteId: note.id },
  //         create: {
  //           noteId: note.id,
  //           embedding: JSON.stringify(embedding),
  //         },
  //         update: {
  //           embedding: JSON.stringify(embedding),
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("更新嵌入向量失败:", error);
  //     });
  // }

  return NextResponse.json(note, { status: 200 });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
  const id = Number.parseInt(params.id);
  
  // 检查笔记是否存在且属于当前用户
  const note = await prisma.note.findFirst({
    where: { id, userId: user.id },
  });
  
  if (!note) {
    return NextResponse.json({ message: "笔记不存在" }, { status: 404 });
  }
  
  // 先删除关联数据
  await prisma.noteTag.deleteMany({ where: { noteId: id } });
  
  // AI 功能已禁用 - 删除嵌入向量
  // if (prisma.noteEmbedding) {
  //   try {
  //     await prisma.noteEmbedding.deleteMany({ where: { noteId: id } });
  //   } catch (error) {
  //     console.warn("删除嵌入向量失败:", error);
  //   }
  // }
  
  // 最后删除笔记本身
  await prisma.note.delete({ where: { id } });
  
  return NextResponse.json({ ok: true }, { status: 200 });
}




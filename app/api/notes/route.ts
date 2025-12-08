import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
// AI 功能已禁用
// import { generateEmbedding } from "@/lib/ai";

export async function GET(req: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId");
  const tagIdsParam = searchParams.get("tagIds") || "";
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  const tagIds = tagIdsParam
    .split(",")
    .map((id) => Number.parseInt(id))
    .filter((id) => !Number.isNaN(id));

  const where: any = {
    userId: user.id
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } }
    ];
  }

  if (categoryId) {
    where.categoryId = Number.parseInt(categoryId);
  }

  if (tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: { in: tagIds }
      }
    };
  }

  const total = await prisma.note.count({ where });
  const items = await prisma.note.findMany({
    where,
    include: {
      category: true,
      tags: { include: { tag: true } }
    },
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  return NextResponse.json({ items, total, page, pageSize }, { status: 200 });
}

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }

  const { title, content, categoryId, tagIds } = await req.json();
  if (!title || !content) {
    return NextResponse.json(
      { message: "标题或内容不能为空" },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: user.id,
      categoryId: categoryId || null,
      tags: {
        create: Array.isArray(tagIds)
          ? (tagIds as number[]).map((id) => ({ tagId: id }))
          : []
      }
    },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });

  // AI 功能已禁用 - 嵌入向量生成
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
  //       console.error("生成嵌入向量失败:", error);
  //     });
  // }

  return NextResponse.json(note, { status: 201 });
}



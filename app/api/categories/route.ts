import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
  const items = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ message: "名称不能为空" }, { status: 400 });
  }
  const item = await prisma.category.create({
    data: { name, userId: user.id }
  });
  return NextResponse.json(item, { status: 201 });
}




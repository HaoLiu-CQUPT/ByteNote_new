import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
  const id = Number.parseInt(params.id);
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ message: "名称不能为空" }, { status: 400 });
  }
  const item = await prisma.tag.update({
    where: { id },
    data: { name }
  });
  return NextResponse.json(item, { status: 200 });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
  const id = Number.parseInt(params.id);
  await prisma.tag.delete({
    where: { id }
  });
  return NextResponse.json({ ok: true }, { status: 200 });
}


// AI 功能已全部禁用
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }

  return NextResponse.json(
    { message: "AI 嵌入向量生成功能已禁用" },
    { status: 503 }
  );
}

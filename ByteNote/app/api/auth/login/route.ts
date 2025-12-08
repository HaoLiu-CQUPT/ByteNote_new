import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "参数不完整" }, { status: 400 });
    }
    const user = await loginUser(email, password);
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "登录失败" },
      { status: 400 }
    );
  }
}




import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ message: "参数不完整" }, { status: 400 });
    }
    const user = await registerUser(email, name, password);
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "注册失败" },
      { status: 400 }
    );
  }
}




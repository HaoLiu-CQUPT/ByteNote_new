import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_NAME = "notes_token";

export type SessionUser = {
  id: number;
  email: string;
  name: string;
};

export async function registerUser(
  email: string,
  name: string,
  password: string
) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new Error("该邮箱已被注册");
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hash }
  });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("邮箱或密码错误");
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("邮箱或密码错误");
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60
  });
  return user;
}

export function logoutUser() {
  cookies().delete(TOKEN_NAME);
}

export function getSessionUser(): SessionUser | null {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}
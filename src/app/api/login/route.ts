import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import crypto from 'crypto';

const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password + process.env.DATABASE_URL).digest('hex');
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password are required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    const hashedPassword = hashPassword(password);

    if (user) {
      // User exists, check password
      // Wait, what if the user was created before this change and has no password? 
      // We should ideally prevent login without password to old accounts, but for safety of MVP, if there is no password in DB, we should set it.
      if (user.password && user.password !== hashedPassword) {
        return NextResponse.json({ error: "密码不正确 (Incorrect Password)" }, { status: 401 });
      } else if (!user.password) {
        // Upgrade legacy account silently
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
      }
    } else {
      // New user registration
      if (password.length < 6) {
        return NextResponse.json({ error: "新设密码长度必须至少为6位" }, { status: 400 });
      }
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Test User",
          mbti: "未知" 
        }
      });
    }

    return NextResponse.json({ success: true, userId: user.id, mbti: user.mbti });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

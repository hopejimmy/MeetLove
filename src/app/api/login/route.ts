import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Test User",
          mbti: "未知" // Default, they can take the test later or it's fetched
        }
      });
    }

    return NextResponse.json({ success: true, userId: user.id, mbti: user.mbti });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

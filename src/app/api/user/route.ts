import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { mbti } = await req.json();

    if (!mbti) {
      return NextResponse.json({ error: "MBTI is required" }, { status: 400 });
    }

    // In an MVP without full auth, we can just create a fresh user row 
    // and return the user ID to store in localstorage or cookies
    const user = await prisma.user.create({
      data: {
        name: "Me",
        mbti: mbti
      }
    });

    return NextResponse.json({ success: true, userId: user.id, mbti: user.mbti });
  } catch (error) {
    console.error("Failed to create user", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

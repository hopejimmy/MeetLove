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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to fetch user", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "User ID and Email are required" }, { status: 400 });
    }

    // Check if email is already taken by another account
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing && existing.id !== userId) {
      return NextResponse.json({ 
        error: "该邮箱已有专属档案，请在首页通过登录入口找回它。" 
      }, { status: 400 });
    }

    // Bind email
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Failed to bind email", error);
    return NextResponse.json({ error: "Failed to bind email" }, { status: 500 });
  }
}

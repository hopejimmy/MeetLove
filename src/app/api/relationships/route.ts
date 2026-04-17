import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, name, relationType, mbti } = await req.json();

    if (!userId || !name || !relationType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const relationship = await prisma.relationship.create({
      data: {
        userId,
        name,
        relationType,
        mbti,
        behavioralProfile: JSON.stringify({}) // Assuming empty for this MVP step
      }
    });

    return NextResponse.json({ success: true, relationship });
  } catch (error) {
    console.error("Failed to add relationship", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if(!userId) return NextResponse.json({ error: "No userId provided "}, {status: 400});

    const relationships = await prisma.relationship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, relationships });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

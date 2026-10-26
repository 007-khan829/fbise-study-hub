import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to bookmark papers' }, { status: 401 });
    }

    const paperId = params.id;

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_paperId: {
          userId: user.id,
          paperId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          paperId,
        },
      });
      return NextResponse.json({ bookmarked: true, message: 'Paper bookmarked successfully' });
    }
  } catch (err: any) {
    console.error('Bookmark error:', err);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}

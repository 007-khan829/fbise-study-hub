import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ papers: [], quizzes: [], announcements: [] });
    }

    const trimmed = query.trim();

    const [papers, quizzes, announcements] = await Promise.all([
      prisma.paper.findMany({
        where: {
          OR: [
            { title: { contains: trimmed } },
            { subject: { contains: trimmed } },
            { classGrade: { contains: trimmed } },
          ],
        },
        take: 10,
        orderBy: { year: 'desc' },
      }),
      prisma.quiz.findMany({
        where: {
          OR: [
            { title: { contains: trimmed } },
            { subject: { contains: trimmed } },
            { chapter: { contains: trimmed } },
          ],
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.announcement.findMany({
        where: {
          OR: [
            { title: { contains: trimmed } },
            { content: { contains: trimmed } },
            { category: { contains: trimmed } },
          ],
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({ papers, quizzes, announcements });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

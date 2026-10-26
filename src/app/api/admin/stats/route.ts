import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const [
      totalStudents,
      totalPapers,
      totalQuizzes,
      totalAttempts,
      totalCheckedPapers,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.paper.count(),
      prisma.quiz.count(),
      prisma.quizAttempt.count(),
      prisma.checkedPaper.count(),
      prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, className: true, createdAt: true, streak: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalStudents,
        totalPapers,
        totalQuizzes,
        totalAttempts,
        totalCheckedPapers,
      },
      recentUsers,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}

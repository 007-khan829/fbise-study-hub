import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [dbUser, quizAttempts, checkedPapers, bookmarks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          className: true,
          phone: true,
          streak: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.quizAttempt.findMany({
        where: { userId: user.id },
        orderBy: { completedAt: 'desc' },
        include: {
          quiz: {
            select: { title: true, subject: true, chapter: true, classGrade: true },
          },
        },
      }),
      prisma.checkedPaper.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          paper: {
            select: { title: true },
          },
        },
      }),
      prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          paper: true,
        },
      }),
    ]);

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalQuizzes = quizAttempts.length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
        : 0;

    const stats = {
      totalQuizzes,
      avgScore,
      totalCheckedPapers: checkedPapers.length,
      totalBookmarks: bookmarks.length,
      streak: dbUser.streak,
    };

    return NextResponse.json({
      user: dbUser,
      stats,
      quizAttempts: quizAttempts.map((a) => ({
        id: a.id,
        quizId: a.quizId,
        quizTitle: a.quiz.title,
        subject: a.quiz.subject,
        chapter: a.quiz.chapter,
        classGrade: a.quiz.classGrade,
        score: a.score,
        totalQuestions: a.totalQuestions,
        percentage: a.percentage,
        timeTakenSeconds: a.timeTakenSeconds,
        completedAt: a.completedAt,
      })),
      checkedPapers: checkedPapers.map((c) => ({
        id: c.id,
        subject: c.subject,
        classGrade: c.classGrade,
        totalMarks: c.totalMarks,
        obtainedMarks: c.obtainedMarks,
        percentage: c.percentage,
        grade: c.grade,
        paperTitle: c.paper?.title,
        createdAt: c.createdAt,
      })),
      bookmarks: bookmarks.map((b) => ({
        id: b.id,
        paperId: b.paperId,
        paper: b.paper,
      })),
    });
  } catch (err: any) {
    console.error('Dashboard API error:', err);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}

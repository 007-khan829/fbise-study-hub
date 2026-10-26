import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');

    const whereUser: any = {
      role: 'STUDENT',
      isBlocked: false,
    };
    if (classGrade && classGrade !== 'ALL') {
      whereUser.className = classGrade;
    }

    const students = await prisma.user.findMany({
      where: whereUser,
      select: {
        id: true,
        name: true,
        className: true,
        streak: true,
        quizAttempts: {
          select: {
            score: true,
            totalQuestions: true,
            percentage: true,
          },
        },
      },
    });

    const leaderboard = students
      .map((student) => {
        const totalAttempts = student.quizAttempts.length;
        const totalScore = student.quizAttempts.reduce((acc, curr) => acc + curr.score, 0);
        const avgPercentage =
          totalAttempts > 0
            ? Math.round(
                student.quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts
              )
            : 0;

        return {
          id: student.id,
          name: student.name,
          className: student.className,
          streak: student.streak,
          totalAttempts,
          totalScore,
          avgPercentage,
          points: totalScore * 10 + student.streak * 5 + avgPercentage,
        };
      })
      .filter((s) => s.totalAttempts > 0 || s.streak > 0)
      .sort((a, b) => b.points - a.points || b.avgPercentage - a.avgPercentage)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return NextResponse.json({ leaderboard });
  } catch (err: any) {
    console.error('Leaderboard error:', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

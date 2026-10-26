import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const subject = searchParams.get('subject');

    const currentUser = await getSessionUser(req);

    const where: any = {};
    if (classGrade && classGrade !== 'ALL') {
      where.classGrade = classGrade;
    }
    if (subject && subject !== 'ALL') {
      where.subject = subject;
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true, attempts: true },
        },
        attempts: currentUser
          ? {
              where: { userId: currentUser.id },
              orderBy: { completedAt: 'desc' },
              take: 1,
              select: {
                id: true,
                score: true,
                totalQuestions: true,
                percentage: true,
                completedAt: true,
              },
            }
          : false,
      },
    });

    const formatted = quizzes.map((q) => ({
      ...q,
      questionCount: q._count.questions,
      totalAttemptsCount: q._count.attempts,
      userLatestAttempt: q.attempts && q.attempts.length > 0 ? q.attempts[0] : null,
    }));

    return NextResponse.json({ quizzes: formatted });
  } catch (err: any) {
    console.error('Error fetching quizzes:', err);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const { title, classGrade, subject, chapter, timeLimit, isDaily, questions } = body;

    if (!title || !classGrade || !subject || !chapter || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Missing required quiz fields or questions' }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        classGrade: String(classGrade),
        subject,
        chapter: chapter.trim(),
        timeLimit: parseInt(timeLimit) || 600,
        isDaily: Boolean(isDaily),
        questions: {
          create: questions.map((q: any) => ({
            question: q.question.trim(),
            optionA: q.optionA.trim(),
            optionB: q.optionB.trim(),
            optionC: q.optionC.trim(),
            optionD: q.optionD.trim(),
            correctOption: q.correctOption.toUpperCase(),
            explanation: (q.explanation || 'Based on standard FBISE syllabus').trim(),
            marks: parseInt(q.marks) || 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (err: any) {
    console.error('Error creating quiz:', err);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}

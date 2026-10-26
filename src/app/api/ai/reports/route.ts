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

    const reports = await prisma.checkedPaper.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        paper: {
          select: { title: true, year: true, session: true },
        },
      },
    });

    const parsed = reports.map((r) => ({
      id: r.id,
      subject: r.subject,
      classGrade: r.classGrade,
      submissionType: r.submissionType,
      fileUrl: r.fileUrl,
      totalMarks: r.totalMarks,
      obtainedMarks: r.obtainedMarks,
      percentage: r.percentage,
      grade: r.grade,
      createdAt: r.createdAt,
      paperTitle: r.paper?.title,
      reportData: JSON.parse(r.evaluationReport),
    }));

    return NextResponse.json({ reports: parsed });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch evaluated paper reports' }, { status: 500 });
  }
}

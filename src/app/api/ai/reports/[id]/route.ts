import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await prisma.checkedPaper.findUnique({
      where: { id: params.id },
      include: {
        paper: true,
        user: {
          select: { name: true, email: true, className: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (report.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const evaluation = JSON.parse(report.evaluationReport);

    return NextResponse.json({
      report: {
        id: report.id,
        subject: report.subject,
        classGrade: report.classGrade,
        submissionType: report.submissionType,
        fileUrl: report.fileUrl,
        totalMarks: report.totalMarks,
        obtainedMarks: report.obtainedMarks,
        percentage: report.percentage,
        grade: report.grade,
        createdAt: report.createdAt,
        studentName: report.user.name,
        studentEmail: report.user.email,
        paperTitle: report.paper?.title,
        evaluation,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

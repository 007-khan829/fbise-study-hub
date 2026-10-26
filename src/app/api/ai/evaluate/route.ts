import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { evaluatePaperWithAI } from '@/lib/ai-checker';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to your student account to use AI Paper Checking' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const subject = (formData.get('subject') as string) || 'Physics';
    const classGrade = (formData.get('classGrade') as string) || user.className || '9';
    const paperId = formData.get('paperId') as string | null;
    const paperTitle = formData.get('paperTitle') as string | null;
    const submissionType = (formData.get('submissionType') as string) || 'TYPED';
    const typedAnswers = formData.get('typedAnswers') as string | null;
    const file = formData.get('file') as File | null;

    let fileUrl: string | null = null;
    let answersContent = typedAnswers || '';

    if (submissionType === 'FILE_UPLOAD' && file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `submission_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'submissions');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, safeName), buffer);
      fileUrl = `/uploads/submissions/${safeName}`;

      if (!answersContent) {
        answersContent = `[Submitted Answer Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\n` +
          `Subject: ${subject} Class ${classGrade}\n` +
          `Student submitted handwritten answer sheets for Section A, Section B (Short Questions), and Section C (Descriptive Long Questions).`;
      }
    }

    if (!answersContent && !fileUrl) {
      return NextResponse.json(
        { error: 'Please provide typed answers or upload an answer sheet file.' },
        { status: 400 }
      );
    }

    // Run AI Evaluation
    const evaluation = await evaluatePaperWithAI({
      subject,
      classGrade,
      studentAnswers: answersContent,
      paperTitle: paperTitle || undefined,
      fileUrl: fileUrl || undefined,
    });

    // Save report in Database
    const savedRecord = await prisma.checkedPaper.create({
      data: {
        userId: user.id,
        paperId: paperId || null,
        subject,
        classGrade,
        submissionType,
        fileUrl,
        studentAnswersText: answersContent,
        totalMarks: evaluation.totalMaxMarks,
        obtainedMarks: evaluation.totalObtainedMarks,
        percentage: evaluation.percentage,
        grade: evaluation.grade,
        evaluationReport: JSON.stringify(evaluation),
      },
    });

    return NextResponse.json({
      success: true,
      reportId: savedRecord.id,
      evaluation,
    });
  } catch (err: any) {
    console.error('AI Paper Check error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error during AI paper evaluation' },
      { status: 500 }
    );
  }
}

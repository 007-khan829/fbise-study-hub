import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');
    const session = searchParams.get('session');
    const paperType = searchParams.get('paperType');
    const search = searchParams.get('search');

    const currentUser = await getSessionUser(req);

    const where: any = {};
    if (classGrade && classGrade !== 'ALL') {
      where.classGrade = classGrade;
    }
    if (subject && subject !== 'ALL') {
      where.subject = subject;
    }
    if (year && year !== 'ALL') {
      where.year = parseInt(year);
    }
    if (session && session !== 'ALL') {
      where.session = session;
    }
    if (paperType && paperType !== 'ALL') {
      where.paperType = paperType;
    }
    if (search && search.trim().length > 0) {
      where.OR = [
        { title: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    const papers = await prisma.paper.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      include: {
        bookmarks: currentUser
          ? {
              where: { userId: currentUser.id },
              select: { id: true },
            }
          : false,
      },
    });

    const formatted = papers.map((p) => ({
      ...p,
      isBookmarked: Boolean(p.bookmarks && p.bookmarks.length > 0),
    }));

    return NextResponse.json({ papers: formatted });
  } catch (err: any) {
    console.error('Error fetching papers:', err);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const classGrade = formData.get('classGrade') as string;
    const subject = formData.get('subject') as string;
    const yearStr = formData.get('year') as string;
    const session = (formData.get('session') as string) || 'Annual';
    const paperType = (formData.get('paperType') as string) || 'PAST_PAPER';
    const file = formData.get('file') as File | null;

    if (!title || !classGrade || !subject || !yearStr) {
      return NextResponse.json({ error: 'Missing required paper fields' }, { status: 400 });
    }

    let fileUrl = '/uploads/papers/sample_paper.pdf';
    let fileSize = '1.2 MB';

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'papers');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, safeName), buffer);
      fileUrl = `/uploads/papers/${safeName}`;
      fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const newPaper = await prisma.paper.create({
      data: {
        title: title.trim(),
        classGrade,
        subject,
        year: parseInt(yearStr),
        session,
        paperType,
        fileUrl,
        fileSize,
      },
    });

    return NextResponse.json({ success: true, paper: newPaper });
  } catch (err: any) {
    console.error('Error creating paper:', err);
    return NextResponse.json({ error: 'Failed to create paper' }, { status: 500 });
  }
}

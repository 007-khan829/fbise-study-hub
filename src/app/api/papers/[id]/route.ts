import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paper = await prisma.paper.findUnique({
      where: { id: params.id },
    });
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }
    // Increment view count
    await prisma.paper.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ paper });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch paper' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.paper.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Paper deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}

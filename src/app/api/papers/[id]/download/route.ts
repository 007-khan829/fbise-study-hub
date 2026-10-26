import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.paper.update({
      where: { id: params.id },
      data: { downloadCount: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to record download' }, { status: 500 });
  }
}

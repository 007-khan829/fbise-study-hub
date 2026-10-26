import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.announcement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
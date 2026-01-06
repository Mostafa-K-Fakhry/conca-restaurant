import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth"; // 1. استدعاء الجلسة
import { authOptions } from "../auth/[...nextauth]/route"; // 2. استدعاء إعدادات الأمان

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body;

    // 3. بنشوف هل المستخدم مسجل دخول ولا لأ؟
    const session = await getServerSession(authOptions);

    // 4. إنشاء الطلب في الداتابيز
    const order = await prisma.order.create({
      data: {
        // لو مسجل، خد الـ ID بتاعه.. لو لأ خليه null (زائر)
        userId: session?.user?.id ? String(session.user.id) : null, 

        customerName: customer.name,
        customerPhone: customer.phone,
        address: customer.address || "استلام من المطعم",
        orderType: customer.orderType,
        totalAmount: total,
        status: "PENDING",
        
        items: {
          create: items.map((item: any) => ({
            productName: item.nameAr,
            variantName: item.variantName,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
            notes: customer.notes,
            variantId: item.variantId 
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id }); 

  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
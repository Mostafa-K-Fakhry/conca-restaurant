import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route"; // لو المسار ده ضرب معاك، شوف الملحظة تحت*

export async function GET() {
  // 1. التأكد من تسجيل الدخول
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  try {
    // 2. جلب الأوردرات الخاصة بالإيميل ده
    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: session.user.email 
        }
      },
      include: {
        items: true // عشان نعرض تفاصيل كل أوردر
      },
      orderBy: {
        createdAt: 'desc' // الأحدث أولاً
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "فشل في جلب البيانات" }, { status: 500 });
  }
}
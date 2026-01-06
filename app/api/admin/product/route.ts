import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// 1. إضافة منتج (POST)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { nameAr, description, categoryId, variants, image } = body;

    if (!variants || variants.length === 0) {
      return NextResponse.json({ error: "يجب إضافة حجم/سعر واحد على الأقل" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        nameAr,
        description,
        categoryId,
        image,
        variants: {
          create: variants.map((v: any) => ({
            nameAr: v.nameAr,
            price: parseFloat(v.price)
          }))
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
  }
}

// 2. التعديل (PUT)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isAvailable, nameAr, description, categoryId, variants, image } = body;

    if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

    // (أ) حالة الإخفاء/الإظهار
    if (nameAr === undefined && isAvailable !== undefined) {
      const product = await prisma.product.update({
        where: { id },
        data: { isAvailable: Boolean(isAvailable) },
      });
      return NextResponse.json(product);
    }

    // (ب) حالة التعديل الكامل
    if (nameAr) {
      const product = await prisma.product.update({
        where: { id },
        data: {
          nameAr,
          description,
          categoryId,
          image,
          variants: {
            deleteMany: {}, 
            create: variants.map((v: any) => ({
              nameAr: v.nameAr,
              price: parseFloat(v.price)
            }))
          }
        },
      });

      return NextResponse.json(product);
    }

    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message || "فشل التحديث" }, { status: 500 });
  }
}

// 3. الحذف (DELETE) - (( تم التصحيح هنا ))
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    // التصحيح: استخدام productVariant بدل variant
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
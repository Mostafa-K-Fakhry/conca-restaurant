import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // التحقق من وجود الإيميل
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
    }

    // تشفير الباسورد وإنشاء المستخدم
    const hashedPassword = await hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // بنسجل رقم التليفون في حقل name مؤقتاً أو نضيف حقل phone في الـ schema لو حابب
        // للتسهيل هنعتبر الاسم هو الاسم
        role: "USER" 
      },
    });

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "حدث خطأ أثناء التسجيل" }, { status: 500 });
  }
}
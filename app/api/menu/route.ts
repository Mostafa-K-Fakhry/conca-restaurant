// app/api/menu/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // @ بتشاور على المجلد الرئيسي

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: { isAvailable: true },
          include: {
            variants: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Database Error:", error) // ضفت ده عشان لو حصل ايرور نشوفه في التيرمينال
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
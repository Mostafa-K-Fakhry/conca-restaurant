"use client";

import { LogOut, User as UserIcon, LogIn, FileText } from "lucide-react"; // ضيفنا FileText
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();

  // لو مش مسجل دخول، اظهر زرار "دخول"
  if (!session) {
    return (
      <Link 
        href="/login"
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-conca-gold transition-colors"
      >
        <LogIn size={16} /> دخول
      </Link>
    );
  }

  // لو مسجل، اظهر زر "طلباتي" واسمه وزرار الخروج
  return (
    <div className="flex items-center gap-3">
      
      {/* 1. زر طلباتي (الجديد) */}
      <Link 
        href="/my-orders" 
        className="hidden md:flex items-center gap-1 bg-white text-gray-600 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 hover:border-conca-gold hover:text-conca-gold transition-all"
      >
        <FileText size={14} /> طلباتي
      </Link>

      {/* 2. اسم المستخدم */}
      <div className="hidden md:flex flex-col items-end">
        <span className="text-xs text-gray-400 font-bold">مرحباً</span>
        <span className="text-sm font-bold text-conca-red leading-none">{session.user?.name}</span>
      </div>

      {/* 3. زرار الخروج */}
      <button 
        onClick={() => signOut({ callbackUrl: "/" })} // بعد الخروج يرجع للرئيسية (صفحة الترحيب)
        className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
        title="تسجيل الخروج"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}
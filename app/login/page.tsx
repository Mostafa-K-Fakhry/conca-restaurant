"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react"; // ضيفنا getSession
import { useRouter } from "next/navigation";
import { Utensils, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. محاولة تسجيل الدخول
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
    } else {
      // 2. اللوجين نجح؟ هات بيانات الجلسة عشان نعرف هو مين
      const session = await getSession();
      
      // 3. توجيه حسب الرتبة
      if (session?.user?.role === "ADMIN") {
        router.push("/admin"); // لو أدمن يروح لوحة التحكم
      } else {
        router.push("/menu");  // لو زبون يروح المنيو
      }
      
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-conca-red text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-conca-red/20 mb-3">
            <Utensils size={28} />
          </div>
          <h1 className="text-2xl font-black text-gray-800">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mt-1">أهلاً بك مجدداً في كونكا دورو</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute top-3.5 right-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              required
              className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-conca-gold transition-colors"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3.5 right-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="كلمة المرور"
              required
              className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-conca-gold transition-colors"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-bold">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-conca-red text-white font-bold py-3 rounded-xl hover:bg-[#600018] transition-colors shadow-lg shadow-conca-red/20"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <Link href="/" className="text-gray-500 hover:text-conca-red text-sm flex items-center justify-center gap-1">
             العودة للصفحة الرئيسية <ArrowRight size={14} />
          </Link>
          <div className="text-xs text-gray-400">
            ليس لديك حساب؟ <Link href="/register" className="text-conca-gold font-bold hover:underline">انشئ حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
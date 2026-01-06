"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Utensils, User, Mail, Lock, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/login"); // يروح يسجل دخول بعد ما يعمل حساب
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <div className="bg-conca-red text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User size={24} />
          </div>
          <h1 className="text-2xl font-black text-gray-800">إنشاء حساب جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute top-3.5 right-3 text-gray-400" size={18} />
            <input type="text" placeholder="الاسم بالكامل" required className="w-full pr-10 pl-4 py-3 bg-gray-50 border rounded-xl focus:border-conca-gold outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="relative">
            <Mail className="absolute top-3.5 right-3 text-gray-400" size={18} />
            <input type="email" placeholder="البريد الإلكتروني" required className="w-full pr-10 pl-4 py-3 bg-gray-50 border rounded-xl focus:border-conca-gold outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute top-3.5 right-3 text-gray-400" size={18} />
            <input type="password" placeholder="كلمة المرور" required className="w-full pr-10 pl-4 py-3 bg-gray-50 border rounded-xl focus:border-conca-gold outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button className="w-full bg-conca-red text-white font-bold py-3 rounded-xl hover:bg-[#600018] transition-all shadow-md">
            تسجيل حساب
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-conca-red">لديك حساب بالفعل؟ سجل دخول</Link>
        </div>
      </div>
    </div>
  );
}
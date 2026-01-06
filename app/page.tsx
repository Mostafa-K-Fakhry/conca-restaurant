import Link from "next/link";
import { Utensils, ChefHat, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#200508] relative overflow-hidden flex flex-col items-center justify-center text-center px-4">
      
      {/* خلفية جمالية (إضاءة خافتة) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-conca-red blur-[150px] opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-conca-gold blur-[150px] opacity-10 rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        
        {/* اللوجو والعنوان */}
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl mb-6 border border-white/10 shadow-2xl">
            <Utensils size={48} className="text-conca-gold" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tight">
            Conca <span className="text-conca-gold">D'oro</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light tracking-widest uppercase">
            Italian Taste Experience
          </p>
        </div>

        {/* الوصف */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          مرحباً بك في عالم المذاق الإيطالي الأصيل. استمتع بأشهى الأطباق المحضرة بعناية وشغف. سجل دخولك لتجربة كاملة أو تصفح المنيو كزائر.
        </p>

        {/* الأزرار الرئيسية */}
        <div className="flex flex-col md:flex-row gap-4 justify-center w-full pt-4">
          <Link 
            href="/login" 
            className="group relative px-8 py-4 bg-conca-red text-white rounded-xl font-bold overflow-hidden transition-all hover:scale-105 shadow-lg shadow-conca-red/30"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              تسجيل الدخول <ArrowRight size={18} />
            </span>
          </Link>

          <Link 
            href="/register" 
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold transition-all hover:scale-105 hover:bg-gray-50 shadow-lg"
          >
            إنشاء حساب جديد
          </Link>
        </div>

        {/* زر الزائر */}
        <div className="pt-4">
          <Link 
            href="/menu" 
            className="inline-flex items-center text-conca-gold hover:text-white transition-colors text-sm font-bold gap-1 border-b border-transparent hover:border-conca-gold pb-0.5"
          >
            الدخول كزائر (تصفح المنيو)
          </Link>
        </div>

      </div>

      {/* الحقوق */}
      <footer className="absolute bottom-6 text-gray-600 text-xs">
        © 2026 Conca D'oro. All rights reserved.
      </footer>
    </main>
  );
}
import { CheckCircle, FileText, ArrowRight } from "lucide-react"; // ضفنا أيقونات جديدة
import Link from "next/link";

export default async function OrderSuccess({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center">
      
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full">
        {/* علامة الصح المتحركة */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-2xl font-black text-gray-800 mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-500 mb-6">شكراً لطلبك من كونكا دورو. المطبخ استلم الطلب وجاري تحضيره حالاً.</p>

        {/* بوكس رقم الطلب */}
        <div className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
          <p className="text-3xl font-black text-conca-red">#{id}</p>
        </div>

        <div className="space-y-3">
          
          {/* 1. زر تتبع الطلب (الميزة الجديدة) */}
          <Link 
            href="/my-orders" 
            className="flex items-center justify-center gap-2 w-full bg-conca-red text-white py-3 rounded-xl font-bold hover:bg-[#600018] transition-colors shadow-lg shadow-conca-red/20"
          >
            <FileText size={18} />
            تتبع حالة الطلب
          </Link>

          {/* 2. زر العودة للمنيو */}
          <Link 
            href="/menu" 
            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            عودة للمنيو (طلب جديد)
          </Link>
          
          {/* 3. زر واتساب (اختياري لو حابب تسيبه) */}
          <a 
            href={`https://wa.me/201xxxxxxxxx?text=مرحبا، استفسار بخصوص الطلب رقم ${id}`}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full text-green-600 text-sm font-bold hover:underline mt-4"
          >
             تحتاج مساعدة؟ تواصل واتساب
          </a>
        </div>
      </div>

    </main>
  );
}
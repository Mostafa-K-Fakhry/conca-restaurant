"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { MapPin, Phone, User, Bike, Utensils, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  // حالة الفورم
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    orderType: "DELIVERY", // Default
  });

  // لو السلة فاضية، ارجع للمنيو
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] p-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h1>
        <p className="text-gray-500 mb-6">أضف بعض الأكلات اللذيذة أولاً</p>
        <Link href="/" className="px-6 py-3 bg-conca-red text-white rounded-xl font-bold hover:bg-[#600018] transition-colors">
          العودة للمنيو
        </Link>
      </div>
    );
  }

  // دالة إرسال الطلب
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. نبعت البيانات للـ API (لسه هنعمله في الخطوة الجاية)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items,
          total: cartTotal,
        }),
      });

      if (!res.ok) throw new Error("حدث خطأ أثناء إرسال الطلب");

      const data = await res.json();

      // 2. نفضي السلة
      clearCart();

      // 3. نروح لصفحة النجاح
      router.push(`/order-success/${data.orderId}`);

    } catch (error) {
      alert("عفواً، حدث خطأ ما. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* زرار الرجوع */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-conca-red mb-6 transition-colors">
          <ArrowRight size={18} className="ml-2" />
          العودة للمنيو
        </Link>

        <h1 className="text-3xl font-black text-conca-red mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود اليمين: فورم البيانات */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              
              {/* قسم 1: نوع الطلب */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">نوع الطلب</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "DELIVERY", icon: Bike, label: "توصيل" },
                    { id: "TAKEAWAY", icon: ShoppingBag, label: "استلام" },
                    { id: "DINE_IN", icon: Utensils, label: "صالة" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, orderType: type.id })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        formData.orderType === type.id
                          ? "border-conca-red bg-red-50 text-conca-red"
                          : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      <type.icon size={24} className="mb-2" />
                      <span className="font-bold text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* قسم 2: بيانات العميل */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">بياناتك</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute top-3.5 right-3 text-gray-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="الاسم بالكامل"
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-conca-gold focus:ring-1 focus:ring-conca-gold transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute top-3.5 right-3 text-gray-400" size={18} />
                    <input
                      required
                      type="tel"
                      placeholder="رقم الموبايل (واتساب أفضل)"
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-conca-gold focus:ring-1 focus:ring-conca-gold transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* العنوان (يظهر فقط لو دليفري) */}
                {formData.orderType === "DELIVERY" && (
                  <div className="relative animate-in fade-in slide-in-from-top-2">
                    <MapPin className="absolute top-3.5 right-3 text-gray-400" size={18} />
                    <textarea
                      required
                      placeholder="العنوان بالتفصيل (المنطقة، الشارع، رقم العمارة، الدور)"
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-conca-gold focus:ring-1 focus:ring-conca-gold transition-all min-h-[100px]"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                )}

                {/* ملاحظات */}
                <div>
                  <textarea
                    placeholder="ملاحظات للمطبخ (اختياري) - مثلا: بدون بصل، كاتشب زيادة..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-conca-gold focus:ring-1 focus:ring-conca-gold transition-all min-h-[80px]"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* العمود الشمال: ملخص الطلب */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص الطلب</h3>
              
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-bold text-gray-700 ml-1">{item.quantity}x</span>
                      <span className="text-gray-600">{item.nameAr} ({item.variantName})</span>
                    </div>
                    <span className="font-bold text-gray-800">{item.price * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-conca-red">{cartTotal} ج.م</span>
                </div>
                <p className="text-xs text-gray-400 text-center bg-gray-50 py-2 rounded-lg">
                  الدفع نقداً عند الاستلام فقط
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-conca-red text-white font-bold py-4 rounded-xl shadow-lg shadow-conca-red/20 hover:bg-[#600018] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "تأكيد الطلب الآن"
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
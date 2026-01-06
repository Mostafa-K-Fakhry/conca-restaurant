"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Truck, ShoppingBag, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

type Order = {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100"><Clock size={14}/> قيد الانتظار</span>;
      case "PREPARING": return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold border border-blue-100"><ShoppingBag size={14}/> جاري التحضير</span>;
      case "OUT_FOR_DELIVERY": return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-100"><Truck size={14}/> خرج للتوصيل</span>;
      case "COMPLETED": return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100"><CheckCircle size={14}/> مكتمل</span>;
      case "CANCELLED": return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-100"><XCircle size={14}/> ملغي</span>;
      default: return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-xs font-bold">جاهز</span>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-conca-gold font-bold">جاري تحميل طلباتك...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800">طلباتي السابقة 🧾</h1>
          <Link href="/menu" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-conca-red transition-colors">
            العودة للمنيو <ArrowRight size={16} />
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium mb-4">لم تقم بأي طلبات حتى الآن</p>
            <Link href="/menu" className="inline-block bg-conca-red text-white px-6 py-2 rounded-xl font-bold hover:bg-[#600018] transition-colors">
              اطلب الآن
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-conca-gold/30 transition-all">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 border-b border-gray-50 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-black text-gray-800">#{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      <span>-</span>
                      {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="block text-xl font-black text-conca-red">{order.totalAmount} ج.م</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="text-sm text-gray-600 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-dashed border-gray-50 last:border-0 py-1">
                      <span>{item.quantity}x {item.productName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
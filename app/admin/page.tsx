"use client";

import { useEffect, useState, useRef } from "react"; // 1. ضفنا useRef
import { RefreshCw, CheckCircle, Truck, ChefHat, Calendar } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast'; // 2. استدعاء التنبيهات

type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  orderType: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  address?: string;
  items: {
    id: string;
    productName: string;
    variantName: string | null;
    quantity: number;
    notes: string | null;
  }[];
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. متغيرات لتخزين عدد الطلبات السابقة (عشان نقارن بيه)
  const previousCountRef = useRef(0);
  const isFirstLoad = useRef(true); 

  // 4. دالة تشغيل الصوت
  const playNotificationSound = () => {
    try {
        const audio = new Audio("/ring.mp3"); 
        audio.play().catch(e => console.log("يجب التفاعل مع الصفحة أولاً لتشغيل الصوت"));
    } catch (error) {
        console.error("Audio Error");
    }
  };

  // دالة جلب الطلبات
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        
        // فلترة الطلبات لتاريخ اليوم فقط
        const today = new Date().toDateString();
        
        const todaysOrders = data.filter((order: Order) => {
          const orderDate = new Date(order.createdAt).toDateString();
          return orderDate === today && order.status !== "CANCELLED";
        });

        // --- 5. منطق التنبيه والصوت ---
        // لو العدد الجديد أكبر من القديم + دي مش أول مرة نفتح الصفحة
        if (todaysOrders.length > previousCountRef.current && !isFirstLoad.current) {
            playNotificationSound();
            toast.success("🔔 يوجد طلب جديد!", { 
                duration: 5000, 
                position: "top-center",
                style: { background: '#333', color: '#fff', fontWeight: 'bold' }
            });
        }

        // تحديث العدادات للمرة الجاية
        previousCountRef.current = todaysOrders.length;
        isFirstLoad.current = false;

        setOrders(todaysOrders);
      }
    } catch (error) {
      console.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    await fetch("/api/admin/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PREPARING": return "bg-blue-100 text-blue-800 border-blue-200";
      case "READY": return "bg-purple-100 text-purple-800 border-purple-200";
      case "OUT_FOR_DELIVERY": return "bg-orange-100 text-orange-800 border-orange-200";
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <Toaster /> {/* 6. مكان ظهور التنبيه */}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            طلبات اليوم <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border">{new Date().toLocaleDateString('ar-EG')}</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">يتم عرض الطلبات الجارية لليوم فقط</p>
        </div>
        
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all font-bold text-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          تحديث القائمة
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* رأس الكارت */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">#{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                  {order.status === "PENDING" && "قيد الانتظار ⏳"}
                  {order.status === "PREPARING" && "جاري التحضير 🍳"}
                  {order.status === "READY" && "جاهز للاستلام ✅"}
                  {order.status === "OUT_FOR_DELIVERY" && "مع الطيار 🛵"}
                  {order.status === "COMPLETED" && "مكتمل 💰"}
                </span>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                   <Calendar size={12} /> {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">{order.customerName}</p>
                <p className="text-xs text-gray-500 font-mono">{order.customerPhone}</p>
              </div>
            </div>

            {/* محتوى الكارت */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* تفاصيل الأصناف */}
              <div className="lg:col-span-2 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm border-b border-dashed border-gray-100 last:border-0 pb-2 last:pb-0">
                    <span className="font-bold bg-conca-red/10 text-conca-red w-6 h-6 flex items-center justify-center rounded-md text-xs">
                      {item.quantity}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.productName} 
                        {item.variantName && <span className="text-gray-500 font-normal"> ({item.variantName})</span>}
                      </p>
                      {item.notes && <p className="text-red-500 text-xs mt-0.5">⚠️ {item.notes}</p>}
                    </div>
                  </div>
                ))}
                
                {order.address && (
                   <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100 flex gap-2 items-start">
                     <Truck size={16} className="mt-0.5" />
                     <div>
                       <span className="font-bold block">عنوان التوصيل:</span> 
                       {order.address}
                     </div>
                   </div>
                )}
              </div>

              {/* أزرار التحكم */}
              <div className="flex flex-col gap-2 justify-center border-t lg:border-t-0 lg:border-r border-gray-100 pt-4 lg:pt-0 lg:pr-4">
                <p className="text-center font-black text-2xl text-conca-red mb-3">{order.totalAmount} ج.م</p>
                
                {/* أزرار الحالة التفاعلية */}
                {order.status === "PENDING" && (
                  <button onClick={() => updateStatus(order.id, "PREPARING")} className="bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
                    <ChefHat size={18} /> بدء التحضير
                  </button>
                )}
                {order.status === "PREPARING" && (
                  <button onClick={() => updateStatus(order.id, "READY")} className="bg-purple-600 text-white py-2.5 rounded-xl font-bold hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle size={18} /> تم التجهيز
                  </button>
                )}
                {order.status === "READY" && order.orderType === "DELIVERY" && (
                  <button onClick={() => updateStatus(order.id, "OUT_FOR_DELIVERY")} className="bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600 flex items-center justify-center gap-2 transition-colors">
                    <Truck size={18} /> خروج للطيار
                  </button>
                )}
                {(order.status === "READY" || order.status === "OUT_FOR_DELIVERY") && (
                  <button onClick={() => updateStatus(order.id, "COMPLETED")} className="bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle size={18} /> تم الاستلام (كاش)
                  </button>
                )}
                
                {order.status !== "COMPLETED" && (
                  <button onClick={() => { if(confirm('إلغاء الطلب؟')) updateStatus(order.id, "CANCELLED"); }} className="text-red-400 text-xs font-bold hover:bg-red-50 py-2 rounded-lg mt-1">
                    إلغاء الطلب
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && !loading && (
          <div className="text-center py-32 bg-white rounded-3xl border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-400">لا توجد طلبات اليوم حتى الآن</p>
            <p className="text-sm text-gray-300 mt-1">بانتظار أول أوردر! 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
}
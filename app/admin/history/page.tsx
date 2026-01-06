"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      });
  }, []);

  // دالة البحث
  useEffect(() => {
    const results = orders.filter((order: any) => 
      order.customerPhone.includes(search) || 
      order.id.toString().includes(search) ||
      order.customerName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(results);
  }, [search, orders]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">أرشيف الطلبات 📂</h1>
          <p className="text-gray-400 text-sm">سجل شامل لكل الطلبات السابقة</p>
        </div>
        
        {/* شريط البحث */}
        <div className="relative w-full md:w-96">
          <Search className="absolute top-3 right-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ابحث برقم الطلب، الهاتف، أو الاسم..."
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-conca-red"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">العميل</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-conca-red">#{order.id}</td>
                <td className="p-4">
                  <p className="font-bold text-gray-800 text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.customerPhone}</p>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold 
                    ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status === 'COMPLETED' ? 'مكتمل' : 
                     order.status === 'CANCELLED' ? 'ملغي' : 'جارية'}
                  </span>
                </td>
                <td className="p-4 font-black text-gray-800">{order.totalAmount} ج.م</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-400">لا توجد نتائج مطابقة</div>
        )}
      </div>
    </div>
  );
}
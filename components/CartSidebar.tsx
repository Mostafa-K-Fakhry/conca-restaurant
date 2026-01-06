"use client";

import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    removeFromCart, 
    increaseQuantity, // استدعاء دالة الزيادة
    decreaseQuantity, // استدعاء دالة النقصان
    cartTotal 
  } = useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {/* الخلفية السوداء */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 backdrop-blur-sm ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* السلة */}
      <div 
        className={`fixed top-0 left-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* رأس السلة */}
          <div className="p-5 bg-conca-red text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-conca-gold" />
              <h2 className="text-lg font-bold">سلة طلباتك</h2>
              <span className="bg-conca-gold text-conca-red text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* جسم السلة */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShoppingBag size={64} className="opacity-20" />
                <p>السلة فارغة، يالا نطلب أكل!</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-conca-red font-bold hover:underline"
                >
                  تصفح المنيو
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  
                  {/* الصف الأول: الاسم والسعر والمسح */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.nameAr}</h3>
                      <p className="text-xs text-gray-500 mt-1">الحجم: {item.variantName}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="حذف المنتج"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* الصف الثاني: التحكم في الكمية والسعر الإجمالي */}
                  <div className="flex justify-between items-center mt-2">
                    
                    {/* أزرار التحكم بالكمية (+ -) */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg active:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-conca-red">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg active:bg-gray-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* السعر الكلي للمنتج */}
                    <p className="text-conca-red font-bold text-base">
                      {item.price * item.quantity} ج.م
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ذيل السلة */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">المجموع الكلي</span>
                <span className="text-2xl font-black text-conca-red">{cartTotal} ج.م</span>
              </div>
              
              <Link 
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-conca-red text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#600018] active:scale-[0.98] transition-all shadow-lg shadow-conca-red/20"
              >
                <span>إتمام الطلب</span>
                <span className="text-xs font-normal opacity-80">(الدفع عند الاستلام)</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
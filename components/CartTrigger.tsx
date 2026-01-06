"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartTrigger() {
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <button 
      onClick={() => setIsCartOpen(true)}
      className="relative bg-gray-50 p-3 rounded-xl hover:bg-conca-red hover:text-white text-gray-700 transition-all duration-300 group cursor-pointer"
    >
      <ShoppingCart size={22} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-conca-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
          {cartCount}
        </span>
      )}
    </button>
  );
}
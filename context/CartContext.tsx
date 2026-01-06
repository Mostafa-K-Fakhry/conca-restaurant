"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  productId: string;
  nameAr: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void; // دالة جديدة
  decreaseQuantity: (id: string) => void; // دالة جديدة
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("conca-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conca-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
    });
    // setIsCartOpen(true); <--- تم إلغاء السطر ده عشان السلة متفتحش لوحدها
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // دالة زيادة الكمية من جوه السلة
  const increaseQuantity = (id: string) => {
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // دالة تنقيص الكمية
  const decreaseQuantity = (id: string) => {
    setItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          // لو الكمية هتبقى صفر، امسح المنتج، غير كده نقصه واحد
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter((item) => item.quantity > 0) // فلتر عشان يشيل اللي كميته بقت صفر
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQuantity, // تصدير الدالة
        decreaseQuantity, // تصدير الدالة
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { Providers } from "./providers"; // <--- 1. استدعاء الملف الجديد

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Conca D'oro - كونكا دورو",
  description: "أفضل مطعم إيطالي في مصر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        {/* 2. تغليف الموقع كله بـ Providers عشان السيشن تشتغل */}
        <Providers>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
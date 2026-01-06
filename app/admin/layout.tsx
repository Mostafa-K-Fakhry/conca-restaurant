"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, History, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "الطلبات الحالية", icon: <LayoutDashboard size={20} />, href: "/admin" },
    { name: "إدارة المنيو", icon: <UtensilsCrossed size={20} />, href: "/admin/menu-manager" }, // هنعملها الخطوة الجاية
    { name: "أرشيف الطلبات", icon: <History size={20} />, href: "/admin/history" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar - القائمة الجانبية */}
      <aside className="w-full md:w-64 bg-white shadow-md z-10 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:block">
          <div>
            <h1 className="text-2xl font-black text-conca-red">لوحة التحكم</h1>
            <p className="text-xs text-gray-400 mt-1">مدير النظام</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive 
                    ? "bg-conca-red text-white shadow-lg shadow-conca-red/30" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold mt-8 border border-transparent hover:border-red-100"
          >
            <LogOut size={20} />
            تسجيل خروج
          </button>
        </nav>
      </aside>

      {/* Main Content - المحتوى المتغير */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
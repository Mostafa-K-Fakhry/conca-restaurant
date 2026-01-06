"use client"; // ده السطر السحري اللي بيخلي التفاعل يشتغل

import { useState } from "react";

export default function CategoryNav({ categories }: { categories: any[] }) {
  // بنخلي أول قسم هو النشط افتراضياً
  const [activeId, setActiveId] = useState(categories[0]?.id);

  const handleClick = (id: string) => {
    setActiveId(id); // 1. غير اللون للذهبي
    const element = document.getElementById(id);
    if (element) {
      // 2. انزل للقسم بنعومة
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-conca-red text-white py-3 shadow-inner sticky top-20 z-40">
      <div className="container mx-auto px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeId === cat.id
                  ? "bg-conca-gold text-white shadow-md transform scale-105" // الاستايل الذهبي
                  : "bg-white/10 text-white/90 hover:bg-white/20" // الاستايل العادي
              }`}
            >
              {cat.nameAr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
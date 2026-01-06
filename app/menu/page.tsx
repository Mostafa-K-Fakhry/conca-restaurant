import { Utensils, Flame, Image as ImageIcon } from 'lucide-react';
import AddToCartButton from '../../components/AddToCartButton'; 
import CartTrigger from '../../components/CartTrigger';
import UserMenu from '../../components/UserMenu';
import CategoryNav from '../../components/CategoryNav';
import { prisma } from "@/lib/prisma"; // <--- 1. استدعاء بريزما

// 2. أمر عشان الصفحة تكون ديناميكية وتحدث البيانات علطول
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  // 3. جلب البيانات مباشرة من قاعدة البيانات
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { isAvailable: true }, // المنتجات المتاحة فقط
        include: {
          variants: true,
        },
      },
    },
    orderBy: { sortOrder: 'asc' }, // ترتيب الأقسام
  });

  return (
    <main className="min-h-screen pb-24 bg-[#FAFAFA]">
      
      {/* --- الهيدر --- */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* اللوجو */}
          <div className="flex items-center gap-3">
            <div className="bg-conca-red text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-conca-red/20">
              <Utensils size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-conca-red leading-none tracking-tight">
                Conca D'oro
              </h1>
              <span className="text-[10px] text-conca-gold font-bold tracking-widest mt-1">
                ITALIAN TASTE
              </span>
            </div>
          </div>
          
          {/* الجزء الأيسر */}
          <div className="flex items-center gap-3">
            <UserMenu />
            <CartTrigger />
          </div>
          
        </div>

        {/* الناف بار المتحرك */}
        <CategoryNav categories={categories} />

      </header>

      {/* --- البانر الترحيبي --- */}
      <div className="relative bg-[#200508] text-white py-12 px-6 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-conca-red blur-[120px] opacity-30 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-conca-gold blur-[120px] opacity-20 rounded-full"></div>

        <div className="relative z-10 text-center container mx-auto">
           <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-conca-gold text-xs font-medium mb-4 backdrop-blur-sm">
             <Flame size={14} className="fill-conca-gold" /> قائمة الطعام
           </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            اختار اللي <span className="text-conca-gold">يعجبك</span>
          </h2>
        </div>
      </div>

      {/* --- شبكة المنيو --- */}
      <div className="container mx-auto px-4 space-y-20">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-48">
            
            <div className="flex items-center gap-4 mb-10">
              <div className="h-10 w-1.5 bg-conca-red rounded-full"></div>
              <h3 className="text-3xl font-bold text-gray-800">{category.nameAr}</h3>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-conca-red/30 hover:shadow-xl hover:shadow-conca-red/5 transition-all duration-300 overflow-hidden flex flex-col">
                  
                  {/* --- 1. منطقة الصورة --- */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.nameAr} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                            <ImageIcon size={48} className="mb-2 opacity-20" />
                            <span className="text-xs font-bold opacity-40">Conca D'oro</span>
                        </div>
                    )}
                  </div>

                  {/* --- 2. محتوى الكارت --- */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-conca-red transition-colors">
                          {product.nameAr}
                        </h4>
                      </div>
                      <div className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 min-h-[2.5rem]">
                        {product.description || "استمتع بالطعم الرائع والمكونات الطازجة"}
                      </div>
                    </div>

                    <div className="space-y-3 pt-5 border-t border-dashed border-gray-100">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            {variant.nameAr}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-conca-red text-lg">
                              {/* تحويل السعر لرقم عشان نتجنب مشاكل الداتابيز */}
                              {Number(variant.price)} <span className="text-xs font-normal text-gray-400">ج.م</span>
                            </span>
                            <AddToCartButton product={product} variant={variant} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
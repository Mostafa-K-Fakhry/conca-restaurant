"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye, EyeOff, Plus, X, Pencil, Upload, Image as ImageIcon } from "lucide-react";
import { CldUploadButton } from "next-cloudinary"; // استيراد زرار الرفع

export default function MenuManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [productForm, setProductForm] = useState({
    id: "",
    nameAr: "",
    description: "",
    categoryId: "",
    image: "", // خانة للصورة
  });

  const [variantsList, setVariantsList] = useState([
    { nameAr: "", price: "" }
  ]);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMenu(); }, []);

  // --- دوال التحكم في الأحجام ---
  const addVariantRow = () => {
    setVariantsList([...variantsList, { nameAr: "", price: "" }]);
  };

  const removeVariantRow = (index: number) => {
    const list = [...variantsList];
    list.splice(index, 1);
    setVariantsList(list);
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const list: any = [...variantsList];
    list[index][field] = value;
    setVariantsList(list);
  };

  // --- دوال السيرفر ---
  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const newData = categories.map((cat: any) => ({
      ...cat,
      products: cat.products.map((p: any) => 
        p.id === productId ? { ...p, isAvailable: newStatus } : p
      )
    }));
    setCategories(newData as any);

    try {
      await fetch("/api/admin/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, isAvailable: newStatus }),
      });
    } catch (e) { fetchMenu(); }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const res = await fetch(`/api/admin/product?id=${productId}`, { method: "DELETE" });
    if (res.ok) fetchMenu();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setProductForm({ id: "", nameAr: "", description: "", categoryId: "", image: "" });
    setVariantsList([{ nameAr: "", price: "" }]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setIsEditMode(true);
    setProductForm({
      id: product.id,
      nameAr: product.nameAr,
      description: product.description || "",
      categoryId: product.categoryId,
      image: product.image || "", // بنجيب الصورة القديمة لو موجودة
    });
    
    if (product.variants && product.variants.length > 0) {
      setVariantsList(product.variants.map((v: any) => ({ 
        nameAr: v.nameAr, 
        price: String(v.price) 
      })));
    } else {
      setVariantsList([{ nameAr: "", price: "" }]);
    }
    
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.categoryId) return alert("اختر القسم");
    
    const validVariants = variantsList.filter(v => v.price !== "");
    if (validVariants.length === 0) return alert("يجب إضافة سعر واحد على الأقل");

    const method = isEditMode ? "PUT" : "POST";
    
    const payload: any = {
        ...productForm,
        variants: validVariants
    };

    try {
      const res = await fetch("/api/admin/product", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMenu();
        alert("تم الحفظ بنجاح ✅");
      } else {
        alert("حدث خطأ أثناء الحفظ");
      }
    } catch (error) { alert("خطأ في الاتصال"); }
  };

  // دالة التعامل مع نجاح رفع الصورة
  const handleUploadSuccess = (result: any) => {
    // result.info.secure_url ده الرابط اللي بيرجع من Cloudinary
    setProductForm({ ...productForm, image: result.info.secure_url });
  };

  if (loading) return <div className="p-8 text-center font-bold text-gray-500">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">إدارة المنيو 🍔</h1>
          <p className="text-gray-400 text-sm">التحكم الكامل (متعدد الأحجام + صور)</p>
        </div>
        <button onClick={openAddModal} className="bg-conca-gold text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b8860b] transition-colors shadow-lg">
          <Plus size={18} /> منتج جديد
        </button>
      </div>

      <div className="space-y-8 pb-20">
        {categories.map((category: any) => (
          <div key={category.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-conca-red mb-4 border-b pb-2 border-gray-100 flex justify-between">
              {category.nameAr}
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{category.products.length} صنف</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.products.map((product: any) => (
                <div key={product.id} className={`relative p-4 rounded-xl border flex gap-3 items-start transition-all group ${product.isAvailable ? 'border-gray-100 bg-gray-50' : 'border-red-100 bg-red-50 opacity-75'}`}>
                  
                  {/* عرض الصورة المصغرة */}
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.image ? (
                        <img src={product.image} alt={product.nameAr} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-gray-300" size={24} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{product.nameAr}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description || "لا يوجد وصف"}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {product.variants.map((v: any, idx: number) => (
                         <span key={idx} className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-1 rounded text-gray-700">
                           {v.nameAr}: {v.price} ج.م
                         </span>
                       ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button onClick={() => openEditModal(product)} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => toggleAvailability(product.id, product.isAvailable)} className={`p-2 rounded-lg transition-colors ${product.isAvailable ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'}`}>{product.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="text-xl font-black text-gray-800">{isEditMode ? "تعديل المنتج" : "إضافة منتج جديد"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              
              {/* --- منطقة رفع الصورة --- */}
              <div className="flex justify-center mb-4">
                 {productForm.image ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-conca-gold group">
                        <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => setProductForm({...productForm, image: ""})}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                 ) : (
                    <CldUploadButton
                        uploadPreset="conca-uploads"
                        options={{ sources: ['local', 'url'], multiple: false }}
                        onSuccess={handleUploadSuccess}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-conca-gold hover:text-conca-gold transition-colors bg-gray-50"
                    >
                        <Upload size={32} className="mb-2" />
                        <span className="font-bold text-sm">اضغط لرفع صورة للمنتج</span>
                    </CldUploadButton>
                 )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم المنتج</label>
                <input required type="text" className="w-full border rounded-xl p-3 bg-gray-50" value={productForm.nameAr} onChange={(e) => setProductForm({...productForm, nameAr: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">القسم</label>
                <select required className="w-full border rounded-xl p-3 bg-gray-50" value={productForm.categoryId} onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}>
                  <option value="">اختر القسم...</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex justify-between items-center">
                   قائمة الأسعار / الأحجام
                   <button type="button" onClick={addVariantRow} className="text-xs bg-conca-gold text-white px-2 py-1 rounded hover:bg-[#b8860b] transition-colors">+ إضافة حجم</button>
                </label>
                
                <div className="space-y-2">
                  {variantsList.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="الاسم (سنجل، وسط)" 
                        className="flex-1 border rounded-lg p-2 text-sm"
                        value={variant.nameAr}
                        onChange={(e) => handleVariantChange(index, 'nameAr', e.target.value)}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="السعر" 
                        className="w-24 border rounded-lg p-2 text-sm"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        required
                      />
                      {variantsList.length > 1 && (
                        <button type="button" onClick={() => removeVariantRow(index)} className="text-red-400 hover:text-red-600 p-1">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                <textarea className="w-full border rounded-xl p-3 bg-gray-50 h-20 resize-none" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
              </div>

              <button className="w-full bg-conca-red text-white font-bold py-3 rounded-xl hover:bg-[#600018] transition-colors shadow-lg">
                حفظ البيانات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
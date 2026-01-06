import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Start seeding FULL Conca D\'oro Menu...')

  // ------------------------------------------
  // 1. تنظيف البيانات القديمة
  // ------------------------------------------
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // ------------------------------------------
  // 2. إنشاء حساب الأدمن
  // ------------------------------------------
  const password = await hash('admin123', 12)
  await prisma.user.create({
    data: {
      email: 'admin@conca.com',
      name: 'Admin Manager',
      password: password,
      role: 'ADMIN'
    }
  })
  console.log('👤 Admin created: admin@conca.com / admin123')

  // ------------------------------------------
  // 3. إنشاء الأقسام (Categories)
  // ------------------------------------------
  const cats = {
    breakfast: await prisma.category.create({ data: { nameAr: 'الإفطار', nameEn: 'Breakfast', sortOrder: 1 } }),
    kids: await prisma.category.create({ data: { nameAr: 'وجبات الأطفال', nameEn: 'Kids Meals', sortOrder: 2 } }),
    chickenBurger: await prisma.category.create({ data: { nameAr: 'تشيكن برجر', nameEn: 'Chicken Burger', sortOrder: 3 } }),
    beefBurger: await prisma.category.create({ data: { nameAr: 'بيف برجر', nameEn: 'Beef Burger', sortOrder: 4 } }),
    pasta: await prisma.category.create({ data: { nameAr: 'الباستا', nameEn: 'Pasta', sortOrder: 5 } }),
    skillets: await prisma.category.create({ data: { nameAr: 'الطاسات', nameEn: 'Skillets', sortOrder: 6 } }),
    pizza: await prisma.category.create({ data: { nameAr: 'البيتزا', nameEn: 'Pizza', sortOrder: 7 } }),
    calzone: await prisma.category.create({ data: { nameAr: 'الكالزوني', nameEn: 'Calzone', sortOrder: 8 } }),
    appetizers: await prisma.category.create({ data: { nameAr: 'المقبلات والسلطات', nameEn: 'Appetizers & Salads', sortOrder: 9 } }),
    drinks: await prisma.category.create({ data: { nameAr: 'المشروبات والحلويات', nameEn: 'Drinks & Desserts', sortOrder: 10 } }),
  }

  // ------------------------------------------
  // 4. تعبئة المنتجات (Products)
  // ------------------------------------------

  // === (1) الإفطار ===
  const breakfastItems = [
    { 
      name: 'أومليت ميكس', 
      desc: 'بيض اومليت - موتزريلا - سوسيس - مشروم - خضار - توست - فرایز', 
      price: 75,
      img: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'أومليت بسطرمة', 
      desc: 'اومليت يقدم مع البسطرمة - موتزريلا - خضار - توست - فرایز', 
      price: 80,
      img: 'https://images.unsplash.com/photo-1587034636606-4448550dfb0b?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'بان توميتو', 
      desc: 'التوست المغطي بالطماطم والموتزريلا والبيض - خـس - فرايز', 
      price: 85,
      img: 'https://images.unsplash.com/photo-1525351463629-487053320349?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'سموك ميكس', 
      desc: 'التوست المحمص مع الموتزريلا - تركي مدخن - خضار - فرايز', 
      price: 85,
      img: 'https://images.unsplash.com/photo-1628191139360-4083564d03fd?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'دويتو ميكس', 
      desc: 'التوست المحمص مع الموتزريلا - ببروني - تركي مدخن - خضار - فرايز', 
      price: 85,
      img: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=800&auto=format&fit=crop'
    },
  ]
  for (const item of breakfastItems) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.breakfast.id, description: item.desc, image: item.img, variants: { create: [{ nameAr: 'طبق', price: item.price }] } }
    })
  }

  // === (2) وجبات الأطفال ===
  const kidsItems = [
    { 
      name: 'وجبة كرسبي', 
      desc: '2 قطعة كرسبي - بطاطس - عصير - لعبة', 
      price: 120,
      img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      name: 'وجبة ستربس', 
      desc: '6 قطع ستربس - بطاطس - عصير - لعبة', 
      price: 135,
      img: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop'
    },
  ]
  for (const item of kidsItems) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.kids.id, description: item.desc, image: item.img, variants: { create: [{ nameAr: 'وجبة', price: item.price }] } }
    })
  }

  // === (3) تشيكن برجر ===
  const chickenBurgers = [
    { 
      name: 'كلاسيك كرانشي', 
      desc: 'شرائح الفراخ المقرمشة مع صوص الف جزيرة وصوص كونكادورو المميز - خس - بصل - طماطم - خيار مخلل', 
      s: 105, d: 120,
      img: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'سموك كرانشي', 
      desc: 'شرائح الفراخ المقرمشة مع صوص الف جزيرة وصوص كونكادورو المميز - التركي المدخن - خس - بصل - طماطم - خيار مخلل', 
      s: 110, d: 125,
      img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'تشيز كونكا رانش', 
      desc: 'شرائح الفراخ المقرمشة مع اصابع الشيدر بالهالبينو - صوص كونكادورو المميز - خس - بصل - طماطم - خيار مخلل', 
      s: 115, d: 130,
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'بيكون كرانشي', 
      desc: 'شرائح الفراخ المقرمشة مع صوص الف جزيرة - بيف بيكون - خس - بصل - طماطم - خيار مخلل', 
      s: 110, d: 125,
      img: 'https://images.unsplash.com/photo-1606756856814-439402f9c0eb?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'باربكيو كرانشي', 
      desc: 'شرائح الفراخ المقرمشة مع صوص الباربكيو اللذيذ وصوص الف جزيرة - حلقات بصل - خس - بصل - طماطم - خيار مخلل', 
      s: 110, d: 125,
      img: 'https://images.unsplash.com/photo-1628294895950-98052523e036?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'كول سلو كرانشي', 
      desc: 'شرائح الفراخ المقرمشة الممزوجة بسلطة الكول سلو اللذيذة', 
      s: 100, d: 115,
      img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'بافلو كرانشي', 
      desc: 'شرائح الفراخ المقرمشة مع صوص البافلو سبايسي اللذيذ - أصابع موتزريلا - خس - بصل - طماطم - خيار مخلل', 
      s: 115, d: 130,
      img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop'
    },
  ]
  for (const item of chickenBurgers) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.chickenBurger.id, description: item.desc, image: item.img, variants: { create: [{ nameAr: 'سنجل', price: item.s }, { nameAr: 'دبل', price: item.d }] } }
    })
  }

  // === (4) بيف برجر ===
  const beefBurgers = [
    { 
      name: 'بيف برجر', 
      desc: 'برجر اللحم الصافي مع صوص التكساس اللذيذ - خس - بصل - طماطم - خيار مخلل', 
      s: 100, d: 120,
      img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'تشيز برجر', 
      desc: 'برجر اللحم الصافي مع صوص التكساس اللذيذ - موتزريلا - شرائح شيدر - خس - بصل - طماطم - خيار مخلل', 
      s: 115, d: 125,
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'سموك برجر', 
      desc: 'برجر اللحم الصافي مع صوص التكساس اللذيذ والتركي المدخن - شيدر - خس - بصل - طماطم - خيار مخلل', 
      s: 115, d: 125,
      img: 'https://images.unsplash.com/photo-1619250914948-2c49733efd16?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'بيكون برجر', 
      desc: 'برجر اللحم الصافي مع صوص التكساس اللذيذ مع البيف بيكون - خس - بصل - طماطم - خيار مخلل', 
      s: 115, d: 125,
      img: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'باربكيو برجر', 
      desc: 'برجر اللحم الصافي مع صوص الباربكيو المميز - حلقات البصل المقرمشة - خس - بصل - طماطم - خيار مخلل', 
      s: 115, d: 125,
      img: 'https://images.unsplash.com/photo-1566576912902-199bd620dd74?q=80&w=800&auto=format&fit=crop'
    },
    { 
      name: 'بافلو برجر', 
      desc: 'برجر اللحم الصافي مع صوص البافلو سبايسي المميز - حلقات البصل المقرمشة - خس - بصل - طماطم - خيار مخلل', 
      s: 120, d: 135,
      img: 'https://images.unsplash.com/photo-1520072959219-c595dc3f3db8?q=80&w=800&auto=format&fit=crop'
    },
  ]
  for (const item of beefBurgers) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.beefBurger.id, description: item.desc, image: item.img, variants: { create: [{ nameAr: '150 جم', price: item.s }, { nameAr: '200 جم', price: item.d }] } }
    })
  }

  // === (5) الباستا ===
  // ملاحظة: الأرقام في المنيو كانت متبدلة أحياناً، استخدمت المنطقي منها بناءً على الترتيب
  const pastaItems = [
    { name: 'ماك أند تشيز', desc: 'مكرونة هلاليه بصوص الجبنة الكريمي ومزيج الشيدر اللذيذ', img: 'https://images.unsplash.com/photo-1612966809570-0d33e9443264?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 90}, {n: 'كبير', p: 105}] },
    { name: 'ماك أند تشيز كرسبي', desc: 'مكرونة هلاليه بصوص الجبنة الكريمي ومزيج الشيدر - قطع الكرسبي اللذيذة', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=800&auto=format&fit=crop', v: [{n: 'كبير', p: 110}] },
    { name: 'الفريدو', desc: 'وايت صوص - قطع الفراخ المتبلة مع المشروم اللذيذ - فيتوتشيني', img: 'https://images.unsplash.com/photo-1645112411341-6c4fd0237b69?q=80&w=800&auto=format&fit=crop', v: [{n: 'كبير', p: 109}] },
    { name: 'نجرسكو', desc: 'وايت صوص - قطع الفراخ المتبله - موتزريلا - بنا', img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 95}, {n: 'كبير', p: 108}] },
    { name: 'لازانيا لحمة', desc: 'وايت صوص - اللحم البقري المميز - شرائح اللازانيا - موتزريلا', img: 'https://images.unsplash.com/photo-1574868309219-98e475354045?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 120}] },
    { name: 'لازانيا فراخ', desc: 'وايت صوص - قطع الفراخ المتبلة - شرائح اللازانيا - موتزريلا', img: 'https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 115}] },
    { name: 'باستا سوبريم', desc: 'وايت صوص - لحمة مفرومة - سوسيس - سجق - فيتوتشيني', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 115}] },
    { name: 'باستا ميكس فراخ', desc: 'وايت صوص - شاورما فراخ مع قطع الكرسبي اللذيذة - فيتوتشيني', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 120}] },
    { name: 'بشاميل لحمة', desc: 'وايت صوص - اللحم البقري - موتزريلا - بنا', img: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 115}] },
    { name: 'جمبري كرسبي', desc: 'وايت صوص - جمبري كرسبي - بنا', img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 130}] },
    { name: 'باستا روزا تشكن', desc: 'بينك صوص - شرائح الفراخ ع الجريل - رومي - بنا', img: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 105}] },
    { name: 'باستا بلونيز', desc: 'ريد صوص - لحمة مفرومة - فيتوتشيني', img: 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=800&auto=format&fit=crop', v: [{n: 'وسط', p: 110}] },
  ]
  for (const item of pastaItems) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.pasta.id, description: item.desc, image: item.img, variants: { create: item.v.map(v => ({ nameAr: v.n, price: v.p })) } }
    })
  }

  // === (6) الطاسات ===
  const skillets = [
    { name: 'طاسة جبن', desc: 'وايت صوص بالجبنة الشيدر - موتزريلا - خبز', price: 115 },
    { name: 'طاسة سجق', desc: 'وايت صوص بالجبنة الشيدر - موتزريلا - سجق - خبز', price: 115 },
    { name: 'طاسة هوت دوج', desc: 'وايت صوص بالجبنة الشيدر - موتزريلا - هوت دوج - خبز', price: 115 },
    { name: 'طاسة شاورما فراخ', desc: 'وايت صوص بالجبنة الشيدر - موتزريلا - شاورما فراخ - خبز', price: 125 },
    { name: 'طاسة تشكن كرسبي', desc: 'وايت صوص بالجبنة الشيدر - موتزريلا - تشكن كرسبي - خبز', price: 120 },
    { name: 'طاسة جمبري كرسبي', desc: 'وايت صوص بالجبنة الشيدر - موتزريلا - جمبري كرسبي - خبز', price: 135 },
  ]
  for (const item of skillets) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.skillets.id, description: item.desc, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop', variants: { create: [{ nameAr: 'طاسة', price: item.price }] } }
    })
  }

  // === (7) البيتزا ===
  const pizzas = [
    { name: 'مارجريتا', desc: 'الصوص الايطالي - زعتر - موتزريلا', m: 99, l: 109, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop' },
    { name: 'خضار', desc: 'الصوص الايطالي - فلفل اخضر - زيتون - فلفل الوان - مشروم - طماطم - موتزريلا - زعتر', m: 108, l: 120, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { name: 'بيبروني', desc: 'الصوص الايطالي - شرائح الببروني - موتزريلا - زعتر', m: 138, l: 150, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { name: 'سجق', desc: 'الصوص الايطالي - السجق - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 138, l: 150, img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop' },
    { name: 'هوت دوج', desc: 'الصوص الايطالي - شرائح السوسيس - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 138, l: 150, img: 'https://images.unsplash.com/photo-1620201179607-1b32cc62973b?q=80&w=800&auto=format&fit=crop' },
    { name: 'شاورما فراخ', desc: 'قطع الفراخ المتبله - الصوص الايطالي - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 140, l: 150, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' },
    { name: 'تشيكن رانش', desc: 'قطع الفراخ المتبله مع صوص الرانش - الصوص الايطالى - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 147, l: 157, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
    { name: 'تشيكن باربكيو', desc: 'قطع الفراخ المتبله مع صوص الباربكيو - الصوص الايطالي - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 147, l: 157, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' },
    { name: 'تشيكن كرسبي', desc: 'قطع الكرسبي المقرمشه - الصوص الايطالي - فلفل اخضر - زيتون - شيدر مبشور - موتزريلا - زعتر', m: 147, l: 157, img: 'https://images.unsplash.com/photo-1618213837799-25d5552f2073?q=80&w=800&auto=format&fit=crop' },
    { name: 'سوبر سوبريم', desc: 'الصوص الايطالي - لحمة - ببروني - سوسيس - موتزريلا - زعتر', m: 159, l: 169, img: 'https://images.unsplash.com/photo-1595708681242-8cd87494ec26?q=80&w=800&auto=format&fit=crop' },
    { name: 'ميكس فراخ', desc: 'قطع الفراخ المتبله - مع قطع الكرسبي اللذيذه - الصوص الايطالي - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 157, l: 167, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
    { name: 'الفريدو', desc: 'قطع الفراخ المتبله بالوايت صوص مع الريحان - مشروم - موتزريلا - زعتر', m: 149, l: 159, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { name: 'بسطرمة', desc: 'الصوص الايطالي - شرائح البسطرمة - فلفل اخضر - موتزريلا - زعتر', m: 157, l: 167, img: 'https://images.unsplash.com/photo-1593560708920-63984dc36f3c?q=80&w=800&auto=format&fit=crop' },
    { name: 'كواترو فورماج (جبن)', desc: 'الصوص الايطالي - جبنة الشيدر - رومي - ريكفورد - موتزريلا - زعتر', m: 147, l: 155, img: 'https://images.unsplash.com/photo-1573821663912-6df460f9c684?q=80&w=800&auto=format&fit=crop' },
    { name: 'سموك تشيكن', desc: 'قطع الفراخ المتبله - مع التركي المدخن - الصوص الايطالي - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 155, l: 165, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { name: 'تشيكن ايلاند', desc: 'قطع الفراخ المتبلة - صوص الباربكيو - صوص رانش - الف جزيرة - فلفل اخضر - طماطم', m: 150, l: 165, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' },
    { name: 'تونه', desc: 'الصوص الايطالي - قطع التونه - موتزريلا - فلفل اخضر - زعتر', m: 150, l: 165, img: 'https://images.unsplash.com/photo-1574126154517-d1e0d89e7344?q=80&w=800&auto=format&fit=crop' },
    { name: 'جمبري كرسبي', desc: 'الصـوص الايطالي - الجمبري الكرسبي - فلفل اخضر - زيتون - موتزريلا - زعتر', m: 155, l: 165, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' },
    { name: 'شرقي', desc: 'الصوص الايطالي - اللحمة المفرومة - شرائح السجق - فلفل اخضر - طماطم - زيتون - موتزريلا - زعتر', m: 150, l: 160, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { name: 'ميكسيكانو', desc: 'قطع الفراخ المتبلة او الكرسبي المقرمش - الصوص الايطالي - صوص بافلو سبايسي - فلفل اخضر - طماطم', m: 155, l: 165, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
    { name: 'تشيكن بافلو', desc: 'قطع الفراخ المتبلة او الفراخ الكرسبى - صوص تكساس - زيتون - موتزريلا - زعتر', m: 155, l: 165, img: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=800&auto=format&fit=crop' },
    { name: 'شيتوس', desc: 'قطع الفراخ المتبلة او الفراخ الكرسبي - صوص تكساس - الصوص الايطالي - شيتوس - طماطم فلفل اخضر - زيتون', m: 155, l: 165, img: 'https://images.unsplash.com/photo-1593560708920-63984dc36f3c?q=80&w=800&auto=format&fit=crop' },
  ]
  for (const p of pizzas) {
    await prisma.product.create({
      data: {
        nameAr: `بيتزا ${p.name}`, categoryId: cats.pizza.id, description: p.desc, image: p.img,
        variants: { create: [{ nameAr: 'وسط (M)', price: p.m }, { nameAr: 'كبير (L)', price: p.l }] }
      }
    })
  }

  // === (8) الكالزوني ===
  const calzones = [
    { name: 'ميكس جبن', desc: 'الصوص الايطالي - جبنه شيدر - رومي - ريكفورد - موتزريلا - زعتر', price: 130 },
    { name: 'ميجا بيف', desc: 'الصوص الايطالي - ببروني - لحمه مفرومه - روز بيف - موتزريلا - زعتر', price: 150 },
    { name: 'فراخ', desc: 'الصوص الايطالي - مع قطع الفراخ المتبله - والتركي المدخن - موتزريلا - زعتر', price: 145 },
  ]
  for (const item of calzones) {
    await prisma.product.create({
      data: { nameAr: `كالزوني ${item.name}`, categoryId: cats.calzone.id, description: item.desc, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop', variants: { create: [{ nameAr: 'قطعة', price: item.price }] } }
    })
  }

  // === (9) المقبلات والسلطات ===
  const appetizers = [
    { name: 'بطاطس فرايز', price: 35 },
    { name: 'تشيز فرايز', price: 40 },
    { name: 'حلقات بصل', price: 35 },
    { name: 'موتزريلا ستكس', price: 35 },
    { name: 'تشيز فرايز شيتوس', price: 48 },
    { name: 'تشيز فرايز كرسبي', price: 65 },
    { name: 'سلطة كول سلو', price: 25 },
    { name: 'سيزر سلاط', price: 65 },
    { name: 'تشيكن سيزر سلاط', price: 95 },
  ]
  for (const item of appetizers) {
    await prisma.product.create({
      data: { nameAr: item.name, categoryId: cats.appetizers.id, image: 'https://images.unsplash.com/photo-1573080496982-b73a88e98b0f?q=80&w=800&auto=format&fit=crop', variants: { create: [{ nameAr: 'طبق', price: item.price }] } }
    })
  }

  // === (10) المشروبات والحلويات (عينة من المنيو) ===
  const dessertsAndDrinks = [
    // ساخن
    { name: 'شاي', price: 17 }, { name: 'قهوة تركي', price: 25 }, { name: 'قهوة دبل', price: 30 },
    { name: 'كابتشينو', price: 55 }, { name: 'لاتيه', price: 45 }, { name: 'هوت شوكلت', price: 45 },
    // بارد
    { name: 'عصير مانجو', price: 50 }, { name: 'عصير فراولة', price: 50 }, { name: 'ليمون نعناع', price: 40 },
    { name: 'ميلك شيك أوريو', price: 60 }, { name: 'ميلك شيك لوتس', price: 65 }, { name: 'سموزي بطيخ', price: 55 },
    { name: 'سموزي مانجو', price: 55 }, { name: 'صودا بلوبيري', price: 40 }, { name: 'بيبسي / كولا', price: 20 },
    // حلويات
    { name: 'وافل نوتيلا', price: 55 }, { name: 'وافل فواكه', price: 70 }, 
    { name: 'مولتن كيك', price: 75 }, { name: 'تشيز كيك', price: 65 }, { name: 'وافل لوتس', price: 65 }
  ]
  for (const d of dessertsAndDrinks) {
    await prisma.product.create({ data: { nameAr: d.name, categoryId: cats.drinks.id, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop', variants: { create: [{ nameAr: 'Standard', price: d.price }] } } })
  }

  console.log('✅ Seeding finished successfully with FULL MENU & REAL IMAGES.')
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect() })
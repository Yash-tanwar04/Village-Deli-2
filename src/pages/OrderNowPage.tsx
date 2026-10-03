import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Clock,
  Leaf,
  Truck,
  ShoppingBag,
  Store,
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Package
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { Product, Category } from '../types';
import { api } from '../lib/api';

export const OrderNowPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [fulfilmentMode, setFulfilmentMode] = useState<'delivery' | 'pickup' | 'instore'>('delivery');

  // Ref to products catalog section for smooth scrolling (Requirement 5)
  const productsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setTimeout(() => {
        productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParam]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsData, prodsData] = await Promise.all([
        api.getCategories(true),
        api.getProducts({ status: 'published' })
      ]);
      setCategories(catsData);
      setProducts(prodsData);
    } catch (err) {
      console.error('Failed to load order page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (slug: string) => {
    const nextSlug = activeCategory === slug ? '' : slug;
    setActiveCategory(nextSlug);
    if (nextSlug) {
      setSearchParams({ category: nextSlug });
      setTimeout(() => {
        productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      setSearchParams({});
    }
  };

  const categoryItems = [
    { name: 'Fresh Produce', slug: 'fresh-produce', image: '/assets/mockup/cat_fresh_produce.webp' },
    { name: 'Fresh Food', slug: 'fresh-food', image: '/assets/mockup/cat_quick_meals.webp' },
    { name: 'Bakery & Snacks', slug: 'bakery-snacks', image: '/assets/mockup/cat_fresh_bakery.webp' },
    { name: 'Groceries & Essentials', slug: 'groceries-essentials', image: '/assets/mockup/cat_groceries.webp' },
    { name: 'Dairy & Chilled Items', slug: 'dairy-chilled', image: '/assets/mockup/cat_dairy_chilled.webp' },
    { name: 'Meat & Proteins', slug: 'meat-proteins', image: '/assets/mockup/cat_meat_proteins.webp' },
    { name: 'Coffee & Beverages', slug: 'coffee-beverages', image: '/assets/mockup/cat_coffee_beverages.webp' },
    { name: 'Personal Care & Household', slug: 'personal-care-household', image: '/assets/mockup/cat_personal_household.webp' }
  ];

  const mealCards = [
    { title: 'Breakfast On The Go', image: '/assets/mockup/order_meal_wraps.webp', link: '/category/fresh-food' },
    { title: 'Lunch Delights', image: '/assets/mockup/order_meal_lunch.webp', link: '/category/fresh-food' },
    { title: 'Evening Cravings', image: '/assets/mockup/order_meal_samosas.webp', link: '/category/fresh-food' },
    { title: 'Late Night Options', image: '/assets/mockup/order_meal_burger.webp', link: '/category/fresh-food' }
  ];

  // Filter products by active category & search
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory
      ? p.category_id === activeCategory || categories.find(c => c.slug === activeCategory)?.id === p.category_id
      : true;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#3b711e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">Order Now</span>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 12) */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-10 sm:py-14">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                ORDER NOW
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.08]">
                Your VillageDELI. <br />
                <span className="text-[#6cb33f]">Your Way.</span>
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Fresh food, everyday essentials and more — now just a few clicks away.
              </p>

              {/* 4 Feature Icons under headline */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Clock className="w-4 h-4 text-[#3b711e]" />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Leaf className="w-4 h-4 text-[#3b711e]" />
                  <span>Fresh & Quality Products</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Truck className="w-4 h-4 text-[#3b711e]" />
                  <span>Quick Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <ShoppingBag className="w-4 h-4 text-[#3b711e]" />
                  <span>Wide Selection</span>
                </div>
              </div>
            </div>

            {/* Right Photo: Grocery Bag from Page 12 */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src="/assets/mockup/order_grocery_bag_hero.webp"
                  alt="VillageDELI Good Food Good Mood Delivered"
                  className="w-full h-72 sm:h-84 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 3 FULFILMENT MODE CARDS (PDF PAGE 12) */}
      {/* ============================================================== */}
      <section className="py-8 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Home Delivery */}
            <button
              onClick={() => setFulfilmentMode('delivery')}
              className={`p-6 rounded-3xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                fulfilmentMode === 'delivery'
                  ? 'bg-white border-[#3b711e] shadow-md ring-2 ring-[#3b711e]/20'
                  : 'bg-white/80 border-stone-200 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#a3d47a] text-[#0d1f15] flex items-center justify-center shrink-0">
                  <Truck className="w-7 h-7 text-[#0d1f15]" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-[#0d1f15]">HOME DELIVERY</h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Get your everyday essentials and fresh food delivered to your doorstep.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 ml-2">
                <ArrowRight className="w-4 h-4 text-stone-700" />
              </div>
            </button>

            {/* Card 2: Pick Up From Store */}
            <button
              onClick={() => setFulfilmentMode('pickup')}
              className={`p-6 rounded-3xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                fulfilmentMode === 'pickup'
                  ? 'bg-white border-[#3b711e] shadow-md ring-2 ring-[#3b711e]/20'
                  : 'bg-white/80 border-stone-200 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#a3d47a] text-[#0d1f15] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-7 h-7 text-[#0d1f15]" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-[#0d1f15]">PICK UP FROM STORE</h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Order ahead and collect from your nearest VillageDELI.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 ml-2">
                <ArrowRight className="w-4 h-4 text-stone-700" />
              </div>
            </button>

            {/* Card 3: Shop In Store */}
            <Link
              to="/locations"
              className="p-6 rounded-3xl border bg-white/80 hover:bg-white border-stone-200 transition-all text-left flex items-center justify-between shadow-2xs hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#a3d47a] text-[#0d1f15] flex items-center justify-center shrink-0">
                  <Store className="w-7 h-7 text-[#0d1f15]" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-[#0d1f15]">SHOP IN STORE</h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Visit your nearest VillageDELI — open 24/7.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 ml-2">
                <ArrowRight className="w-4 h-4 text-stone-700" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ORDERING TOOLBAR (PDF PAGE 13) */}
      {/* ============================================================== */}
      <section className="py-4 bg-white border-b border-stone-200 shadow-2xs">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Deliver To Selector */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-full px-4 py-2 text-xs w-full lg:w-auto">
              <MapPin className="w-4 h-4 text-[#3b711e] shrink-0" />
              <div className="flex items-center gap-1 font-semibold text-stone-800">
                <span>Deliver to:</span>
                <span className="font-bold text-[#0d1f15]">Sector 109, Gurugram, Haryana - 122017</span>
              </div>
            </div>

            {/* Live Search */}
            <div className="relative flex-grow max-w-xl w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for fresh produce, groceries, meals and more..."
                className="w-full pl-9 pr-24 py-2.5 rounded-full border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#3b711e] bg-stone-50"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-4 py-1.5 rounded-full uppercase"
              >
                Search
              </button>
            </div>

            {/* 3 Timing Action Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#3b711e] bg-[#eef5ea] text-xs font-bold text-[#0d1f15]">
                <Clock className="w-3.5 h-3.5 text-[#3b711e]" />
                <span>Deliver Now (30–60 mins)</span>
              </button>

              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>Schedule Delivery</span>
              </button>

              <Link
                to="/locations"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700"
              >
                <Store className="w-3.5 h-3.5 text-stone-500" />
                <span>Choose Nearest Store</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SHOP BY CATEGORY (PDF PAGE 12 & 13) */}
      {/* ============================================================== */}
      <section className="py-10 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
              Shop by Category
            </h2>
            <Link
              to="/what-we-offer"
              className="text-xs font-bold text-[#3b711e] hover:underline flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categoryItems.map(item => (
              <button
                key={item.slug}
                onClick={() => handleCategorySelect(item.slug)}
                className={`group block relative rounded-2xl overflow-hidden shadow-2xs hover:shadow-md border transition-all aspect-[4/5] cursor-pointer text-left ${
                  activeCategory === item.slug
                    ? 'border-[#3b711e] ring-2 ring-[#3b711e]'
                    : 'border-stone-300/80'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white leading-tight block drop-shadow-sm font-sans">
                    {item.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CLUB & APP DOWNLOAD BANNER (PDF PAGE 12 & 13) */}
      {/* ============================================================== */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: VillageDELI Club */}
            <div className="lg:col-span-7 bg-[#0d1f15] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#173323] border border-[#6cb33f]/40 flex items-center justify-center text-[#fed100] shrink-0">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-[#fed100] uppercase block">
                    VILLAGEDELI CLUB
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Shop. Earn. Enjoy.
                  </h3>
                  <p className="text-xs text-stone-300 font-light">
                    Earn points on every purchase and enjoy exclusive offers, free treats and more.
                  </p>
                </div>
              </div>

              <Link
                to="/club"
                className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-colors shrink-0 shadow-xs"
              >
                JOIN NOW →
              </Link>
            </div>

            {/* Right: VillageDELI on the Go */}
            <div className="lg:col-span-5 bg-[#eef5ea] rounded-3xl p-6 border border-[#6cb33f]/30 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black tracking-widest text-[#3b711e] uppercase block">
                  ORDER CONVENIENCE
                </span>
                <h4 className="text-lg font-serif font-bold text-[#0d1f15]">
                  VillageDELI on the Go
                </h4>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Order easily, track your order and discover exclusive offers.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-[#0d1f15] text-white px-2.5 py-1 rounded-md">App Store</span>
                  <span className="text-[10px] font-bold bg-[#0d1f15] text-white px-2.5 py-1 rounded-md">Google Play</span>
                </div>
              </div>

              <img
                src="/assets/mockup/order_mobile_screens.webp"
                alt="VillageDELI App Screens"
                className="w-24 sm:w-28 object-contain shrink-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FRESH MEALS & TODAY'S SPECIAL OFFERS (PDF PAGE 12) */}
      {/* ============================================================== */}
      <section className="py-10 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Fresh Meals Anytime */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-black text-[#0d1f15]">
                    Fresh Meals, <span className="text-[#6cb33f]">Anytime.</span>
                  </h3>
                  <p className="text-xs text-stone-600">
                    From breakfast to dinner — delicious, freshly prepared meals for every craving.
                  </p>
                </div>
                <Link
                  to="/category/fresh-food"
                  className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-colors shrink-0"
                >
                  ORDER FRESH FOOD →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mealCards.map((m, mIdx) => (
                  <Link
                    key={mIdx}
                    to={m.link}
                    className="group block rounded-2xl overflow-hidden border border-stone-200 bg-[#fafaf7] p-2 text-center space-y-2 hover:shadow-md transition-all"
                  >
                    <div className="h-20 rounded-xl overflow-hidden bg-stone-100">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-106 transition-transform" />
                    </div>
                    <span className="text-[11px] font-bold text-[#0d1f15] block leading-tight">{m.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Today's Special Offers */}
            <div className="lg:col-span-4 bg-[#12281c] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xl border border-white/10">
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-[#fed100] uppercase block">
                  LIMITED TIME SAVINGS
                </span>
                <h3 className="text-2xl font-serif font-black text-white">
                  Today's Special Offers
                </h3>
                <p className="text-xs text-stone-300 font-light">
                  Great value on your everyday favourites. Save on seasonal produce, fresh dairy, and pantry essentials.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/category/fresh-produce"
                  className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-colors shadow-md"
                >
                  VIEW OFFERS →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. REAL PRODUCTS CATALOGUE (ZERO DEMO PRODUCTS REQUIREMENT) */}
      {/* ============================================================== */}
      <section id="catalog-products" ref={productsSectionRef} className="py-12 bg-white scroll-mt-24">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-black text-[#0d1f15]">
                {activeCategory ? `Department: ${activeCategory}` : 'All Catalog Items'}
              </h2>
              <p className="text-xs text-stone-500">
                Showing live catalog inventory ({filteredProducts.length} items available)
              </p>
            </div>
            {activeCategory && (
              <button
                onClick={() => handleCategorySelect('')}
                className="text-xs font-bold text-[#3b711e] hover:underline"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#fafaf7] rounded-3xl border border-stone-200/80 p-8 max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#eef5ea] text-[#3b711e] flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-[#3b711e]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0d1f15]">
                No products available yet.
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Our catalog is freshly set up without preloaded demo items. As soon as store administrators add fresh produce, they will instantly appear here!
              </p>
              <div className="pt-2">
                <Link
                  to="/what-we-offer"
                  className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-wider transition-colors shadow-xs"
                >
                  Explore Store Departments
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

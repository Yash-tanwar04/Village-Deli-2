import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Filter,
  Package,
  SlidersHorizontal,
  X,
  Leaf,
  ShieldCheck,
  Truck,
  Sparkles,
  Apple,
  UtensilsCrossed,
  Croissant,
  ShoppingCart,
  Milk,
  Drumstick,
  Coffee,
  Home,
  CheckCircle2
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { Product, Category } from '../types';
import { api } from '../lib/api';

const CATEGORY_TABS = [
  { name: 'Fresh Produce', slug: 'fresh-produce', icon: Apple },
  { name: 'Fresh Food', slug: 'fresh-food', icon: UtensilsCrossed },
  { name: 'Bakery & Snacks', slug: 'bakery-snacks', icon: Croissant },
  { name: 'Groceries & Essentials', slug: 'groceries-essentials', icon: ShoppingCart },
  { name: 'Dairy & Chilled Items', slug: 'dairy-chilled', icon: Milk },
  { name: 'Meat & Proteins', slug: 'meat-proteins', icon: Drumstick },
  { name: 'Coffee & Beverages', slug: 'coffee-beverages', icon: Coffee },
  { name: 'Personal Care & Household', slug: 'personal-household', icon: Home },
];

export const CategoryProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(['Fruits']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['VillageDELI Fresh']);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'name-asc'>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadCategoryAndProducts();
  }, [slug]);

  const loadCategoryAndProducts = async () => {
    setLoading(true);
    try {
      const cats = await api.getCategories();

      const found = cats.find(c => c.slug === slug || c.id === slug);
      setCurrentCategory(found || null);

      if (found) {
        const prods = await api.getProducts({ category_id: found.id, status: 'published' });
        setProducts(prods);
      } else {
        const prods = await api.getProducts({ category_slug: slug, status: 'published' });
        setProducts(prods);
      }
    } catch (err) {
      console.error('Failed to load category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubcategory = (item: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(item) ? prev.filter(t => t !== item) : [...prev, item]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleDietary = (tag: string) => {
    setSelectedDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setMaxPrice(500);
    setSelectedDietary([]);
    setSortBy('recommended');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Dietary filter
    if (selectedDietary.length > 0) {
      result = result.filter(p =>
        p.dietary_tags && selectedDietary.some(tag => p.dietary_tags.includes(tag))
      );
    }

    // Price range filter
    result = result.filter(p => (p.discount_price ?? p.price) <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedDietary, maxPrice, sortBy]);

  const activeCategoryTitle = currentCategory?.name || (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Fresh Produce');

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16">
      {/* 1. HERO BANNER (PDF Page 14) */}
      <section className="relative bg-[#f7faf5] border-b border-stone-200 overflow-hidden">
        {/* Background photo right-aligned with chalkboard and vegetables */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-2/3 pointer-events-none opacity-40 lg:opacity-100">
          <img
            src="/assets/mockup/catalog_produce_basket_hero.webp"
            alt="Produce Basket"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5] via-[#f7faf5]/80 to-transparent lg:w-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
            <Link to="/" className="hover:text-[#6cb33f] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to="/order-now" className="hover:text-[#6cb33f] transition-colors">
              Catalogue
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[#0d1f15] font-bold">{activeCategoryTitle}</span>
          </nav>

          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#0d1f15] mb-3">
              {activeCategoryTitle}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              Farm-fresh fruits and vegetables, handpicked for quality, nutrition and great taste.
            </p>

            {/* 4 Feature Badges (Matching PDF Page 14) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { icon: Leaf, title: 'Freshly Sourced' },
                { icon: ShieldCheck, title: 'Quality Checked' },
                { icon: Truck, title: 'Farm to Your Home' },
                { icon: Sparkles, title: 'Wide Variety' },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border border-[#6cb33f] bg-white flex items-center justify-center text-[#6cb33f] shrink-0 shadow-2xs">
                    <badge.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#0d1f15] leading-tight">
                    {badge.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL CATEGORY PILLS BAR (Matching PDF Page 14) */}
      <section className="bg-white border-b border-stone-200 sticky top-16 z-20 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-3 min-w-max">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = slug === tab.slug || (!slug && tab.slug === 'fresh-produce');
            return (
              <Link
                key={tab.slug}
                to={`/category/${tab.slug}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#d9f2c8] text-[#0d1f15] border border-[#6cb33f]/50 shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#3b711e]' : 'text-stone-500'}`} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN CATALOG BODY (SIDEBAR + GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTERS (PDF Page 14) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-6 sticky top-32">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-black text-stone-900 text-base">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-stone-500 hover:text-[#6cb33f] underline transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-3">Category</h4>
              <div className="space-y-2 text-xs text-stone-600 font-medium">
                {['Fruits', 'Vegetables', 'Exotic Produce', 'Organic Range', 'Fresh Herbs'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(cat)}
                      onChange={() => toggleSubcategory(cat)}
                      className="w-4 h-4 text-[#6cb33f] rounded border-stone-300 focus:ring-[#6cb33f] cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-3 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-900 mb-3">Brand</h4>
              <div className="space-y-2 text-xs text-stone-600 font-medium">
                {['VillageDELI Fresh', 'Local Farms', 'Organic Harvest', "Nature's Basket"].map((brand) => (
                  <label key={brand} className="flex items-center gap-2.5 cursor-pointer hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 text-[#6cb33f] rounded border-stone-300 focus:ring-[#6cb33f] cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
                <button className="text-xs font-bold text-stone-500 hover:text-[#6cb33f] pt-1 block">
                  More Brands ▾
                </button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-900">Price Range</h4>
                <span className="text-xs font-bold text-[#3b711e]">₹0 – ₹{maxPrice}+</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#6cb33f]"
              />
            </div>

            {/* Dietary Preference Filter */}
            <div className="pt-3 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-900 mb-3">Dietary Preference</h4>
              <div className="space-y-2 text-xs text-stone-600 font-medium">
                {['Organic', 'Pesticide Free', 'Locally Sourced', 'Seasonal'].map((diet) => (
                  <label key={diet} className="flex items-center gap-2.5 cursor-pointer hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={selectedDietary.includes(diet)}
                      onChange={() => toggleDietary(diet)}
                      className="w-4 h-4 text-[#6cb33f] rounded border-stone-300 focus:ring-[#6cb33f] cursor-pointer"
                    />
                    <span>{diet}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID CONTAINER */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Bar: Count & Sort */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="text-xs font-semibold text-stone-700">
                Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items in{' '}
                <span className="capitalize">{activeCategoryTitle}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-400 hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#6cb33f]"
                  >
                    <option value="recommended">Featured / Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Alphabetical: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-14 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#f4f7f2] text-[#3b711e] flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-black text-stone-900 mb-2">
                  No products in this department yet.
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
                  {selectedDietary.length > 0 || maxPrice < 500
                    ? 'No products match your active filter criteria. Try clearing some filters to view more items.'
                    : 'This department currently has no items stocked. Our team replenishes fresh farm inventory daily.'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {selectedDietary.length > 0 || maxPrice < 500 ? (
                    <button
                      onClick={resetFilters}
                      className="bg-[#6cb33f] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#5aa132] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <Link
                      to="/order-now"
                      className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider"
                    >
                      <span>Browse All Departments</span>
                    </Link>
                  )}
                  <Link
                    to="/order-now"
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 px-4 py-2"
                  >
                    Return to All Departments
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* 4. VALUE PILLARS & BOTTOM BANNER (Matching PDF Page 14) */}
      <section className="bg-white border-t border-stone-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 3 Pillars */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#6cb33f] flex items-center justify-center text-[#6cb33f] shrink-0 bg-[#f4f7f2]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-stone-900 text-sm">Straight From Trusted Farms</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Fresh, local and seasonal produce for a healthier you.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#6cb33f] flex items-center justify-center text-[#6cb33f] shrink-0 bg-[#f4f7f2]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-stone-900 text-sm">Quality You Can Trust</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Carefully selected and quality checked.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-[#6cb33f] flex items-center justify-center text-[#6cb33f] shrink-0 bg-[#f4f7f2]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-stone-900 text-sm">Fresher Choices Everyday</h4>
                  <p className="text-xs text-stone-500 mt-0.5">A wide range of fruits, vegetables and organic options.</p>
                </div>
              </div>
            </div>

            {/* Dark Forest Green SHOP NOW Banner */}
            <div className="md:col-span-4 bg-[#0d1f15] text-white p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs sm:text-sm font-medium leading-snug">
                  Get Farm-Fresh Produce <br />
                  <span className="font-bold text-[#6cb33f]">delivered in 30–60 minutes.</span>
                </p>
              </div>
              <Link
                to="/order-now"
                className="relative z-10 shrink-0 bg-white hover:bg-stone-100 text-[#0d1f15] text-xs font-extrabold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <span>SHOP NOW</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#0d1f15]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2 font-serif font-bold text-stone-900 text-base">
                    <Filter className="w-5 h-5 text-[#6cb33f]" />
                    <span>Filter Products</span>
                  </div>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-stone-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 mb-2">Category</h5>
                    <div className="space-y-1.5 text-xs text-stone-700">
                      {['Fruits', 'Vegetables', 'Exotic Produce', 'Organic Range', 'Fresh Herbs'].map(cat => (
                        <label key={cat} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSubcategories.includes(cat)}
                            onChange={() => toggleSubcategory(cat)}
                            className="rounded text-[#6cb33f]"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <h5 className="text-xs font-bold text-stone-900 mb-2">Max Price: ₹{maxPrice}</h5>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#6cb33f]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#0d1f15] text-white text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

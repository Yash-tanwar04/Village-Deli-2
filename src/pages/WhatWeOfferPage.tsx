import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Leaf,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Croissant,
  Utensils,
  Coffee,
  Home,
  Milk,
  Clock,
  Moon,
  ArrowRight
} from 'lucide-react';

export const WhatWeOfferPage: React.FC = () => {
  const departments = [
    {
      title: 'Fresh Produce',
      desc: 'Handpicked fruits and vegetables with a focus on freshness, quality and local sourcing.',
      image: '/assets/mockup/cat_fresh_produce.webp',
      link: '/category/fresh-produce',
      icon: Leaf
    },
    {
      title: 'Fresh Bakery',
      desc: 'Freshly baked products for breakfast, snacking and everyday indulgence.',
      image: '/assets/mockup/cat_fresh_bakery.webp',
      link: '/category/bakery-snacks',
      icon: Croissant
    },
    {
      title: 'Quick Meals',
      desc: 'Freshly prepared food for busy mornings, lunch breaks, evening cravings and late-night hunger.',
      image: '/assets/mockup/cat_quick_meals.webp',
      link: '/category/fresh-food',
      icon: Utensils
    },
    {
      title: 'Groceries',
      desc: 'Your everyday staples, pantry essentials and household requirements.',
      image: '/assets/mockup/cat_groceries.webp',
      link: '/category/groceries-essentials',
      icon: ShoppingCart
    },
    {
      title: 'Dairy & Chilled',
      desc: 'Daily dairy, chilled products and other fresh essentials.',
      image: '/assets/mockup/cat_dairy_chilled.webp',
      link: '/category/dairy-chilled',
      icon: Milk
    },
    {
      title: 'Meat & Proteins',
      desc: 'Fresh meat and protein options where available.',
      image: '/assets/mockup/cat_meat_proteins.webp',
      link: '/category/meat-proteins',
      icon: ShoppingBag
    },
    {
      title: 'Coffee & Beverages',
      desc: 'From everyday beverages to freshly prepared drinks.',
      image: '/assets/mockup/cat_coffee_beverages.webp',
      link: '/category/coffee-beverages',
      icon: Coffee
    },
    {
      title: 'Personal & Home Essentials',
      desc: 'Everything from personal care to household necessities.',
      image: '/assets/mockup/cat_personal_household.webp',
      link: '/category/personal-care-household',
      icon: Home
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#3b711e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">What We Offer</span>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 4) */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-10 sm:py-16">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                WHAT WE OFFER
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.1]">
                Everything You Need. <br />
                <span className="text-[#6cb33f] font-serif font-normal italic">Always Fresh.</span>
              </h1>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                From farm-fresh fruits and vegetables to freshly prepared meals, bakery, beverages, dairy, meats and everyday essentials — VillageDELI offers a complete range of products and services, thoughtfully curated for your everyday life.
              </p>

              {/* 3 Icons */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <div className="w-7 h-7 rounded-full bg-[#eef5ea] text-[#3b711e] flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span>Quality Products</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <div className="w-7 h-7 rounded-full bg-[#eef5ea] text-[#3b711e] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span>Wide Range</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <div className="w-7 h-7 rounded-full bg-[#eef5ea] text-[#3b711e] flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span>Great Value</span>
                </div>
              </div>
            </div>

            {/* Right Photo: Store Interior from Page 4 */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src="/assets/mockup/offer_hero_store.webp"
                  alt="VillageDELI Store Interior and Fresh Food Aisles"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 8 OFFERINGS CARDS (PDF PAGE 4) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={dept.link}
                    className="block bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-lg transition-all h-full flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="relative h-44 overflow-hidden bg-stone-900">
                        <img
                          src={dept.image}
                          alt={dept.title}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-[#6cb33f] text-[#0d1f15] flex items-center justify-center shadow-md">
                          <Icon className="w-4 h-4 text-[#0d1f15]" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-serif font-bold text-[#0d1f15] group-hover:text-[#3b711e] transition-colors">
                          {dept.title}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed font-normal">
                          {dept.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#3b711e]">
                        <span>Browse Department</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FRESHLY PREPARED FOOD BANNER (PDF PAGE 4) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#0d1f15] text-white">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-black tracking-widest text-[#fed100] uppercase block">
                FRESHLY PREPARED FOOD
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
                Great Food. <br />
                <span className="text-[#6cb33f]">Anytime.</span>
              </h2>
              <p className="text-xs text-stone-300 font-light leading-relaxed pt-1">
                Delicious, freshly prepared meals made with quality ingredients — perfect for your breakfast, lunch, dinner or a quick bite in between.
              </p>
            </div>

            {/* Middle 4 Meal Times */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#173323] p-3 rounded-2xl border border-white/10 space-y-1">
                <Clock className="w-5 h-5 text-[#fed100] mx-auto" />
                <div className="text-[10px] font-bold uppercase text-white">Breakfast On The Go</div>
              </div>
              <div className="bg-[#173323] p-3 rounded-2xl border border-white/10 space-y-1">
                <Utensils className="w-5 h-5 text-[#6cb33f] mx-auto" />
                <div className="text-[10px] font-bold uppercase text-white">Lunch Delights</div>
              </div>
              <div className="bg-[#173323] p-3 rounded-2xl border border-white/10 space-y-1">
                <ShoppingBag className="w-5 h-5 text-[#fed100] mx-auto" />
                <div className="text-[10px] font-bold uppercase text-white">Evening Cravings</div>
              </div>
              <div className="bg-[#173323] p-3 rounded-2xl border border-white/10 space-y-1">
                <Moon className="w-5 h-5 text-[#6cb33f] mx-auto" />
                <div className="text-[10px] font-bold uppercase text-white">Late Night Options</div>
              </div>
            </div>

            {/* Right CTA Button & Bowl Media */}
            <div className="lg:col-span-3 flex items-center justify-between sm:justify-end gap-4">
              <Link
                to="/category/fresh-food"
                className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3.5 rounded-full uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                EXPLORE OUR FOOD →
              </Link>
              <img
                src="/assets/mockup/offer_pasta_bowl.webp"
                alt="Chef prepared fresh bowl"
                className="w-20 h-20 rounded-2xl object-cover border border-white/20 hidden sm:block shrink-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

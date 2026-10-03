import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Store,
  ShoppingCart,
  ChefHat,
  Users,
  Play,
  Leaf,
  Package,
  Croissant,
  Utensils,
  Droplets,
  Building2,
  Milk,
  Drumstick,
  Coffee,
  Heart,
  ShoppingBag
} from 'lucide-react';

export const HubPage: React.FC = () => {
  const experiences = [
    {
      img: '/assets/mockup/hub_exp_produce.webp',
      icon: Leaf,
      title: 'Fresh Produce',
      desc: 'Handpicked fruits, vegetables and seasonal produce from trusted farmers.',
    },
    {
      img: '/assets/mockup/hub_exp_gourmet.webp',
      icon: Package,
      title: 'Gourmet Grocery',
      desc: 'A wide range of premium, local and international brands.',
    },
    {
      img: '/assets/mockup/hub_exp_bakery.webp',
      icon: Croissant,
      title: 'Bakery',
      desc: 'Freshly baked breads, pastries, cakes and artisanal treats every day.',
    },
    {
      img: '/assets/mockup/hub_exp_food_counters.webp',
      icon: Utensils,
      title: 'Live Food Counters',
      desc: 'Authentic cuisines, freshly prepared, all day.',
    },
    {
      img: '/assets/mockup/hub_exp_cold_press_oils.webp',
      icon: Droplets,
      title: 'Cold Press Oils',
      desc: 'Pure, natural oils pressed fresh in-store.',
    },
    {
      img: '/assets/mockup/hub_exp_milling.webp',
      icon: Building2,
      title: 'Onsite Milling',
      desc: 'Freshly ground flours, spices and blends for better flavour and nutrition.',
    },
    {
      img: '/assets/mockup/hub_exp_dairy.webp',
      icon: Milk,
      title: 'Dairy & Chilled',
      desc: 'Farm fresh milk, dairy products and chilled essentials.',
    },
    {
      img: '/assets/mockup/hub_exp_meat.webp',
      icon: Drumstick,
      title: 'Meats & Seafood',
      desc: 'High-quality, fresh and hygienic meat, poultry and seafood.',
    },
    {
      img: '/assets/mockup/hub_exp_coffee.webp',
      icon: Coffee,
      title: 'Coffee & Beverages',
      desc: 'Specialty coffee, fresh juices, smoothies and beverages.',
    },
    {
      img: '/assets/mockup/hub_exp_prepared_meals.webp',
      icon: ChefHat,
      title: 'Prepared Meals',
      desc: 'Wholesome, convenient and delicious meals for every occasion.',
    },
    {
      img: '/assets/mockup/hub_exp_health_wellness.webp',
      icon: Heart,
      title: 'Health & Wellness',
      desc: 'Organic, natural and health-focused products.',
    },
    {
      img: '/assets/mockup/hub_exp_essentials.webp',
      icon: ShoppingBag,
      title: 'Everyday Essentials',
      desc: 'All your daily household needs, always available.',
    },
  ];

  const communitySpaces = [
    {
      img: '/assets/mockup/hub_community_cafe.webp',
      title: 'In-Store Café & Dining',
      desc: 'Enjoy freshly brewed specialty coffee, artisanal sandwiches, and hot snacks.',
    },
    {
      img: '/assets/mockup/hub_community_events.webp',
      title: 'Community Events',
      desc: 'Weekend cooking demonstrations, masterclasses, and nutrition workshops.',
    },
    {
      img: '/assets/mockup/hub_community_tasting.webp',
      title: 'Tasting Sessions',
      desc: 'Sample artisanal cheeses, new seasonal harvests, and gourmet creations.',
    },
    {
      img: '/assets/mockup/hub_community_family.webp',
      title: 'A Family Destination',
      desc: 'Spacious aisles, interactive kids areas, and relaxed dining for the whole family.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16">
      {/* 1. HERO BANNER (PDF Page 16) */}
      <section className="relative bg-[#f7faf5] border-b border-stone-200 overflow-hidden">
        {/* Right side background hero graphic with grand store interior */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none opacity-30 lg:opacity-100">
          <img
            src="/assets/mockup/hub_grand_interior_hero.webp"
            alt="VillageDELI Hub Interior"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5] via-[#f7faf5]/80 to-transparent lg:w-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
            <Link to="/" className="hover:text-[#6cb33f] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[#0d1f15] font-bold">VillageDELI Hub</span>
          </nav>

          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.08] mb-4">
              More Than a Store. <br />
              <span className="text-[#6cb33f]">A Food Destination.</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              VillageDELI Hub is our flagship gourmet destination, bringing together the freshest produce,
              artisanal products, live food counters, bakery, café and everyday essentials — all under one roof.
            </p>

            <div className="pt-2 mb-8">
              <a
                href="#experiences"
                className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#5aa132] text-white text-xs font-black px-6 py-3 rounded-full transition-colors uppercase tracking-wider shadow-sm"
              >
                <span>EXPLORE THE HUB</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { icon: Store, title: '7,500+ Sq. Ft. Large Format' },
                { icon: ShoppingCart, title: 'Fresh Food to Everyday Essentials' },
                { icon: ChefHat, title: 'Live Counters & Kitchen' },
                { icon: Users, title: 'A Unique Food Experience' },
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

      {/* 2. DISCOVER WHAT AWAITS YOU (12 EXPERIENCE CARDS) (PDF Page 16) */}
      <section id="experiences" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0d1f15]">
              Discover What <br />
              <span className="text-[#6cb33f]">Awaits You</span>
            </h2>
            <div className="w-12 h-1 bg-[#6cb33f] rounded-full mt-2" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-xl">
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
              From farm-fresh produce to gourmet groceries, freshly prepared meals and artisanal delights,
              VillageDELI Hub offers a complete food experience for the whole family.
            </p>
            <button className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 border border-[#6cb33f] text-[#0d1f15] hover:bg-[#f4f7f2] text-xs font-black px-4 py-2.5 rounded-full transition-colors">
              <span>TAKE A VIRTUAL TOUR</span>
              <div className="w-5 h-5 rounded-full bg-[#6cb33f] text-white flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current" />
              </div>
            </button>
          </div>
        </div>

        {/* 12 Experience Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="h-28 bg-stone-100 overflow-hidden relative">
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Floating circular icon badge */}
                <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-[#f4f7f2] border border-[#6cb33f]/50 flex items-center justify-center text-[#6cb33f] shadow-2xs">
                  <exp.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="p-3 flex flex-col flex-1 justify-between">
                <h3 className="text-xs font-serif font-black text-[#0d1f15] leading-snug">
                  {exp.title}
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                  {exp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. A PLACE TO SHOP, DINE & UNWIND + 4 COMMUNITY CARDS + FIND A HUB (PDF Page 16) */}
      <section className="bg-white border-t border-stone-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
            {/* Dining Interior Photo + Dark green title card */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden border border-stone-200 shadow-xs">
              <div className="h-56 sm:h-auto bg-stone-100">
                <img
                  src="/assets/mockup/hub_dining_area.webp"
                  alt="In-Store Dining"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#0d1f15] text-white p-6 sm:p-7 flex flex-col justify-center">
                <h3 className="text-2xl font-serif font-black leading-tight text-white mb-3">
                  A Place to <br />
                  <span className="text-[#6cb33f]">Shop, Dine & Unwind</span>
                </h3>
                <div className="w-10 h-0.5 bg-[#6cb33f] mb-3" />
                <p className="text-xs text-stone-300 leading-relaxed">
                  VillageDELI Hub is not just a store, it's a community space where great food, good coffee and
                  comfortable spaces come together.
                </p>
              </div>
            </div>

            {/* 4 Community Experience Cards (4 cols) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              {communitySpaces.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#fafaf7] rounded-xl border border-stone-200 overflow-hidden flex flex-col group hover:shadow-xs transition-shadow"
                >
                  <div className="h-20 bg-stone-200 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <h4 className="text-[11px] font-serif font-bold text-[#0d1f15] leading-tight text-center">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Hub Near You Card (2 cols) */}
            <div className="lg:col-span-2 bg-[#f7faf5] border border-stone-200 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-2xs">
              <div className="w-12 h-12 rounded-full border border-[#6cb33f] bg-white flex items-center justify-center text-[#6cb33f] mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-black text-[#0d1f15] leading-tight mb-2">
                  Experience VillageDELI Hub Near You
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Visit our flagship stores and discover a world of fresh food, great flavours and more.
                </p>
              </div>
              <Link
                to="/locations"
                className="mt-4 w-full bg-[#6cb33f] hover:bg-[#5aa132] text-white text-[11px] font-black py-2.5 px-3 rounded-full transition-colors flex items-center justify-center gap-1 uppercase tracking-wider shadow-2xs"
              >
                <span>FIND A HUB</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

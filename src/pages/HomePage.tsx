import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  ShoppingCart,
  Clock,
  Leaf,
  Utensils,
  ShoppingBag,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  // 5 Feature Bar Items from Page 1
  const features = [
    {
      icon: Clock,
      title: '24/7 CONVENIENCE',
      desc: 'Always open. Always here for you.'
    },
    {
      icon: Leaf,
      title: 'FRESH & LOCAL FIRST',
      desc: 'Handpicked produce, local staples and quality food.'
    },
    {
      icon: Utensils,
      title: 'FOOD FOR EVERY CRAVING',
      desc: 'Quick meals, bakery, beverages and healthy options.'
    },
    {
      icon: ShoppingBag,
      title: 'ONE STOP EVERY NEED',
      desc: 'Groceries, dairy, meats, personal care, household and more.'
    },
    {
      icon: ShieldCheck,
      title: 'TRUSTED QUALITY',
      desc: 'Hygienic, reliable and consistent products you can depend on.'
    }
  ];

  // 8 Category Cards from Page 1
  const categories = [
    {
      name: 'FRESH PRODUCE',
      image: '/assets/mockup/cat_fresh_produce.webp',
      path: '/category/fresh-produce'
    },
    {
      name: 'FRESH BAKERY',
      image: '/assets/mockup/cat_fresh_bakery.webp',
      path: '/category/bakery-snacks'
    },
    {
      name: 'QUICK MEALS',
      image: '/assets/mockup/cat_quick_meals.webp',
      path: '/category/fresh-food'
    },
    {
      name: 'GROCERIES',
      image: '/assets/mockup/cat_groceries.webp',
      path: '/category/groceries-essentials'
    },
    {
      name: 'DAIRY & CHILLED',
      image: '/assets/mockup/cat_dairy_chilled.webp',
      path: '/category/dairy-chilled'
    },
    {
      name: 'MEAT & PROTEINS',
      image: '/assets/mockup/cat_meat_proteins.webp',
      path: '/category/meat-proteins'
    },
    {
      name: 'COFFEE & BEVERAGES',
      image: '/assets/mockup/cat_coffee_beverages.webp',
      path: '/category/coffee-beverages'
    },
    {
      name: 'PERSONAL & HOME ESSENTIALS',
      image: '/assets/mockup/cat_personal_household.webp',
      path: '/category/personal-care-household'
    }
  ];

  // Gateway Cards to Explore VillageDELI Sections
  const gatewaySections = [
    {
      title: 'What We Offer',
      subtitle: '8 Departments & Fresh Meals',
      desc: 'From farm-fresh produce to chef-crafted hot meals and live baking, discover our complete range.',
      link: '/what-we-offer',
      image: '/assets/mockup/offer_hero_store.webp',
      badge: 'DEPARTMENTS'
    },
    {
      title: 'Our Formats',
      subtitle: 'Neighbourhood, Hub & Highway',
      desc: '4 tailored store formats engineered for residential colonies, expressway hubs, and transit stations.',
      link: '/formats',
      image: '/assets/mockup/format_hero_flagship.webp',
      badge: '4 FORMATS'
    },
    {
      title: 'Fresh From The Source',
      subtitle: 'Direct Farmer Partnerships',
      desc: 'Trace our harvest-to-table supply chain with local farmers across Haryana, Punjab and Himachal.',
      link: '/source',
      image: '/assets/mockup/source_farmer_harvest_hero.webp',
      badge: 'DIRECT FARMING'
    },
    {
      title: 'Find Your Store',
      subtitle: '50+ Locations Across North India',
      desc: 'Locate 24/7 stores in Gurugram, Delhi NCR, and highway expressways with instant directions.',
      link: '/locations',
      image: '/assets/mockup/locations_ncr_map.webp',
      badge: '50+ LOCATIONS'
    },
    {
      title: 'VillageDELI Club',
      subtitle: 'Exclusive Rewards & Savings',
      desc: 'Earn points on every purchase, enjoy member-only discounts, and claim free birthday treats.',
      link: '/club',
      image: '/assets/mockup/club_mobile_hand_hero.webp',
      badge: 'MEMBERSHIP'
    },
    {
      title: 'Careers That Matter',
      subtitle: 'Join Our Growing Family',
      desc: 'Frontline store management, food production, technology, and corporate growth opportunities.',
      link: '/careers',
      image: '/assets/mockup/career_employee_hero.webp',
      badge: 'WE ARE HIRING'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 1) */}
      {/* ============================================================== */}
      <section className="relative bg-[#0d1f15] text-white overflow-hidden border-b border-[#1b3d2b]">
        {/* Background glow & subtle pattern */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-1.5"
              >
                <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-white/90 uppercase block font-sans">
                  YOUR NEIGHBOURHOOD.
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.08]">
                  YOUR EVERYDAY STORE.
                </h1>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#6cb33f] leading-[1.08]">
                  YOUR 24/7 DELI.
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="space-y-3 text-stone-300 text-sm sm:text-base font-normal leading-relaxed max-w-xl"
              >
                <p>
                  Fresh food, everyday essentials and everything you need — available around the clock.
                </p>
                <p>
                  From farm-fresh fruits and vegetables to freshly prepared meals, bakery, beverages, dairy, meats and daily essentials, VillageDELI brings a better kind of convenience closer to home.
                </p>
              </motion.div>

              {/* Two CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-2"
              >
                <Link
                  to="/locations"
                  className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7bc748] text-[#0d1f15] font-black text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all shadow-lg hover:scale-102 cursor-pointer uppercase tracking-wider"
                >
                  <MapPin className="w-4 h-4 text-[#0d1f15]" />
                  <span>FIND YOUR STORE</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/order-now"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-white/60 hover:border-white transition-all shadow-md cursor-pointer uppercase tracking-wider"
                >
                  <ShoppingCart className="w-4 h-4 text-[#fed100]" />
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            </div>

            {/* Right Media Column (Photo with Store Signs from Page 1) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
                <img
                  src="/assets/mockup/home_hero_store.webp"
                  alt="VillageDELI 24/7 Storefront and Fresh Departments"
                  className="w-full h-80 sm:h-[420px] lg:h-[460px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 bg-[#0d1f15]/85 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6cb33f] animate-pulse" />
                  <span>Open 24/7 • Fresh Stock Updated Hourly</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 5 FEATURE ICONS BAR (PDF PAGE 1) */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-stone-200/80 py-8 sm:py-10 shadow-2xs">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 lg:gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-3.5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#a3d47a] text-[#0d1f15] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#0d1f15]" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-[#0d1f15] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. WHAT YOU CAN FIND AT VILLAGEDELI (PDF PAGE 1) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#eef5ea] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                WHAT YOU CAN FIND AT VILLAGEDELI
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0d1f15]">
                Everything You Need. <br className="sm:hidden" />
                <span className="text-[#3b711e] font-serif font-normal italic ml-0 sm:ml-2">
                  And A Little More.
                </span>
              </h2>
            </div>

            <Link
              to="/what-we-offer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-400/80 hover:border-[#0d1f15] bg-white/60 hover:bg-white text-stone-800 hover:text-[#0d1f15] text-xs font-bold uppercase tracking-wider transition-all shadow-2xs self-start sm:self-auto shrink-0"
            >
              <span>→ EXPLORE ALL CATEGORIES</span>
            </Link>
          </div>

          {/* 8 Category Cards with exact photo assets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={cat.path}
                  className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-300/80 bg-stone-900 transition-all aspect-[4/5]"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white leading-tight block drop-shadow-sm font-sans">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. GATEWAY CHAPTERS: DEDICATED SECTIONS ACCESSIBLE FROM HOME */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-1.5">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                DISCOVER OUR ECOSYSTEM
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0d1f15]">
                A Brand Built For Modern India
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm font-normal max-w-2xl pt-1">
                Explore our store architecture, farm-to-table network, club loyalty privileges, and nationwide footprint.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gatewaySections.map((sec, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <Link
                  to={sec.link}
                  className="flex flex-col justify-between h-full bg-[#fafaf7] hover:bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-xl transition-all"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={sec.image}
                        alt={sec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#0d1f15]/85 backdrop-blur-xs text-[#fed100] text-[9.5px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {sec.badge}
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <span className="text-[10px] font-extrabold tracking-widest text-[#3b711e] uppercase block">
                        {sec.subtitle}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#0d1f15] group-hover:text-[#3b711e] transition-colors">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-normal">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-[#3b711e]">
                      <span>Explore Chapter</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. 50+ LOCATIONS & ORDER CTA BANNER */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#0d1f15] text-white">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#142e20] to-[#0d1f15] p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="text-xs font-black tracking-widest text-[#fed100] uppercase block">
                CONVENIENCE NEVER SLEEPS • 50+ LOCATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Always Fresh. Always Close. Always Here For You.
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm font-light">
                Shop in person at our 24/7 stores or order online for 30–60 minute hyper-local delivery straight to your doorstep.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
              <Link
                to="/order-now"
                className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all shadow-md uppercase tracking-wider"
              >
                Order Groceries Online
              </Link>
              <Link
                to="/locations"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-white/30 transition-all uppercase tracking-wider"
              >
                View 50+ Store Locations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

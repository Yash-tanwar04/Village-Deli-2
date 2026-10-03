import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Clock,
  Leaf,
  ShoppingBag,
  Store,
  CheckCircle2
} from 'lucide-react';

export const FormatsPage: React.FC = () => {
  const formats = [
    {
      id: 'neighbourhood',
      tag: 'NEIGHBOURHOOD STORE',
      badge: '500 – 1,500 SQ. FT.',
      headline: 'Right Here',
      headlineAccent: 'In Your Neighbourhood.',
      desc: 'Your everyday local store with fresh produce, groceries, quick meals, bakery, beverages, dairy, meats and essentials — available 24/7.',
      specs: '500 – 1,500 sq.ft.',
      hours: 'Open 24/7',
      bullets: [
        'Fresh produce and local staples',
        'Quick meals, bakery and beverages',
        'Groceries, dairy, meats and essentials',
        'Convenient locations in your neighbourhood'
      ],
      image: '/assets/mockup/format_neighbourhood_card.webp',
      cta: 'EXPLORE NEIGHBOURHOOD STORES →',
      link: '/locations'
    },
    {
      id: 'hub',
      tag: 'VILLAGEDELI HUB',
      badge: '7,500+ SQ. FT.',
      headline: 'A Bigger',
      headlineAccent: 'Freshness Experience.',
      desc: 'A world-class gourmet neighbourhood destination with expanded fresh produce, onsite milling, bakery, cold-press oils and juices, prepared food, dairy, meats and more.',
      specs: '7,500+ sq.ft.',
      hours: 'Open 24/7',
      bullets: [
        'Onsite milling, bakery and cold-press oils',
        'Expanded fresh produce and gourmet range',
        'Fresh food, dine-in, takeaway and delivery',
        'Dairy, meats, groceries and everyday essentials'
      ],
      image: '/assets/mockup/format_hub_card.webp',
      cta: 'EXPLORE VILLAGEDELI HUBS →',
      link: '/hub'
    },
    {
      id: 'highway',
      tag: 'HIGHWAY STORE',
      badge: '1,500 – 3,000 SQ. FT.',
      headline: 'For Every',
      headlineAccent: 'Journey Ahead.',
      desc: 'A 24/7 stop for travellers with fresh food, beverages, groceries and everyday essentials — designed for your immediate cravings on the road.',
      specs: '1,500 – 3,000 sq.ft.',
      hours: 'Open 24/7',
      bullets: [
        'Fresh food and hot beverages',
        'Groceries and travel essentials',
        'Quick service and easy access',
        'Ideal for highway and transit locations'
      ],
      image: '/assets/mockup/format_highway_card.webp',
      cta: 'EXPLORE HIGHWAY STORES →',
      link: '/locations'
    },
    {
      id: 'petrol',
      tag: 'PETROL PUMP STORE',
      badge: '500 – 1,500 SQ. FT.',
      headline: 'Convenience',
      headlineAccent: 'On The Move.',
      desc: 'Convenience where mobility meets everyday needs. Grab a coffee, pick up essentials, get something to eat and get back on the road.',
      specs: '500 – 1,500 sq.ft.',
      hours: 'Open 24/7',
      bullets: [
        'Quick meals, snacks and beverages',
        'Everyday groceries and essentials',
        'Fresh produce and dairy (select locations)',
        'Designed for fuel stations and transit points'
      ],
      image: '/assets/mockup/format_petrol_card.webp',
      cta: 'EXPLORE PETROL PUMP STORES →',
      link: '/locations'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-16 sm:pt-20">
      {/* BREADCRUMB */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#3b711e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold">Our Formats</span>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (PDF PAGE 5) */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-10 sm:py-16">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#3b711e] uppercase block font-sans">
                OUR FORMATS
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0d1f15] leading-[1.1]">
                VillageDELI, <br />
                <span className="text-[#6cb33f] font-serif font-normal italic">Wherever Life Takes You.</span>
              </h1>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                From neighbourhood stores to highway locations and large food hubs, VillageDELI is designed around different moments of your everyday life — always close, always convenient, always fresh.
              </p>

              {/* 4 Hero Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Clock className="w-4 h-4 text-[#3b711e]" />
                  <span>Open 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Leaf className="w-4 h-4 text-[#3b711e]" />
                  <span>Fresh Always</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <ShoppingBag className="w-4 h-4 text-[#3b711e]" />
                  <span>Everyday Essentials</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Store className="w-4 h-4 text-[#3b711e]" />
                  <span>For Every Neighbourhood</span>
                </div>
              </div>
            </div>

            {/* Right Photo: Flagship storefront from Page 5 */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src="/assets/mockup/format_hero_flagship.webp"
                  alt="VillageDELI Flagship 24/7 Storefront"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 4 FORMAT CARDS (PDF PAGE 5 & 6) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#fafaf7] border-b border-stone-200">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map((fmt) => (
              <motion.div
                key={fmt.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 overflow-hidden bg-stone-900">
                    <img
                      src={fmt.image}
                      alt={fmt.tag}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#6cb33f] text-[#0d1f15] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {fmt.badge}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#3b711e] block">
                        {fmt.tag}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#0d1f15] mt-1 leading-snug">
                        {fmt.headline} <span className="text-[#6cb33f]">{fmt.headlineAccent}</span>
                      </h3>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {fmt.desc}
                    </p>

                    {/* Specs Box */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fafaf7] border border-stone-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#0d1f15]">
                        <Store className="w-4 h-4 text-[#3b711e]" />
                        <span>{fmt.specs}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-[#0d1f15]">
                        <Clock className="w-4 h-4 text-[#fed100]" />
                        <span>{fmt.hours}</span>
                      </div>
                    </div>

                    {/* Checkmarks */}
                    <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
                      {fmt.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3b711e] shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-6 pt-0">
                  <Link
                    to={fmt.link}
                    className="w-full block text-center py-2.5 px-4 rounded-full border border-stone-300 hover:border-[#0d1f15] text-[11px] font-bold uppercase tracking-wider text-[#0d1f15] hover:bg-[#0d1f15] hover:text-white transition-all shadow-2xs"
                  >
                    {fmt.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SAME PROMISE. EVERYWHERE. BANNER (PDF PAGE 5 & 6) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-[#0d1f15] text-white">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-black tracking-widest text-[#fed100] uppercase block">
                ONE BRAND, MANY FORMATS.
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
                Same Promise. <br />
                <span className="text-[#6cb33f]">Everywhere.</span>
              </h2>
            </div>

            {/* Middle 6 Badges */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#173323] p-2.5 rounded-xl border border-white/10 text-center text-xs font-semibold">
                24/7 Access
              </div>
              <div className="bg-[#173323] p-2.5 rounded-xl border border-white/10 text-center text-xs font-semibold">
                Fresh & Local
              </div>
              <div className="bg-[#173323] p-2.5 rounded-xl border border-white/10 text-center text-xs font-semibold">
                Great Food
              </div>
              <div className="bg-[#173323] p-2.5 rounded-xl border border-white/10 text-center text-xs font-semibold">
                Everyday Essentials
              </div>
              <div className="bg-[#173323] p-2.5 rounded-xl border border-white/10 text-center text-xs font-semibold">
                For Every Neighbourhood
              </div>
              <div className="bg-[#173323] p-2.5 rounded-xl border border-white/10 text-center text-xs font-semibold">
                Highways & Beyond
              </div>
            </div>

            {/* Right Button & Vegetables Basket */}
            <div className="lg:col-span-3 flex items-center justify-between sm:justify-end gap-4">
              <Link
                to="/locations"
                className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] font-black text-xs px-6 py-3.5 rounded-full uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                FIND A STORE NEAR YOU →
              </Link>
              <img
                src="/assets/mockup/format_vegetable_basket.webp"
                alt="Good Food Brighter Tomorrows"
                className="w-24 h-16 rounded-xl object-cover border border-white/20 hidden sm:block shrink-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

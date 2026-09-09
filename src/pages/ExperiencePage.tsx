import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Zap, Coffee, ShoppingBag, Home, Clock, Users, ArrowRight } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const departments = [
    'Groceries',
    'Fresh Produce',
    'Bakery',
    'Quick Meals',
    'Beverages',
    'Dairy & Essentials',
    'Personal Care',
    'Daily Essentials & more',
  ];

  const differentiators = [
    {
      title: 'Onsite Flour Mill',
      subtitle: 'Freshly ground. Pure & wholesome.',
      image: '/assets/experience_flour_mill.jpg',
      tag: 'Atta, Maida, Multigrain, Besan',
    },
    {
      title: 'Cold Press Juice',
      subtitle: 'Natural goodness. No compromise.',
      image: '/assets/experience_cold_press_juice.jpg',
      tag: '100% Pure, Daily Extracted',
    },
    {
      title: 'Fresh Bakery',
      subtitle: 'Freshly baked. Every day.',
      image: '/assets/experience_fresh_bakery.jpg',
      tag: 'Artisan Breads & Pastries',
    },
    {
      title: 'Quick Meals',
      subtitle: 'Hot. Tasty. Made for you.',
      image: '/assets/experience_quick_meals.jpg',
      tag: 'Ready-to-Eat & Snacks',
    },
    {
      title: 'Lounge Area',
      subtitle: 'Relax. Refresh. Recharge.',
      image: '/assets/experience_lounge_area.jpg',
      tag: 'Seating & Coffee Break',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#f4f6ee] text-[#12281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-3">
            STORE ARCHITECTURE & OFFERINGS
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0d1f15] tracking-tight mb-4">
            A Store Experience That Delivers More
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Integrated convenience, freshly prepared food, and high-frequency essentials designed for highways and urban residential hubs.
          </p>
        </div>

        {/* 1. TWO FLEXIBLE STORE FORMATS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Waypoint Highway Hub */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md flex flex-col justify-between group">
            <div>
              <div className="relative h-56 overflow-hidden bg-stone-900">
                <img
                  src="/assets/format_waypoint_highway_hub.jpg"
                  alt="Waypoint Highway Hub format"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="text-[10px] font-bold text-[#fed100] tracking-widest uppercase block">
                    HIGHWAY & TRAVEL CORRIDOR
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-white">
                    WAYPOINT HIGHWAY HUB
                  </h3>
                  <div className="text-sm font-bold text-[#7ad048]">
                    1,500 – 3,000 SQ.FT.
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Fuel className="w-4 h-4 text-[#3b711e]" />
                  <span>Highway & Travel Hubs</span>
                </div>
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Fuel className="w-4 h-4 text-[#3b711e]" />
                  <span>Fuel Stations & Stops</span>
                </div>
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Coffee className="w-4 h-4 text-[#3b711e]" />
                  <span>Food, Beverages & Deli</span>
                </div>
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Zap className="w-4 h-4 text-[#fed100]" />
                  <span>EV Charging Enabled</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#173323] hover:bg-[#6cb33f] text-white font-semibold text-xs transition-colors"
              >
                <span>Propose Highway Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Neighborhood Express */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md flex flex-col justify-between group">
            <div>
              <div className="relative h-56 overflow-hidden bg-stone-900">
                <img
                  src="/assets/format_neighborhood_express.jpg"
                  alt="Neighborhood Express format"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="text-[10px] font-bold text-[#fed100] tracking-widest uppercase block">
                    URBAN RESIDENTIAL HUB
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-white">
                    NEIGHBORHOOD EXPRESS
                  </h3>
                  <div className="text-sm font-bold text-[#7ad048]">
                    500 – 1,200 SQ.FT.
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Home className="w-4 h-4 text-[#3b711e]" />
                  <span>Residential Communities</span>
                </div>
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <ShoppingBag className="w-4 h-4 text-[#3b711e]" />
                  <span>Daily Needs & Groceries</span>
                </div>
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Clock className="w-4 h-4 text-[#3b711e]" />
                  <span>24/7 Access & Speed</span>
                </div>
                <div className="p-3 bg-[#f4f6ee] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#0d1f15]">
                  <Users className="w-4 h-4 text-[#3b711e]" />
                  <span>Loyal Daily Footfall</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#173323] hover:bg-[#6cb33f] text-white font-semibold text-xs transition-colors"
              >
                <span>Propose Urban Property</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. ONSITE DIFFERENTIATORS */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0d1f15]">
              5 Onsite Differentiators
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Freshness like never before: freshly ground flours, cold-pressed juice, and round-the-clock hot meals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {differentiators.map((d, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm flex flex-col justify-between group"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold font-serif text-[#0d1f15] mb-1">
                      {d.title}
                    </h4>
                    <p className="text-xs text-stone-600 mb-3">
                      {d.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#3b711e] bg-[#6cb33f]/10 px-2 py-1 rounded inline-block">
                    {d.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STORE DEPARTMENTS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            CURATED DEPARTMENTS UNDER ONE ROOF
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#0d1f15]">
            {departments.map((dept, idx) => (
              <span key={idx} className="px-3 py-1 bg-[#f4f6ee] rounded-full border border-stone-200">
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

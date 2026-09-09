import React from 'react';
import { Users, Truck, Store, RefreshCw, MapPin } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const brands = [
    {
      name: 'Gateway of Punjab',
      desc: 'Authentic North Indian flavours',
      logo: '/assets/brand_gateway_of_punjab.png',
      cuisine: 'North Indian Delights',
    },
    {
      name: 'Gateway of South',
      desc: 'Authentic South Indian comfort food',
      logo: '/assets/brand_gateway_of_south.png',
      cuisine: 'South Indian Classics',
    },
    {
      name: 'Union Artisan Coffee',
      desc: 'Quick bites. Bold flavours.',
      logo: '/assets/brand_union_coffee.png',
      cuisine: 'Specialty Coffee & Bites',
    },
    {
      name: 'My Asiana',
      desc: 'Indo-Chinese done right',
      logo: '/assets/brand_my_asiana.png',
      cuisine: 'Indo-Chinese Street & Wok',
    },
    {
      name: 'Eataliana',
      desc: 'Fried chicken, pizza & pasta',
      logo: '/assets/brand_eataliana.png',
      cuisine: 'Comfort Italian & Crisp Chicken',
    },
    {
      name: 'Village Deli',
      desc: 'Daily essentials & freshly made bites',
      logo: '/assets/brand_village_deli.png',
      cuisine: 'Flagship Deli & Essentials',
    },
  ];

  const advantages = [
    { title: 'Wide Appeal', desc: 'Cuisines that resonate across age groups and occasions.', icon: Users },
    { title: 'Delivery Optimised', desc: 'Menu, packaging and operations built for high delivery performance.', icon: Truck },
    { title: 'Multiple Formats', desc: 'QSR, Express, Cloud Kitchen & Dine-in models for every market.', icon: Store },
    { title: 'High Repeat Value', desc: 'Great taste, quality consistency and value pricing drive loyalty.', icon: RefreshCw },
    { title: 'Expanding Footprint', desc: 'Strong brands help us enter new markets faster and deeper.', icon: MapPin },
  ];

  const allianceItems = [
    'Packed Food',
    'Grocery',
    'Dairy & Dry Goods',
    'Personal Care',
    'Household Essentials',
  ];

  return (
    <div className="pt-28 pb-20 bg-[#f4f6ee] text-[#12281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-3">
            BRAND PORTFOLIO
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0d1f15] tracking-tight mb-4">
            More Brands. More Choices. More Opportunities.
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Crafted to serve every mood, craving and occasion — from quick bites on-the-go to full meals at home, offering quality, variety and value across channels.
          </p>
        </div>

        {/* 1. 6 IN-HOUSE BRANDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {brands.map((b, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#6cb33f] transition-all group"
            >
              <div className="h-20 w-full flex items-center justify-center p-2 mb-3 bg-stone-50 rounded-xl">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="max-h-14 max-w-[170px] object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-[#3b711e] tracking-wider uppercase mb-1">
                {b.cuisine}
              </span>
              <h3 className="text-lg font-bold font-serif text-[#0d1f15] mb-1">
                {b.name}
              </h3>
              <p className="text-xs text-stone-600">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 2. DELIVERY & PLATFORMS */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold text-[#3b711e] uppercase tracking-wider block mb-1">
                DIGITAL & DELIVERY FIRST
              </span>
              <h3 className="text-xl font-bold font-serif text-[#0d1f15]">
                Available On All Major Platforms
              </h3>
            </div>
            <div className="bg-[#12281c] px-4 py-2 rounded-xl">
              <img
                src="/assets/platforms_zomato_zepto.png"
                alt="Zomato and Zepto logos"
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {advantages.map((adv, idx) => (
              <div key={idx} className="p-4 bg-[#f4f6ee] rounded-xl">
                <adv.icon className="w-5 h-5 text-[#3b711e] mb-2" />
                <h4 className="text-xs font-bold text-[#0d1f15] mb-1">{adv.title}</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STRATEGIC SUPPLY CHAIN (VITA + HAR HITH) */}
        <div className="bg-[#173323] text-white rounded-3xl p-8 border border-[#6cb33f]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#fed100] uppercase tracking-wider block mb-1">
              STRONGER TOGETHER FOR A BETTER TOMORROW
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif mb-2">
              Strategic Supply Alliance With Vita & Har Hith Store
            </h3>
            <p className="text-xs text-stone-300 mb-4">
              Now Vita & Har Hith products available 24/7 at all Village Deli outlets with a robust co-operative supply network.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {allianceItems.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#12281c] rounded-full border border-white/10 text-stone-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shrink-0 shadow-md">
            <img
              src="/assets/collab_har_hith_vita.png"
              alt="Har Hith Store + Vita logos"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

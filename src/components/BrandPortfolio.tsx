import React from 'react';
import { Users, Truck, Store, RefreshCw, MapPin } from 'lucide-react';

export const BrandPortfolio: React.FC = () => {
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

  const opportunities = [
    {
      title: 'Wide Appeal',
      desc: 'Cuisines that resonate across age groups and occasions.',
      icon: Users,
    },
    {
      title: 'Delivery Optimised',
      desc: 'Menu, packaging and operations built for high delivery performance.',
      icon: Truck,
    },
    {
      title: 'Multiple Formats',
      desc: 'QSR, Express, Cloud Kitchen & Dine-in models for every market.',
      icon: Store,
    },
    {
      title: 'High Repeat Value',
      desc: 'Great taste, quality consistency and value pricing drive loyalty.',
      icon: RefreshCw,
    },
    {
      title: 'Expanding Footprint',
      desc: 'Strong brands help us enter new markets faster and deeper.',
      icon: MapPin,
    },
  ];

  return (
    <section id="brands" className="py-20 md:py-28 bg-[#f4f6ee] text-[#12281c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30">
            BRAND PORTFOLIO
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0d1f15] tracking-tight mb-4">
            More Brands. More Choices. More Opportunities.
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Built for greater opportunity: our in-house F&B brands are crafted to serve every mood, craving and occasion — from quick bites on-the-go to full meals at home, offering quality, variety and value across channels.
          </p>
        </div>

        {/* 6 In-House Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {brands.map((b, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-[#6cb33f] transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="h-24 w-full flex items-center justify-center p-2 mb-4 bg-stone-50 rounded-xl border border-stone-100 group-hover:bg-[#f4f6ee] transition-colors">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="max-h-16 max-w-[190px] object-contain"
                />
              </div>

              <span className="text-[11px] font-bold text-[#3b711e] tracking-wider uppercase mb-1">
                {b.cuisine}
              </span>
              <h3 className="text-xl font-bold font-serif text-[#0d1f15] mb-2">
                {b.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery-First Strip */}
        <div className="bg-[#173323] text-white rounded-2xl p-6 mb-16 text-center border border-[#6cb33f]/30">
          <p className="text-sm sm:text-base font-medium text-stone-200">
            <strong className="text-[#fed100]">Delivery-first. Customer-focused.</strong> Designed with delivery in mind, our brands offer high repeatability, packaging efficiency, wide reach and strong digital appeal.
          </p>
        </div>

        {/* Section: Why Our Brands Offer Greater Opportunity (Page 12) */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-bold text-[#3b711e] uppercase tracking-wider mb-2">
              EXTENDING OUR REACH
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#0d1f15] mb-2">
              Why Our Brands Offer Greater Opportunity
            </h3>
            <p className="text-sm text-stone-600">
              Multiple cuisines. Multiple formats. One mission: to be closer to more customers, more often.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {opportunities.map((op, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#f4f6ee] border border-stone-200/60 flex flex-col justify-between hover:border-[#6cb33f] transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white text-[#3b711e] flex items-center justify-center mb-3 shadow-xs">
                    <op.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0d1f15] mb-1 font-serif">
                    {op.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {op.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Platforms Bar & Brand Trust Strip */}
          <div className="pt-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                AVAILABLE ON ALL MAJOR PLATFORMS
              </span>
              <div className="bg-[#12281c] px-4 py-2 rounded-xl">
                <img
                  src="/assets/platforms_zomato_zepto.png"
                  alt="Zomato and Zepto delivery platform partner logos"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>

            <div className="text-right sm:text-left md:text-right">
              <div className="text-sm font-bold font-serif text-[#0d1f15]">
                Great Food. Greater Reach. Growing Together.
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Quality You Can Trust • Consistent Standards • Better Choices For Everyone • Always Accessible
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';

export const StoreExperience: React.FC = () => {
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
      tags: ['Atta', 'Maida', 'Multigrain', 'Besan'],
    },
    {
      title: 'Cold Press Juice',
      subtitle: 'Natural goodness. No compromise.',
      image: '/assets/experience_cold_press_juice.jpg',
      tags: ['100% Pure', 'Cold-Pressed Daily', 'No Added Sugar'],
    },
    {
      title: 'Fresh Bakery',
      subtitle: 'Freshly baked. Every day.',
      image: '/assets/experience_fresh_bakery.jpg',
      tags: ['Artisan Bread', 'Pastries', 'Daily Fresh Bakes'],
    },
    {
      title: 'Quick Meals',
      subtitle: 'Hot. Tasty. Made for you.',
      image: '/assets/experience_quick_meals.jpg',
      tags: ['Chef Curated', 'Hot & Fresh', 'On-the-Go'],
    },
    {
      title: 'Lounge Area',
      subtitle: 'Relax. Refresh. Recharge.',
      image: '/assets/experience_lounge_area.jpg',
      tags: ['Warm Seating', 'Co-Working Space', 'Coffee & Sip'],
    },
  ];

  return (
    <section id="experience" className="py-20 md:py-28 bg-[#f4f6ee] text-[#12281c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Tag and Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30">
            EXPERIENCE PILLARS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0d1f15] tracking-tight mb-4">
            A Store Experience That Delivers More
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Elevating daily convenience into a premium neighborhood anchor and highway oasis.
          </p>
        </div>

        {/* Categories Horizontal Banner */}
        <div className="mb-14 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-[#173323]">
          {departments.map((dept, idx) => (
            <React.Fragment key={idx}>
              <span className="px-3 py-1.5 rounded-full bg-[#f4f6ee] border border-stone-200/60 hover:border-[#6cb33f] hover:bg-[#6cb33f]/10 transition-colors">
                {dept}
              </span>
              {idx < departments.length - 1 && (
                <span className="text-[#6cb33f] hidden md:inline font-bold">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 5 Onsite Differentiators Cards with Pitch Deck Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {differentiators.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#0d1f15]/80 backdrop-blur-sm text-[#7ad048] text-[10px] font-bold px-2 py-0.5 rounded">
                  0{idx + 1}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#0d1f15] mb-1 group-hover:text-[#3b711e] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium mb-3 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-3 border-t border-stone-100">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] bg-[#f4f6ee] text-stone-600 px-2 py-0.5 rounded font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rich Store Gallery from Pitch Deck Page 11 */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0d1f15] font-serif">
              EVERYDAY CONVENIENCE.{' '}
              <span className="text-[#3b711e] italic">EXTRAORDINARY EXPERIENCE.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Produce Aisle */}
            <div className="md:col-span-7 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative min-h-[320px] group">
              <img
                src="/assets/store_produce_aisle.jpg"
                alt="Fresh produce aisle at Village Deli"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[#fed100] text-xs font-bold uppercase tracking-wider mb-1">
                  Fresh Produce Section
                </div>
                <div className="text-base sm:text-lg font-serif font-bold">
                  Farm-fresh fruits, organic vegetables & local harvests sourced daily.
                </div>
              </div>
            </div>

            {/* Bakery & Coffee Aisle + Family Shopping Stack */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {/* Bakery Aisle */}
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg relative h-[190px] group">
                <img
                  src="/assets/store_bakery_aisle.jpg"
                  alt="Bakery and Union Coffee aisle at Village Deli"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-xs font-bold text-[#fed100] uppercase">Bakery & Union Coffee</div>
                  <div className="text-sm font-semibold">Artisan bakes and specialty roast brews</div>
                </div>
              </div>

              {/* Family with Cart */}
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg relative h-[210px] group">
                <img
                  src="/assets/family_with_cart.jpg"
                  alt="Indian family with cart shopping Village Deli staples"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-xs font-bold text-[#fed100] uppercase">Curated Family Shopping</div>
                  <div className="text-sm font-semibold">Atta, dairy, fresh bread & wholesome staples</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline Pill from Page 6 & 14 */}
        <div className="bg-[#173323] text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-[#6cb33f]/30">
          <p className="text-lg sm:text-2xl font-serif font-medium leading-snug">
            “Village DELI is not just a store. It's a lifestyle enabler.{' '}
            <span className="text-[#7ad048]">A trust builder. A future-ready business.</span>”
          </p>
        </div>
      </div>
    </section>
  );
};

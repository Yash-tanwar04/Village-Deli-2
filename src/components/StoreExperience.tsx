import React from 'react';
import { motion } from 'framer-motion';

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
      image: '/assets/experience_flour_mill.webp',
      tags: ['Atta', 'Maida', 'Multigrain', 'Besan'],
    },
    {
      title: 'Cold Press Juice',
      subtitle: 'Natural goodness. No compromise.',
      image: '/assets/experience_cold_press_juice.webp',
      tags: ['100% Pure', 'Cold-Pressed Daily', 'No Added Sugar'],
    },
    {
      title: 'Fresh Bakery',
      subtitle: 'Freshly baked. Every day.',
      image: '/assets/experience_fresh_bakery.webp',
      tags: ['Artisan Bread', 'Pastries', 'Daily Fresh Bakes'],
    },
    {
      title: 'Quick Meals',
      subtitle: 'Hot. Tasty. Made for you.',
      image: '/assets/experience_quick_meals.webp',
      tags: ['Chef Curated', 'Hot & Fresh', 'On-the-Go'],
    },
    {
      title: 'Lounge Area',
      subtitle: 'Relax. Refresh. Recharge.',
      image: '/assets/experience_lounge_area.webp',
      tags: ['Warm Seating', 'Co-Working Space', 'Coffee & Sip'],
    },
  ];

  return (
    <section id="experience" className="py-24 md:py-32 bg-[#0d1f15] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#6cb33f]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Tag and Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30"
          >
            EXPERIENCE PILLARS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4"
          >
            A Store Experience That Delivers More
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-light"
          >
            Elevating daily convenience into a premium neighborhood anchor and highway oasis.
          </motion.p>
        </div>

        {/* Categories Horizontal Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 p-4 rounded-2xl bg-[#12281c] border border-[#234934] shadow-xl flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-stone-200"
        >
          {departments.map((dept, idx) => (
            <React.Fragment key={idx}>
              <span className="px-3.5 py-1.5 rounded-full bg-[#173323]/80 border border-[#234934] hover:border-[#6cb33f] hover:text-white transition-colors cursor-default">
                {dept}
              </span>
              {idx < departments.length - 1 && (
                <span className="text-[#6cb33f] hidden md:inline font-bold">•</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* 5 Onsite Differentiators Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {differentiators.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-[#12281c] rounded-3xl overflow-hidden border border-[#234934] shadow-xl hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#091710]/90 backdrop-blur-sm text-[#7ad048] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#234934]">
                  0{idx + 1}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white mb-1.5 group-hover:text-[#7ad048] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-light mb-4 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#234934]">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] bg-[#091710] text-stone-300 border border-[#234934] px-2 py-0.5 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rich Store Gallery */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7ad048] block mb-2">
              CURATED PHYSICAL EXPERIENCE
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-serif">
              EVERYDAY CONVENIENCE.{' '}
              <span className="text-[#7ad048] italic">EXTRAORDINARY EXPERIENCE.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Produce Aisle */}
            <div className="md:col-span-7 rounded-3xl overflow-hidden border border-[#234934] shadow-2xl relative min-h-[340px] group bg-[#091710]">
              <img
                src="/assets/store_produce_aisle.webp"
                alt="Fresh produce aisle at Village Deli"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-[#fed100] text-xs font-bold uppercase tracking-wider mb-1">
                  Fresh Produce Section
                </div>
                <div className="text-lg sm:text-xl font-serif font-bold">
                  Farm-fresh fruits, organic vegetables & local harvests sourced daily.
                </div>
              </div>
            </div>

            {/* Bakery & Coffee Aisle + Family Shopping Stack */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {/* Bakery Aisle */}
              <div className="rounded-3xl overflow-hidden border border-[#234934] shadow-xl relative h-[195px] group bg-[#091710]">
                <img
                  src="/assets/store_bakery_aisle.webp"
                  alt="Bakery and Union Coffee aisle at Village Deli"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 text-white">
                  <div className="text-xs font-bold text-[#fed100] uppercase">Bakery & Union Coffee</div>
                  <div className="text-sm font-semibold">Artisan bakes and specialty roast brews</div>
                </div>
              </div>

              {/* Family with Cart */}
              <div className="rounded-3xl overflow-hidden border border-[#234934] shadow-xl relative h-[215px] group bg-[#091710]">
                <img
                  src="/assets/family_with_cart.webp"
                  alt="Indian family with cart shopping Village Deli staples"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 text-white">
                  <div className="text-xs font-bold text-[#fed100] uppercase">Curated Family Shopping</div>
                  <div className="text-sm font-semibold">Atta, dairy, fresh bread & wholesome staples</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline Pill */}
        <div className="bg-[#173323] text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-[#6cb33f]/30">
          <p className="text-lg sm:text-2xl font-serif font-medium leading-relaxed">
            “Village DELI is not just a store. It's a lifestyle enabler.{' '}
            <span className="text-[#7ad048]">A trust builder. A future-ready business.</span>”
          </p>
        </div>
      </div>
    </section>
  );
};

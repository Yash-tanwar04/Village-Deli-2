import React from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, Store, RefreshCw, MapPin } from 'lucide-react';

export const BrandPortfolio: React.FC = () => {
  const brands = [
    {
      name: 'Gateway of Punjab',
      desc: 'Authentic North Indian flavours & classic highway curries',
      logo: '/assets/brand_gateway_of_punjab.png',
      cuisine: 'North Indian Delights',
    },
    {
      name: 'Gateway of South',
      desc: 'Authentic South Indian comfort food, dosas & filter coffee',
      logo: '/assets/brand_gateway_of_south.png',
      cuisine: 'South Indian Classics',
    },
    {
      name: 'Union Artisan Coffee',
      desc: 'Quick bites, specialty roast espresso & bold cold brews',
      logo: '/assets/brand_union_coffee.png',
      cuisine: 'Specialty Coffee & Bites',
    },
    {
      name: 'My Asiana',
      desc: 'Indo-Chinese street food, tossed noodles & steaming woks',
      logo: '/assets/brand_my_asiana.png',
      cuisine: 'Indo-Chinese Street & Wok',
    },
    {
      name: 'Eataliana',
      desc: 'Crispy fried chicken, stone-baked pizzas & loaded pasta',
      logo: '/assets/brand_eataliana.png',
      cuisine: 'Comfort Italian & Crisp Chicken',
    },
    {
      name: 'Village Deli',
      desc: 'Daily essentials, fresh deli sandwiches & healthy sips',
      logo: '/assets/brand_village_deli.png',
      cuisine: 'Flagship Deli & Essentials',
    },
  ];

  const opportunities = [
    {
      title: 'Wide Appeal',
      desc: 'Cuisines that resonate across age groups, families and travel occasions.',
      icon: Users,
    },
    {
      title: 'Delivery Optimised',
      desc: 'Menu, packaging and kitchen stations engineered for high-speed delivery performance.',
      icon: Truck,
    },
    {
      title: 'Multiple Formats',
      desc: 'QSR, Express, Cloud Kitchen & Dine-in operational configurations.',
      icon: Store,
    },
    {
      title: 'High Repeat Value',
      desc: 'Great taste, standardized consistency and accessible pricing drive customer loyalty.',
      icon: RefreshCw,
    },
    {
      title: 'Expanding Footprint',
      desc: 'Synergistic multi-brand power helps penetrate urban & highway markets faster.',
      icon: MapPin,
    },
  ];

  return (
    <section id="brands" className="py-24 md:py-32 bg-[#091710] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#6cb33f]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30"
          >
            BRAND PORTFOLIO
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4"
          >
            More Brands. More Choices. More Opportunities.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-sm sm:text-base leading-relaxed font-light"
          >
            Built for greater opportunity: our in-house F&B brands are crafted to serve every mood, craving and occasion — from quick bites on-the-go to full family meals at home.
          </motion.p>
        </div>

        {/* 6 In-House Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {brands.map((b, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-[#12281c] rounded-3xl p-7 border border-[#234934] shadow-xl hover:shadow-2xl hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="h-28 w-full flex items-center justify-center p-3 mb-5 bg-white/95 rounded-2xl border border-white/10 shadow-sm group-hover:bg-white transition-colors">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="max-h-20 max-w-[200px] object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <span className="text-[11px] font-bold text-[#7ad048] tracking-wider uppercase mb-1.5">
                {b.cuisine}
              </span>
              <h3 className="text-xl font-bold font-serif text-white mb-2">
                {b.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Delivery-First Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#173323] text-white rounded-3xl p-6 sm:p-8 mb-16 text-center border border-[#6cb33f]/30 shadow-lg"
        >
          <p className="text-sm sm:text-base font-medium text-stone-200">
            <strong className="text-[#fed100]">Delivery-first. Customer-focused.</strong> Designed with delivery in mind, our brands offer high repeatability, packaging efficiency, wide reach and strong digital appeal across platforms.
          </p>
        </motion.div>

        {/* Section: Why Our Brands Offer Greater Opportunity */}
        <div className="bg-[#0d1f15] rounded-3xl p-8 sm:p-12 border border-[#234934] shadow-2xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-[#7ad048] uppercase tracking-wider block mb-2">
              EXTENDING OUR REACH
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-2">
              Why Our Brands Offer Greater Opportunity
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              Multiple cuisines. Multiple formats. One mission: to be closer to more customers, more often.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {opportunities.map((op, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-[#12281c] border border-[#234934] flex flex-col justify-between hover:border-[#6cb33f] hover:bg-[#173323] transition-all shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#173323] text-[#7ad048] border border-[#234934] flex items-center justify-center mb-4 shadow-xs">
                    <op.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5 font-serif">
                    {op.title}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {op.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Platforms Bar & Brand Trust Strip */}
          <div className="pt-8 border-t border-[#234934] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                AVAILABLE ON ALL MAJOR PLATFORMS
              </span>
              <div className="bg-white/95 px-5 py-2.5 rounded-2xl shadow-sm">
                <img
                  src="/assets/platforms_zomato_zepto.png"
                  alt="Zomato and Zepto delivery platform partner logos"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-sm font-bold font-serif text-white">
                Great Food. Greater Reach. Growing Together.
              </div>
              <div className="text-xs text-stone-400 mt-1 font-light">
                Quality You Can Trust • Consistent Standards • Better Choices For Everyone • Always Accessible
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Apple, UtensilsCrossed, ShoppingBag, ShieldCheck } from 'lucide-react';

export const WhyVillageDeli: React.FC = () => {
  const points = [
    {
      title: '24/7 Convenience',
      desc: "Round-the-clock access for today's always-on consumers across highways & neighborhoods.",
      icon: Clock,
    },
    {
      title: 'Fresh & Local First',
      desc: 'Curated fresh produce, local staples and regionally loved food sourced with care.',
      icon: Apple,
    },
    {
      title: 'Food for Every Craving',
      desc: 'Quick meals, bakery, beverages and healthy options — all under one unified roof.',
      icon: UtensilsCrossed,
    },
    {
      title: 'One Stop, Every Need.',
      desc: 'Daily essentials, personal care, household staples and FMCG favorites.',
      icon: ShoppingBag,
    },
    {
      title: 'Trusted Quality',
      desc: 'Hygienic, reliable and consistent products you can depend on, every single visit.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="why-us" className="py-24 md:py-32 bg-[#0d1f15] text-white relative overflow-hidden">
      {/* Soft background ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-4 border border-[#6cb33f]/30"
          >
            WHY NOW
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif mb-4"
          >
            Why Village DELI, Why Now?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-300 font-light leading-relaxed mb-6 font-serif"
          >
            India is transforming. Lifestyles are evolving. Consumers want convenience, quality, freshness and trust — 24/7. Village DELI is built for this new India.
          </motion.p>
        </div>

        {/* 2-Column Split: Points on Left, Storefront Twilight Render on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Points List */}
          <div className="lg:col-span-6 space-y-4">
            {points.map((pt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ x: 6 }}
                className="bg-[#12281c] p-5 sm:p-6 rounded-2xl border border-[#234934] shadow-md hover:shadow-xl hover:border-[#6cb33f] hover:bg-[#173323] transition-all flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#173323] group-hover:bg-[#6cb33f] text-[#7ad048] group-hover:text-[#0d1f15] border border-[#234934] flex items-center justify-center shrink-0 transition-colors mt-0.5 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 group-hover:hidden" />
                  <pt.icon className="w-5 h-5 hidden group-hover:block" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-serif group-hover:text-[#7ad048] transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                    {pt.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#234934] group bg-[#091710]">
              <img
                src="/assets/storefront_twilight.webp"
                alt="Village Deli twilight exterior view with customers entering the well-lit retail store"
                className="w-full h-auto object-cover max-h-[580px] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091710]/95 via-[#091710]/35 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#fed100] font-bold mb-1">
                      Round-the-Clock Mobility
                    </div>
                    <div className="text-lg sm:text-xl font-serif font-bold">
                      Always Open. Always Reliable.
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-300 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">
                    *Image: AI Generated
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

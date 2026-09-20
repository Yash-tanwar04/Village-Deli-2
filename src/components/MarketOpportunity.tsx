import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Fuel, Building2, Clock, Route, Store, HeartHandshake } from 'lucide-react';

export const MarketOpportunity: React.FC = () => {
  const stats = [
    {
      value: '₹6+ Lakh Cr.',
      label: "India's organized convenience retail market by 2027",
      source: '(Industry Reports)',
      icon: ShoppingBag,
    },
    {
      value: '20%+',
      unit: 'CAGR',
      label: 'Convenience retail segment growth rate',
      source: '(Retail & Consulting Reports)',
      icon: TrendingUp,
    },
    {
      value: '100,000+',
      label: 'Fuel stations across India — a huge addressable opportunity',
      source: '(PPAC)',
      icon: Fuel,
    },
    {
      value: 'Millions',
      unit: 'OF URBAN HOUSEHOLDS',
      label: 'Seeking quality, convenience & trust, 24/7',
      source: 'High-Density Corridors',
      icon: Building2,
    },
  ];

  const trends = [
    {
      title: 'RISING URBANIZATION',
      desc: "India's urban population projected to reach 600M+ by 2031.",
      icon: Building2,
    },
    {
      title: 'BUSY LIFESTYLES',
      desc: 'Longer work hours & dual-income families drive 24/7 needs.',
      icon: Clock,
    },
    {
      title: 'FOOD-ON-THE-GO',
      desc: 'Ready-to-eat & quick snacks growing 15%+ annually.',
      icon: ShoppingBag,
    },
    {
      title: 'HIGHWAY INFRASTRUCTURE',
      desc: 'Expanding expressways fuel demand at fuel stations.',
      icon: Route,
    },
    {
      title: 'NEIGHBORHOOD RETAIL',
      desc: 'Proximity, trust & personalized service lead urban retail.',
      icon: Store,
    },
  ];

  return (
    <section id="opportunity" className="py-24 md:py-32 bg-[#091710] text-white relative overflow-hidden">
      {/* Background radial pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#6cb33f_1px,transparent_1px)] [background-size:28px_28px]"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Tag and Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30"
          >
            MARKET OPPORTUNITY
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-4"
          >
            The Scope Is Massive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-light"
          >
            A once-in-a-generation shift towards 24/7 organized convenience retail across India's high-density corridors.
          </motion.p>
        </div>

        {/* 4 Stats Cards + Family Image Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* 4 Stat Cards in 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#12281c] border border-[#234934] p-7 rounded-3xl flex flex-col justify-between hover:border-[#6cb33f]/60 hover:bg-[#173323] transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#173323] group-hover:bg-[#6cb33f]/20 text-[#7ad048] flex items-center justify-center mb-6 transition-colors border border-[#234934]">
                    <stat.icon className="w-6 h-6 text-[#7ad048]" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#7ad048] tracking-tight font-stat">
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-xs font-bold text-stone-300 tracking-wider uppercase font-sans">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-200 text-sm font-medium leading-relaxed mb-3">
                    {stat.label}
                  </p>
                </div>
                {stat.source && (
                  <span className="text-[11px] text-stone-400 font-mono tracking-tight pt-2 border-t border-white/5">
                    {stat.source}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Showcase: Family Shopping Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#234934] shadow-2xl min-h-[380px] group"
          >
            <img
              src="/assets/family_shopping_produce.webp"
              alt="Indian family shopping for fresh produce and groceries at Village Deli"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091710] via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#0d1f15]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
              <div className="text-xs text-[#fed100] font-bold tracking-widest uppercase mb-1">
                Millions of Urban Households
              </div>
              <div className="text-xs sm:text-sm text-stone-200 font-medium">
                Seeking hygienic, dependable convenience retail around the clock.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subsection: Market Trends Driving The Opportunity */}
        <div className="pt-10 border-t border-[#234934]/70">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7ad048] block mb-1">
              STRUCTURAL CATALYSTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-2">
              Market Trends Driving The Opportunity
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              Structural macro drivers fueling the rapid rise of 24/7 convenience formats across urban and highway India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {trends.map((tr, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-[#12281c] border border-[#234934] p-6 rounded-2xl text-center flex flex-col items-center hover:border-[#6cb33f]/60 hover:bg-[#173323] transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#173323] border border-[#234934] text-[#7ad048] flex items-center justify-center mb-4 group-hover:bg-[#6cb33f] group-hover:text-white transition-colors">
                  <tr.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold tracking-wider text-[#7ad048] mb-2 uppercase font-sans">
                  {tr.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {tr.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Community Quote Banner */}
          <div className="bg-gradient-to-r from-[#173323] via-[#1d3e2b] to-[#173323] border border-[#6cb33f]/30 rounded-3xl p-8 text-center shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <HeartHandshake className="w-6 h-6 text-[#7ad048]" />
              <p className="text-lg sm:text-2xl font-serif italic text-white">
                “Supporting Local. Strengthening Communities. Enriching Lives.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

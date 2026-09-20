import React from 'react';
import { motion } from 'framer-motion';
import { Route, Fuel, Home, Building2, Train, Briefcase, CheckCircle2 } from 'lucide-react';

export const WhereWePlay: React.FC = () => {
  const locations = [
    {
      num: '01',
      title: 'Major Highways',
      desc: 'Built for high-speed expressway corridors and inter-city travellers.',
      icon: Route,
      tag: 'Expressways & Arterial Corridors',
    },
    {
      num: '02',
      title: 'Petrol Pumps & Fuel Stations',
      desc: '24/7 license across all Haryana locations, capturing captive refueling footfall.',
      icon: Fuel,
      tag: 'Strategic Mobility Hubs',
    },
    {
      num: '03',
      title: 'Urban & Suburban Neighborhoods',
      desc: 'Designed for fast-growing Tier-1 & Tier-2 North Indian cities.',
      icon: Home,
      tag: 'High-Density Residential',
    },
    {
      num: '04',
      title: 'Residential Townships',
      desc: 'Serving high-frequency daily household kitchen and grocery needs.',
      icon: Building2,
      tag: 'Gated Communities & Townships',
    },
    {
      num: '05',
      title: 'Transit Corridors',
      desc: 'High-footfall commuter locations and regional transit interchanges.',
      icon: Train,
      tag: 'Commuter Interchanges & Metros',
    },
    {
      num: '06',
      title: 'Commercial & Mixed-Use Spaces',
      desc: 'Where people live, work and refuel throughout their day.',
      icon: Briefcase,
      tag: 'Corporate Hubs & Plazas',
    },
  ];

  return (
    <section id="where-we-play" className="py-24 md:py-32 bg-[#12281c] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Tag and Headline */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30"
          >
            LOCATION STRATEGY
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-3"
          >
            Where We Play
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-[#7ad048] font-serif italic mb-4"
          >
            Purpose-built for where convenience matters most.
          </motion.p>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            From high-speed arterial expressways to bustling residential enclaves, Village DELI is strategically deployed where customer footfall, vehicle density, and round-the-clock demand converge.
          </p>
        </div>

        {/* 6 Location Format Cards (01 to 06) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-[#0d1f15] border border-[#234934] p-8 rounded-3xl relative overflow-hidden group hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#7ad048] font-stat tracking-tight">
                    {loc.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#173323] border border-[#234934] text-[#7ad048] flex items-center justify-center group-hover:bg-[#6cb33f] group-hover:text-white transition-colors">
                    <loc.icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-[#7ad048] transition-colors">
                  {loc.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-light mb-6">
                  {loc.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-[#7ad048]" />
                <span>{loc.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Purpose-Built Summary Bar */}
        <div className="bg-[#173323] border border-[#6cb33f]/30 rounded-3xl p-8 sm:p-10 text-center shadow-xl">
          <h4 className="text-lg sm:text-2xl font-serif font-bold text-white mb-4">
            Purpose-Built For Where Convenience Matters Most
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-stone-300 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7ad048]"></span>
              Built for highways, fuel stations & mobility hubs
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7ad048]"></span>
              Designed for urban neighborhoods & growing cities
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fed100]"></span>
              24/7 convenience for every moment of your day
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

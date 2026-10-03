import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, Sparkles, Cpu, Maximize2, ShieldCheck } from 'lucide-react';

export const CompetitiveAdvantage: React.FC = () => {
  const advantages = [
    {
      title: '24/7 Operations',
      desc: 'Always open. Always reliable. Built to capture round-the-clock footfall on highways & urban centers.',
      icon: Clock,
      badge: 'ROUND-THE-CLOCK',
    },
    {
      title: 'Integrated Format',
      desc: 'Groceries, produce, bakery, quick meals, beverages, essentials — all curated under one roof.',
      icon: Layers,
      badge: 'ALL-IN-ONE',
    },
    {
      title: 'Onsite Differentiators',
      desc: 'Fresh flour mill and cold-press juice station delivering genuine everyday freshness.',
      icon: Sparkles,
      badge: 'PURE FRESHNESS',
    },
    {
      title: 'Technology Enabled',
      desc: 'Smart inventory, seamless cloud billing and automated replenishment data systems.',
      icon: Cpu,
      badge: 'DATA-DRIVEN',
    },
    {
      title: 'Scalable Model',
      desc: 'Standardized plug-and-play architecture for highways, fuel stations and urban neighborhoods.',
      icon: Maximize2,
      badge: 'PLUG & PLAY',
    },
    {
      title: 'Trusted Quality',
      desc: 'Hygienic, reliable and consistent products backed by state cooperative supply chains.',
      icon: ShieldCheck,
      badge: 'ASSURED TRUST',
    },
  ];

  return (
    <section id="edge" className="py-24 md:py-32 bg-[#0d1f15] text-white relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#6cb33f]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Tag and Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30"
          >
            COMPETITIVE ADVANTAGE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-4"
          >
            Our Unique Edge
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-light"
          >
            Engineered from the ground up to outperform fragmented retail through integration, operational excellence, and lasting consumer trust.
          </motion.p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-[#12281c] border border-[#234934] p-8 rounded-3xl flex flex-col justify-between hover:border-[#6cb33f]/70 hover:bg-[#173323] transition-all duration-300 group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#173323] border border-[#234934] text-[#7ad048] group-hover:bg-[#6cb33f] group-hover:text-white flex items-center justify-center transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-300 bg-[#091710] px-3 py-1 rounded-full border border-white/5 tracking-wider uppercase">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-[#7ad048] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs text-[#7ad048] font-semibold gap-1 group-hover:translate-x-1 transition-transform">
                <span>Core Pillar 0{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

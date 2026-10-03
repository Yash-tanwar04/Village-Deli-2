import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ExpansionVision: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const phases = [
    {
      phase: 'PILOT',
      title: 'Haryana',
      highlight: '50+ LOCATIONS',
      subHighlight: 'in the next 12 months',
      details: 'Across major highways, petrol pumps & mobility corridors with 24/7 licenses.',
      color: 'border-[#6cb33f] bg-[#6cb33f]/10 text-[#7ad048]',
      badge: 'bg-[#6cb33f] text-white',
      accent: '#6cb33f',
      status: 'Active Launch Phase',
    },
    {
      phase: 'PHASE 1',
      title: 'Punjab',
      highlight: '50+ LOCATIONS TARGETED',
      subHighlight: 'Expanding network footprint',
      details: 'Expanding the highway & urban network across key commercial and residential corridors.',
      color: 'border-[#488425] bg-[#488425]/10 text-[#7ad048]',
      badge: 'bg-[#488425] text-white',
      accent: '#488425',
      status: 'Targeted Scale',
    },
    {
      phase: 'PHASE 2',
      title: 'Delhi NCR, UP, Uttarakhand & HP',
      highlight: 'Strategic Regional Corridors',
      subHighlight: 'Pan-North India Expansion',
      details: 'Connecting arterial highway corridors, thriving suburban hubs & rapid transit centers.',
      color: 'border-[#1e6091] bg-[#1e6091]/10 text-[#64b5f6]',
      badge: 'bg-[#1e6091] text-white',
      accent: '#1e6091',
      status: 'Pan-North India Expansion',
    },
  ];

  const pillars = [
    {
      title: 'Changing Lifestyles, Growing Needs',
      desc: 'Increasing demand for 24/7 convenience, quality and speed across urban & highway corridors.',
    },
    {
      title: 'Trusted. Local. Premium.',
      desc: 'Curated local products, freshly prepared food and premium experience.',
    },
    {
      title: 'Highly Scalable Model',
      desc: 'Asset-light, partner-driven expansion with strong unit economics.',
    },
    {
      title: 'Recurring Revenue, Strong Returns',
      desc: 'Built for long-term value, consistent cash flows and attractive ROI.',
    },
    {
      title: 'Future-Ready Retail',
      desc: 'Sustainable, tech-enabled and designed for the new India.',
    },
  ];

  return (
    <section id="expansion" className="py-24 md:py-32 bg-[#091710] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#1e6091]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30"
          >
            OUR EXPANSION VISION
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-6"
          >
            Built for the Way North India Lives
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-stone-300 leading-relaxed font-light"
          >
            Launching first in Haryana through a strategic collaboration, Village DELI is designed to become North India's leading premium 24/7 convenience retail network. Our expansion vision extends across Punjab, Delhi NCR, Uttar Pradesh, Uttarakhand and Himachal Pradesh — regions connected by strong highway infrastructure, rapidly growing cities, and thriving suburban communities.
          </motion.p>
        </div>

        {/* Vision Quote Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#12281c] to-[#173323]/90 border-l-4 border-[#6cb33f] p-6 sm:p-8 rounded-r-3xl mb-16 shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-base sm:text-xl font-serif italic text-stone-100 leading-relaxed">
              “As North India's cities continue to grow and lifestyles become increasingly round-the-clock, Village DELI is creating a retail format that delivers premium convenience, trusted local products, and freshly prepared food — wherever people live, work, travel and refuel.”
            </p>
          </div>
        </motion.div>

        {/* Interactive Roadmap Progression Tracker */}
        <div className="mb-14 bg-[#12281c]/70 border border-[#234934] rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7ad048] block mb-1">
                PROGRESSION TIMELINE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Interactive Growth Roadmap
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
              <Sparkles className="w-4 h-4 text-[#fed100]" />
              <span>Select a phase to explore targeted milestones</span>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {phases.map((ph, idx) => {
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? 'bg-[#173323] border-[#6cb33f] shadow-lg shadow-[#6cb33f]/10'
                      : 'bg-[#0d1f15]/80 border-[#234934] hover:border-[#6cb33f]/50 hover:bg-[#12281c]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-black tracking-wider px-3 py-1 rounded-full uppercase transition-colors ${
                        isActive ? ph.badge : 'bg-[#173323] text-stone-300 border border-white/10'
                      }`}
                    >
                      {ph.phase}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-[#fed100] animate-pulse' : 'bg-stone-500'
                        }`}
                      ></span>
                      {ph.status}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold font-serif text-white mb-1 group-hover:text-[#7ad048] transition-colors">
                    {ph.title}
                  </h4>
                  <div className="text-sm font-semibold text-[#fed100] mb-2">
                    {ph.highlight}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {ph.details}
                  </p>

                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#6cb33f]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expansion Roadmap and Regional Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          {/* Detailed Roadmap Showcase of Selected Phase */}
          <div className="lg:col-span-7">
            <div className="bg-[#12281c] border border-[#234934] rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-[#7ad048] uppercase tracking-widest block mb-1">
                    ACTIVE SELECTION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {phases[activePhaseIndex].phase}: {phases[activePhaseIndex].title}
                  </h3>
                </div>
                <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase ${phases[activePhaseIndex].badge}`}>
                  {phases[activePhaseIndex].status}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091710]/70 border border-white/5 mb-6">
                <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">Target Footprint</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#fed100] font-stat">
                  {phases[activePhaseIndex].highlight}
                </div>
                <div className="text-xs text-stone-300 mt-1">
                  {phases[activePhaseIndex].subHighlight}
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6 font-light">
                {phases[activePhaseIndex].details}
              </p>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-[#6cb33f]" />
                  <span>Strategic infrastructure & high-traffic deployment</span>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#7ad048] hover:text-white transition-colors"
                >
                  <span>Inquire for {phases[activePhaseIndex].title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Regional Map Graphic */}
          <div className="lg:col-span-5 relative bg-[#12281c] border border-[#234934] rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <div className="w-full text-center mb-4">
              <span className="text-xs font-bold text-[#7ad048] uppercase tracking-wider block">
                Regional Highway & City Footprint
              </span>
              <span className="text-[11px] text-stone-400">
                Haryana • Punjab • Delhi NCR • UP • Uttarakhand • HP
              </span>
            </div>

            <div className="w-full overflow-hidden rounded-2xl bg-stone-900/50 p-2 flex items-center justify-center">
              <img
                src="/assets/map_expansion_roadmap.webp"
                alt="Map of North India showing Haryana, Punjab, and Phase 2 expansion territories"
                className="max-h-[380px] w-auto object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Why Village Deli: 5 Strategic Foundation Cards (Page 9) */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7ad048] block mb-2">
              FOUNDATIONAL PILLARS
            </span>
            <h4 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Why Village Deli?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pil, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-[#12281c] border border-[#234934] p-5 rounded-2xl flex flex-col justify-between hover:border-[#6cb33f] hover:bg-[#173323] transition-all shadow-md"
              >
                <div>
                  <div className="text-xs font-bold text-[#7ad048] mb-2 font-mono">0{idx + 1}</div>
                  <h5 className="text-sm font-bold font-serif text-white mb-2 leading-snug">
                    {pil.title}
                  </h5>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {pil.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

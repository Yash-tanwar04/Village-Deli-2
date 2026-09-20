import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Fuel, ShoppingBag, Coffee, Home, Users, Clock, ArrowRight } from 'lucide-react';

export const StoreFormats: React.FC = () => {
  return (
    <section id="formats" className="py-24 md:py-32 bg-[#091710] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-3 border border-[#6cb33f]/30"
          >
            STORE ARCHITECTURE & FORMATS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight mb-4"
          >
            Two Flexible Store Formats
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-light"
          >
            Standardized, modular layouts designed for maximum unit economics across expressway hubs and urban residential clusters.
          </motion.p>
        </div>

        {/* 2 Formats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Format 1: Waypoint Highway Hub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="bg-[#12281c] rounded-3xl overflow-hidden border border-[#234934] shadow-2xl hover:border-[#6cb33f] transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-900">
              <img
                src="/assets/format_waypoint_highway_hub.webp"
                alt="Waypoint Highway Hub format render"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12281c] via-black/30 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-[#0d1f15]/90 backdrop-blur-md text-[#7ad048] text-xs font-bold px-3.5 py-1 rounded-full border border-[#6cb33f]/40">
                HIGHWAY MOBILITY HUB
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                  WAYPOINT HIGHWAY HUB
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#fed100] font-stat">1,500 – 3,000</span>
                  <span className="text-xs tracking-wider uppercase font-semibold text-stone-300">SQ.FT.</span>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Highway & Travel Hubs</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Built for expressways & transit</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Fuel Stations & Stops</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Captive 24/7 refueling footfall</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Food & Juice Bar</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Bakery, hot meals & beverages</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#fed100]/25 text-[#fed100] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">EV Charging Enabled</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">High dwell time monetization</div>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#173323] hover:bg-[#6cb33f] text-white font-semibold text-sm transition-all duration-300 border border-[#6cb33f]/40 group/btn"
              >
                <span>Propose Highway Property</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Format 2: Neighborhood Express */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-[#12281c] rounded-3xl overflow-hidden border border-[#234934] shadow-2xl hover:border-[#6cb33f] transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-900">
              <img
                src="/assets/format_neighborhood_express.webp"
                alt="Neighborhood Express format render"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12281c] via-black/30 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-[#0d1f15]/90 backdrop-blur-md text-[#7ad048] text-xs font-bold px-3.5 py-1 rounded-full border border-[#6cb33f]/40">
                URBAN RESIDENTIAL ANCHOR
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                  NEIGHBORHOOD EXPRESS
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#fed100] font-stat">500 – 1,200</span>
                  <span className="text-xs tracking-wider uppercase font-semibold text-stone-300">SQ.FT.</span>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Residential Enclaves</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">High-density apartments & sectors</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Daily Needs & Essentials</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Fresh produce, milk, dairy & bakes</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">24/7 Access & Speed</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Quick frictionless checkout</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091710] border border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#6cb33f]/15 text-[#7ad048] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">High Repeat Loyalty</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Predictable daily recurring sales</div>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#173323] hover:bg-[#6cb33f] text-white font-semibold text-sm transition-all duration-300 border border-[#6cb33f]/40 group/btn"
              >
                <span>Propose Urban Property</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Limited Territories Callout */}
        <div className="bg-gradient-to-r from-[#173323] to-[#234934] text-white rounded-3xl p-8 sm:p-10 border border-[#6cb33f]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-[#fed100] text-xs font-bold tracking-widest uppercase mb-1.5">
              LIMITED TERRITORIES AVAILABLE
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold">
              Be a part of India's Convenience Revolution.
            </div>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-bold px-8 py-4 rounded-full text-sm shrink-0 transition-all shadow-lg hover:scale-105"
          >
            <span>Inquire for Format</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

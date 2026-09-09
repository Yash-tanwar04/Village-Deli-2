import React from 'react';
import { Zap, Fuel, ShoppingBag, Coffee, Home, Users, Clock, ArrowRight } from 'lucide-react';

export const StoreFormats: React.FC = () => {
  return (
    <section id="formats" className="py-20 md:py-28 bg-[#f4f6ee] text-[#12281c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#6cb33f]/15 text-[#3b711e] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30">
            STORE ARCHITECTURE & FORMATS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0d1f15] tracking-tight mb-4">
            Two Flexible Store Formats
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Standardized, modular layouts designed for maximum unit economics across expressway hubs and urban neighborhoods.
          </p>
        </div>

        {/* 2 Formats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Format 1: Waypoint Highway Hub */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-lg hover:shadow-2xl hover:border-[#6cb33f] transition-all duration-300 flex flex-col group">
            <div className="relative h-64 overflow-hidden bg-stone-900">
              <img
                src="/assets/format_waypoint_highway_hub.jpg"
                alt="Waypoint Highway Hub format render"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-[#0d1f15]/90 backdrop-blur-md text-[#7ad048] text-xs font-bold px-3 py-1 rounded-full border border-[#6cb33f]/40">
                HIGHWAY MOBILITY HUB
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold font-serif text-white tracking-tight">
                  WAYPOINT HIGHWAY HUB
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#fed100] font-stat">1,500 – 3,000</span>
                  <span className="text-xs tracking-wider uppercase font-semibold text-stone-300">SQ.FT.</span>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">Highway & Travel Hubs</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Built for expressways & transit</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">Fuel Stations & Truck Stops</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Captive 24/7 refueling footfall</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">Food, Beverages & Essentials</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Bakery, hot meals & juice bar</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#fed100]/25 text-[#7c6200] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">EV Charging Enabled</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">High-speed charging dwell time</div>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#173323] hover:bg-[#6cb33f] text-white font-semibold text-sm transition-colors duration-200"
              >
                <span>Propose Highway Property</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Format 2: Neighborhood Express */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-lg hover:shadow-2xl hover:border-[#6cb33f] transition-all duration-300 flex flex-col group">
            <div className="relative h-64 overflow-hidden bg-stone-900">
              <img
                src="/assets/format_neighborhood_express.jpg"
                alt="Neighborhood Express format render"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-[#0d1f15]/90 backdrop-blur-md text-[#7ad048] text-xs font-bold px-3 py-1 rounded-full border border-[#6cb33f]/40">
                URBAN RESIDENTIAL ANCHOR
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold font-serif text-white tracking-tight">
                  NEIGHBORHOOD EXPRESS
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#fed100] font-stat">500 – 1,200</span>
                  <span className="text-xs tracking-wider uppercase font-semibold text-stone-300">SQ.FT.</span>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">Residential Communities</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">High-density apartments & colonies</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">Daily Needs & Essentials</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Fresh produce, milk, dairy & bakes</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">24/7 Access & Convenience</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Round-the-clock convenience</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4f6ee] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6cb33f]/15 text-[#3b711e] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0d1f15]">Loyal Customers Daily Sales</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Predictable, repeat daily basket size</div>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#173323] hover:bg-[#6cb33f] text-white font-semibold text-sm transition-colors duration-200"
              >
                <span>Propose Urban Property</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Limited Territories Callout from PDF 2 */}
        <div className="bg-gradient-to-r from-[#173323] to-[#234934] text-white rounded-2xl p-6 sm:p-7 border border-[#6cb33f]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="text-[#fed100] text-xs font-bold tracking-widest uppercase mb-1">
              LIMITED TERRITORIES AVAILABLE
            </div>
            <div className="text-lg sm:text-xl font-serif font-semibold">
              Be a part of India's Convenience Revolution.
            </div>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-semibold px-6 py-3 rounded-full text-sm shrink-0 transition-all shadow-md"
          >
            <span>Inquire for Format</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

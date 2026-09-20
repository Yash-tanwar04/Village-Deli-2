import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Calculator } from 'lucide-react';

export const InvestmentFICO: React.FC = () => {
  // Calculator strictly constrained to the PDF's 18 - 28 Lakhs net monthly revenue
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(2200000); // 22 Lakhs default
  const revSharePct = 0.07; // 7% from PDF
  const calculatedShare = monthlyRevenue * revSharePct;
  const annualShare = calculatedShare * 12;

  const generalTerms = [
    'Flat 7% of net revenue share — whichever is higher',
    '3-year lock-in period',
    'Capex fully amortised in 3 years',
    'Transparent, scalable and sustainable model',
  ];

  const investorValuePoints = [
    'Partner in a future-ready 24/7 convenience retail network',
    'Attractive returns with low operational complexity',
    'Powered by technology, data & centralised operations',
    'Building a pan-North India brand with long-term scalability',
    'Trusted quality, consistent experience, strong consumer connect',
  ];

  return (
    <section id="investment" className="py-24 md:py-32 bg-[#091710] text-white relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6cb33f]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fed100]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Tag and Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30"
          >
            THE INVESTMENT
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4"
          >
            The FICO Model
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-light leading-relaxed"
          >
            Franchise Invested Company Operated — a win-win partnership designed for high returns, hassle-free operations and long-term value creation.
          </motion.p>
        </div>

        {/* 3 Prominent Investment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Rate per sq ft */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="bg-[#6cb33f] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#0d1f15] block mb-2">
                CAPITAL INVESTMENT
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-stat tracking-tight mb-2">
                ₹3,500 <span className="text-lg font-bold font-sans">/ SQ.FT.</span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Including opening stocks
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 text-xs text-white/90 font-medium">
              <span className="font-bold">+ ₹5,00,000 signup fee</span> (interior design package)
            </div>
          </motion.div>

          {/* Card 2: Store Size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-[#fed100] text-[#0d1f15] p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
          >
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#0d1f15]/70 block mb-2">
                STORE SPECIFICATIONS
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-stat tracking-tight mb-2">
                1,200 – 1,500
              </div>
              <p className="text-sm font-bold uppercase tracking-wider">
                Sq.Ft. average store size
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 text-xs font-medium text-[#0d1f15]/80">
              Primarily on highways & petrol pumps (24/7 license at all Haryana locations)
            </div>
          </motion.div>

          {/* Card 3: 50+ Locations (TARGET) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="bg-[#12281c] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-[#234934] hover:border-[#6cb33f] relative overflow-hidden group transition-all duration-300"
          >
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#7ad048] block mb-2">
                TARGET
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-stat tracking-tight text-white mb-2">
                50+ LOCATIONS
              </div>
              <p className="text-sm text-stone-200">
                in Haryana in the next 12 months
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#fed100] font-bold tracking-wide">
              50+ LOCATIONS TARGETED in Punjab in Phase 1
            </div>
          </motion.div>
        </div>

        {/* 2-Column Section: General Terms on Left, Collaboration on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* General Terms Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-[#12281c] p-8 sm:p-10 rounded-3xl border border-[#234934] shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[#7ad048] uppercase tracking-wider">
                  GENERAL TERMS
                </h3>
                <span className="text-[11px] font-semibold text-[#7ad048] bg-[#173323] border border-[#6cb33f]/30 px-3 py-1 rounded-full">
                  FICO Structure
                </span>
              </div>
              <div className="space-y-4">
                {generalTerms.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#173323] text-[#7ad048] border border-[#234934] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-stone-200 leading-snug">
                      {term}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 text-xs text-stone-400 leading-relaxed">
              <strong className="text-white">Company Operated:</strong> Turnkey inventory, billing, staffing, and 24/7 operational management handled end-to-end.
            </div>
          </motion.div>

          {/* Strategic Collaboration Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-gradient-to-br from-[#173323] via-[#12281c] to-[#0d1f15] text-white p-8 sm:p-10 rounded-3xl border border-[#6cb33f]/30 shadow-xl flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#fed100] block mb-2">
                GOVERNMENT & COOPERATIVE STRENGTH
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-4">
                In Strategic Collaboration With
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-light">
                Backing each location with established state-level cooperative brand equity, robust cold chains, and high everyday consumer demand.
              </p>
            </div>

            <div className="bg-white/95 p-5 rounded-2xl flex items-center justify-center shadow-inner">
              <img
                src="/assets/collab_har_hith_vita.png"
                alt="Strategic Collaboration: Har Hith Store + Vita"
                className="max-h-16 w-auto object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Financial Projection & Investor Value Section */}
        <div className="bg-[#0d1f15] text-white rounded-3xl p-8 sm:p-12 border border-[#234934] shadow-2xl mb-14">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold uppercase tracking-wider mb-3 border border-[#6cb33f]/30">
              THE RETURNS
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-3">
              Financial Projection & Investor Value
            </h3>
            <p className="text-stone-300 text-sm sm:text-base font-light">
              Predictable, annuity-like cash flows secured by high-margin merchandise and round-the-clock footfall.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            {/* Financial Projection Key Numbers Card */}
            <div className="lg:col-span-6 bg-[#12281c] border border-[#234934] p-8 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 text-xs font-bold text-[#fed100] uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-[#fed100]" />
                <span>FINANCIALS PROJECTION (INDICATIVE) — PER STORE AVG.</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                    Average Store Size
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#7ad048] font-stat">
                    1,200 – 1,500 <span className="text-sm font-sans text-stone-300 font-semibold">SQ.FT.</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                    Avg. Monthly Net Revenue
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#fed100] font-stat">
                    ₹18 – 28 LAKHS
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                    Revenue Share Model
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-stat">
                    7% NET REVENUE SHARE
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    Whichever is higher
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-[11px] text-stone-400 italic">
                  *Figures are indicative and subject to location, format and market conditions. Flat 7% of net revenue share — whichever is higher.
                </span>
              </div>
            </div>

            {/* Strong Value for Investors (5 Star Points) */}
            <div className="lg:col-span-6 space-y-3.5">
              <h4 className="text-lg font-bold font-serif text-[#7ad048] uppercase tracking-wider mb-4">
                STRONG VALUE FOR INVESTORS
              </h4>

              {investorValuePoints.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-[#173323]/70 border border-[#234934] p-4 rounded-xl flex items-start gap-3 hover:border-[#6cb33f]/50 hover:bg-[#173323] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#6cb33f] text-[#0d1f15] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Star className="w-4 h-4 fill-[#0d1f15]" />
                  </div>
                  <p className="text-sm text-stone-200 font-medium leading-relaxed">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Indicative Revenue Explorer strictly using PDF numbers */}
          <div className="bg-[#173323] border border-[#6cb33f]/40 p-6 sm:p-8 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-bold text-[#fed100] uppercase tracking-wider">
                  INDICATIVE REVENUE ESTIMATOR
                </div>
                <h4 className="text-xl font-bold font-serif text-white">
                  Explore 7% Revenue Share (₹18L – ₹28L Range)
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400">Selected Monthly Store Net Revenue:</span>
                <div className="text-2xl font-bold text-[#fed100] font-stat">
                  ₹{(monthlyRevenue / 100000).toFixed(1)} Lakhs
                </div>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="range"
                min={1800000}
                max={2800000}
                step={50000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-[#6cb33f] cursor-pointer h-2 bg-stone-700 rounded-lg"
              />
              <div className="flex justify-between text-xs text-stone-400 mt-2 font-mono">
                <span>₹18 Lakhs (Min PDF Projection)</span>
                <span>₹28 Lakhs (Max PDF Projection)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="bg-[#12281c] p-4 rounded-xl border border-white/10">
                <span className="text-xs text-stone-400 block mb-1">
                  Indicative Monthly 7% Share
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#7ad048] font-stat">
                  ₹{Math.round(calculatedShare).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">
                  (Whichever is higher)
                </span>
              </div>

              <div className="bg-[#12281c] p-4 rounded-xl border border-white/10">
                <span className="text-xs text-stone-400 block mb-1">
                  Indicative Annualized 7% Share
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#fed100] font-stat">
                  ₹{Math.round(annualShare).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">
                  Fully amortised capex protection
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pitch Deck Quote */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-lg font-serif italic text-stone-300 font-light">
            “Village DELI is not just a store. It's a lifestyle enabler, a trust builder, and a future-ready business.”
          </p>
        </div>
      </div>
    </section>
  );
};

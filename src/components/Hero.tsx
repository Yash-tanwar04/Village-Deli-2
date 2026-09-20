import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, ShoppingBag, Coffee, Utensils, GlassWater, ShieldCheck, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const highlightMetrics = [
    { value: '₹6+ Lakh Cr.', label: 'Convenience Retail by 2027' },
    { value: '20%+ CAGR', label: 'Segment Growth Rate' },
    { value: '100,000+', label: 'Fuel Station Opportunities' },
    { value: '50+ Locations', label: 'Pilot Haryana Target' },
  ];

  const departments = [
    { icon: ShoppingBag, label: 'GROCERIES', sub: 'Daily Essentials' },
    { icon: Sparkles, label: 'FRESH PRODUCE', sub: 'Farm Fresh' },
    { icon: Coffee, label: 'FRESH BAKERY', sub: 'Artisan Baked' },
    { icon: Utensils, label: 'QUICK MEALS', sub: 'Hot & Tasty' },
    { icon: GlassWater, label: 'COLD-PRESS JUICE', sub: 'Pure Goodness' },
    { icon: Clock, label: '24/7 OPEN', sub: 'Always Reliable' },
  ];

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#091710] via-[#0d1f15] to-[#12281c] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#fed100]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badges: Haryana Opening & 24/7 Round The Clock */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#173323] border border-[#6cb33f]/40 text-[#7ad048] text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#fed100] animate-ping"></span>
            <span>OPENING SOON • HARYANA</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#234934]/60 border border-white/10 text-stone-200 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#fed100]" />
            <span>24/7 OPEN ROUND-THE-CLOCK</span>
          </div>
        </motion.div>

        {/* Main Editorial Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif leading-[1.1] mb-6"
          >
            The Next-Generation Convenience Destination for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ad048] via-[#6cb33f] to-[#fed100] italic">
              India's New Lifestyle.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#6cb33f]"></span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-bold text-white font-serif">Village</span>
              <span className="text-lg sm:text-2xl font-black text-[#6cb33f] tracking-wider">DELI</span>
              <span className="text-xs sm:text-sm text-stone-300 font-semibold tracking-widest uppercase ml-2">
                — ALWAYS HERE FOR YOU
              </span>
            </div>
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#6cb33f]"></span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
          >
            India is transforming. Lifestyles are evolving. Consumers want convenience, quality, freshness and trust — 24/7.
            Village DELI is built for this new India.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#experience"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg shadow-[#6cb33f]/25 hover:scale-[1.02] group"
            >
              <span>Explore Village Deli</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#investment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-stone-100 font-semibold px-8 py-4 rounded-full text-base border border-stone-400/40 hover:border-white transition-all duration-200"
            >
              <span>Franchise & Investment</span>
            </a>
          </motion.div>
        </div>

        {/* Feature Highlights Grid from Page 2 Canopy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 max-w-5xl mx-auto mb-10"
        >
          {departments.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#173323]/70 backdrop-blur-sm border border-[#234934] rounded-2xl p-3 text-center flex flex-col items-center justify-center hover:border-[#6cb33f]/50 hover:bg-[#173323] transition-all hover:-translate-y-1 shadow-md"
            >
              <item.icon className="w-5 h-5 text-[#7ad048] mb-1.5" />
              <div className="text-xs font-bold text-white tracking-wide">{item.label}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Primary Storefront Showcase Render */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#234934] shadow-2xl bg-[#091710] group max-w-6xl mx-auto mb-14"
        >
          <img
            src="/assets/storefront_opening_soon.webp"
            alt="Village Deli Flagship Storefront with modern glass facade and canopy departments"
            className="w-full h-auto object-cover max-h-[620px] transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091710] via-black/20 to-transparent opacity-80"></div>

          {/* Floating Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="bg-[#091710]/90 backdrop-blur-md border border-[#234934] px-5 py-3 rounded-2xl max-w-md shadow-xl">
              <div className="text-[#fed100] text-xs font-bold uppercase tracking-wider mb-1">Eat Fresh • Live Well</div>
              <div className="text-sm sm:text-base text-stone-200 font-medium">
                Good Food, Good Mood — 24 Hours Round-the-Clock
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block text-[11px] text-stone-400 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                *Image: AI Generated
              </span>
            </div>
          </div>
        </motion.div>

        {/* Key Statistics Cards (Including Pilot Haryana Target) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {highlightMetrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="text-center p-6 rounded-2xl bg-[#12281c] border border-[#234934] hover:border-[#6cb33f]/60 hover:bg-[#173323] transition-all shadow-lg"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#7ad048] font-stat mb-1.5">
                {m.value}
              </div>
              <div className="text-xs sm:text-sm text-stone-300 font-medium">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategic Alliance Sub-strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6cb33f]" />
            <span>In strategic collaboration with <strong className="text-white">Har Hit Store + Vita</strong></span>
          </div>
          <div className="text-[#fed100] font-semibold tracking-wider uppercase text-[11px]">
            BUILT FOR TODAY. DESIGNED FOR TOMORROW.
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-10">
          <a
            href="#why-us"
            aria-label="Scroll to next section"
            className="text-stone-400 hover:text-[#7ad048] transition-colors animate-bounce p-2"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

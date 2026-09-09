import React from 'react';
import { ArrowRight, Clock, Sparkles, ShoppingBag, Coffee, Utensils, GlassWater, ShieldCheck, Users } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#091710] via-[#0d1f15] to-[#12281c] overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6cb33f]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#fed100]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badge: Opening Soon in Haryana & 24/7 Round The Clock */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#173323] border border-[#6cb33f]/40 text-[#7ad048] text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#fed100] animate-ping"></span>
            <span>OPENING SOON • HARYANA</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#234934]/60 border border-white/10 text-stone-200 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#fed100]" />
            <span>24/7 OPEN ROUND-THE-CLOCK</span>
          </div>
        </div>

        {/* Main Editorial Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif leading-[1.1] mb-6">
            The Next-Generation Convenience Destination for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ad048] via-[#6cb33f] to-[#fed100] italic">
              India's New Lifestyle.
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-12 bg-[#6cb33f]/50"></span>
            <p className="text-base sm:text-xl font-medium tracking-widest text-[#7ad048] uppercase font-sans">
              Village DELI — ALWAYS HERE FOR YOU
            </p>
            <span className="h-px w-12 bg-[#6cb33f]/50"></span>
          </div>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            India is transforming. Lifestyles are evolving. Consumers want convenience, quality, freshness and trust — 24/7.
            Village DELI is built for this new India.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#experience"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6cb33f] hover:bg-[#7ad048] text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg shadow-[#6cb33f]/25 hover:scale-[1.02]"
            >
              <span>Explore Village Deli</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#investment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-stone-100 font-semibold px-8 py-4 rounded-full text-base border border-stone-400/40 hover:border-white transition-all duration-200"
            >
              <span>Franchise & Investment</span>
            </a>
          </div>
        </div>

        {/* Feature Highlights Grid from Page 2 Canopy */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 max-w-5xl mx-auto mb-8">
          {[
            { icon: ShoppingBag, label: 'GROCERIES', sub: 'Daily Essentials' },
            { icon: Sparkles, label: 'FRESH PRODUCE', sub: 'Farm Fresh' },
            { icon: Coffee, label: 'FRESH BAKERY', sub: 'Artisan Baked' },
            { icon: Utensils, label: 'QUICK MEALS', sub: 'Hot & Tasty' },
            { icon: GlassWater, label: 'COLD-PRESS JUICE', sub: 'Pure Goodness' },
            { icon: Clock, label: '24/7 OPEN', sub: 'Always Reliable' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#173323]/70 backdrop-blur-sm border border-[#234934] rounded-xl p-3 text-center flex flex-col items-center justify-center hover:border-[#6cb33f]/50 transition-all hover:-translate-y-0.5"
            >
              <item.icon className="w-5 h-5 text-[#7ad048] mb-1.5" />
              <div className="text-xs font-bold text-white tracking-wide">{item.label}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Primary Storefront Showcase Render */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#234934] shadow-2xl bg-[#091710] group">
          <img
            src="/assets/storefront_opening_soon.jpg"
            alt="Village Deli Flagship Storefront with modern glass facade and canopy departments"
            className="w-full h-auto object-cover max-h-[640px] transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091710] via-transparent to-transparent opacity-80"></div>

          {/* Floating Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="bg-[#091710]/90 backdrop-blur-md border border-[#234934] px-5 py-3 rounded-xl max-w-md">
              <div className="text-[#fed100] text-xs font-bold uppercase tracking-wider mb-1">Eat Fresh • Live Well</div>
              <div className="text-sm sm:text-base text-stone-200 font-medium">
                Good Food, Good Mood — 24 Hours Round-the-Clock
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block text-[11px] text-stone-400 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">
                *Image: AI Generated
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Banner from Page 2 & Page 19 */}
        <div className="mt-8 pt-6 border-t border-[#234934]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-300">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 font-medium text-white">
              <ShieldCheck className="w-4 h-4 text-[#6cb33f]" />
              <span>TRUSTED PARTNERS</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-2 font-medium text-white">
              <Users className="w-4 h-4 text-[#6cb33f]" />
              <span>STRONGER TOGETHER</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-2 font-medium text-white">
              <Sparkles className="w-4 h-4 text-[#6cb33f]" />
              <span>BETTER FOR YOU</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-xs">
            <span>In strategic collaboration with</span>
            <span className="font-semibold text-white bg-[#173323] px-2.5 py-1 rounded border border-[#6cb33f]/30">
              Har Hit Store + Vita
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

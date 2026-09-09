import React from 'react';
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
      source: '',
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
    <section id="opportunity" className="py-20 md:py-28 bg-[#091710] text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#6cb33f_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Tag and Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30">
            MARKET OPPORTUNITY
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-4">
            The Scope Is Massive
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            A once-in-a-generation shift towards 24/7 organized convenience retail across India's high-density corridors.
          </p>
        </div>

        {/* 4 Stats Cards + Family Image Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* 4 Stat Cards in 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#12281c] border border-[#234934] p-6 sm:p-7 rounded-2xl flex flex-col justify-between hover:border-[#6cb33f]/60 hover:bg-[#173323] transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#173323] group-hover:bg-[#6cb33f]/20 text-[#7ad048] flex items-center justify-center mb-5 transition-colors border border-[#234934]">
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
                  <span className="text-[11px] text-stone-400 font-mono tracking-tight">
                    {stat.source}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Right Showcase: Family Shopping Visual from Page 4 */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#234934] shadow-xl min-h-[380px] group">
            <img
              src="/assets/family_shopping_produce.webp"
              alt="Indian family shopping for fresh produce and groceries at Village Deli"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091710] via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#0d1f15]/90 backdrop-blur-md rounded-xl border border-white/10">
              <div className="text-xs text-[#fed100] font-bold tracking-widest uppercase mb-1">
                Millions of Urban Households
              </div>
              <div className="text-xs text-stone-300">
                Seeking hygienic, dependable convenience retail around the clock.
              </div>
            </div>
          </div>
        </div>

        {/* Subsection: Market Trends Driving The Opportunity (Page 5) */}
        <div className="pt-8 border-t border-[#234934]/70">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-2">
              Market Trends Driving The Opportunity
            </h3>
            <p className="text-sm text-stone-300">
              Structural macro drivers fueling the rapid rise of 24/7 convenience formats across urban and highway India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {trends.map((tr, idx) => (
              <div
                key={idx}
                className="bg-[#12281c] border border-[#234934] p-5 rounded-2xl text-center flex flex-col items-center hover:border-[#6cb33f]/50 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#173323] border border-[#234934] text-[#7ad048] flex items-center justify-center mb-4 group-hover:bg-[#6cb33f] group-hover:text-white transition-colors">
                  <tr.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold tracking-wider text-[#7ad048] mb-2 uppercase font-sans">
                  {tr.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {tr.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Community Banner from Page 5 */}
          <div className="bg-gradient-to-r from-[#173323] via-[#1d3e2b] to-[#173323] border border-[#6cb33f]/30 rounded-2xl p-6 text-center shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <HeartHandshake className="w-6 h-6 text-[#7ad048]" />
              <p className="text-lg sm:text-xl font-serif italic text-white">
                “Supporting Local. Strengthening Communities. Enriching Lives.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

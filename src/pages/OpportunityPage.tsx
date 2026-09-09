import React from 'react';
import { ShoppingBag, TrendingUp, Fuel, Building2, Clock, Route, Store, Train, Briefcase, Home } from 'lucide-react';

export const OpportunityPage: React.FC = () => {
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
      unit: 'OF HOUSEHOLDS',
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

  const whereWePlay = [
    { num: '01', title: 'Major Highways', desc: 'Built for expanding expressway corridors.', icon: Route },
    { num: '02', title: 'Petrol Pumps & Fuel Stations', desc: '24/7 license across all Haryana locations.', icon: Fuel },
    { num: '03', title: 'Urban & Suburban Neighborhoods', desc: 'Designed for growing cities.', icon: Home },
    { num: '04', title: 'Residential Townships', desc: 'Serving daily household needs.', icon: Building2 },
    { num: '05', title: 'Transit Corridors', desc: 'High-footfall commuter locations.', icon: Train },
    { num: '06', title: 'Commercial & Mixed-Use Spaces', desc: 'Where people live, work and refuel.', icon: Briefcase },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#091710] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-3 border border-[#6cb33f]/30">
            MARKET OPPORTUNITY
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4">
            The Scope Is Massive
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            A generational transformation in consumer behavior, highway mobility, and round-the-clock convenience.
          </p>
        </div>

        {/* 1. 4 STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#12281c] border border-[#234934] p-6 rounded-2xl flex flex-col justify-between hover:border-[#6cb33f] transition-all shadow-md"
            >
              <div>
                <stat.icon className="w-8 h-8 text-[#7ad048] mb-4" />
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-[#7ad048] font-stat">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider font-sans">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-medium mb-3">
                  {stat.label}
                </p>
              </div>
              {stat.source && (
                <span className="text-[10px] text-stone-400 font-mono">
                  {stat.source}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 2. MARKET TRENDS */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Market Trends Driving The Opportunity
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Supporting Local. Strengthening Communities. Enriching Lives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {trends.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#12281c] border border-[#234934] p-5 rounded-2xl text-center flex flex-col items-center hover:border-[#6cb33f]/50 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#173323] text-[#7ad048] flex items-center justify-center mb-3">
                  <t.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-[#7ad048] mb-1.5 uppercase">
                  {t.title}
                </h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WHERE WE PLAY */}
        <div className="pt-8 border-t border-[#234934]/60">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Where We Play
            </h2>
            <p className="text-xs text-[#7ad048] font-semibold mt-1">
              Purpose-built for where convenience matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whereWePlay.map((loc, idx) => (
              <div
                key={idx}
                className="bg-[#12281c] border border-[#234934] p-5 rounded-2xl flex items-start gap-4 hover:border-[#6cb33f] transition-all"
              >
                <span className="text-2xl font-black text-[#7ad048] font-stat">
                  {loc.num}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {loc.title}
                  </h4>
                  <p className="text-xs text-stone-300 font-light">
                    {loc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

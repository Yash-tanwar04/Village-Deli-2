import React from 'react';
import { Route, Fuel, Home, Building2, Train, Briefcase, CheckCircle2 } from 'lucide-react';

export const WhereWePlay: React.FC = () => {
  const locations = [
    {
      num: '01',
      title: 'Major Highways',
      desc: 'Built for expanding expressway corridors.',
      icon: Route,
      tag: 'Expressways & Arterial Corridors',
    },
    {
      num: '02',
      title: 'Petrol Pumps & Fuel Stations',
      desc: '24/7 license across all Haryana locations.',
      icon: Fuel,
      tag: 'Strategic Mobility Hubs',
    },
    {
      num: '03',
      title: 'Urban & Suburban Neighborhoods',
      desc: 'Designed for growing cities.',
      icon: Home,
      tag: 'High-Density Residential',
    },
    {
      num: '04',
      title: 'Residential Townships',
      desc: 'Serving daily household needs.',
      icon: Building2,
      tag: 'Gated Communities & Townships',
    },
    {
      num: '05',
      title: 'Transit Corridors',
      desc: 'High-footfall commuter locations.',
      icon: Train,
      tag: 'Commuter Interchanges & Metros',
    },
    {
      num: '06',
      title: 'Commercial & Mixed-Use Spaces',
      desc: 'Where people live, work and refuel.',
      icon: Briefcase,
      tag: 'Corporate Hubs & Plazas',
    },
  ];

  return (
    <section id="where-we-play" className="py-20 md:py-28 bg-[#12281c] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Tag and Headline */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30">
            LOCATION STRATEGY
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white mb-3">
            Where We Play
          </h2>
          <p className="text-xl sm:text-2xl text-[#7ad048] font-serif italic mb-4">
            Purpose-built for where convenience matters most.
          </p>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            From high-speed arterial expressways to bustling residential enclaves, Village Deli is deployed where customer footfall, vehicle density, and round-the-clock demand converge.
          </p>
        </div>

        {/* 6 Location Format Cards (01 to 06) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-[#0d1f15] border border-[#234934] p-7 rounded-2xl relative overflow-hidden group hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#7ad048] font-stat tracking-tight">
                    {loc.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#173323] border border-[#234934] text-[#7ad048] flex items-center justify-center group-hover:bg-[#6cb33f] group-hover:text-white transition-colors">
                    <loc.icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-[#7ad048] transition-colors">
                  {loc.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-light mb-4">
                  {loc.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-stone-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7ad048]" />
                <span>{loc.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Purpose-Built Summary Bar from Page 16 */}
        <div className="bg-[#173323] border border-[#6cb33f]/30 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
          <h4 className="text-lg sm:text-xl font-serif font-bold text-white mb-3">
            Purpose-Built For Where Convenience Matters Most
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-300 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7ad048]"></span>
              Built for highways, fuel stations & mobility hubs
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7ad048]"></span>
              Designed for urban neighborhoods & growing cities
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fed100]"></span>
              24/7 convenience for every moment of your day
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';

export const ExpansionVision: React.FC = () => {
  const phases = [
    {
      phase: 'PHASE 0',
      title: 'Haryana',
      highlight: '50 locations in the next 12 months',
      details: 'Across highways and petrol pumps',
      color: 'border-[#6cb33f] bg-[#6cb33f]/10 text-[#7ad048]',
      badge: 'bg-[#6cb33f] text-white',
      status: 'Active Launch Phase',
    },
    {
      phase: 'PHASE 1',
      title: 'Punjab',
      highlight: '50+ locations targeted',
      details: 'Expanding the highway & urban network',
      color: 'border-[#488425] bg-[#488425]/10 text-[#7ad048]',
      badge: 'bg-[#488425] text-white',
      status: 'Targeted Scale',
    },
    {
      phase: 'PHASE 2',
      title: 'Delhi NCR, UP, Uttarakhand & HP',
      highlight: 'Strategic Regional Corridors',
      details: 'Regions connected by strong highway infrastructure & growing suburbs',
      color: 'border-[#1e6091] bg-[#1e6091]/10 text-[#64b5f6]',
      badge: 'bg-[#1e6091] text-white',
      status: 'Pan-North India Expansion',
    },
  ];

  const pillars = [
    {
      title: 'Changing Lifestyles, Growing Needs',
      desc: 'Increasing demand for 24/7 convenience, quality and speed.',
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
    <section id="expansion" className="py-20 md:py-28 bg-[#091710] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30">
            OUR EXPANSION VISION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white mb-6">
            Built for the Way North India Lives
          </h2>
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
            Launching first in Haryana through a strategic collaboration, Village DELI is designed to become North India's leading premium 24/7 convenience retail network. Our expansion vision extends across Punjab, Delhi NCR, Uttar Pradesh, Uttarakhand and Himachal Pradesh — regions connected by strong highway infrastructure, rapidly growing cities, and thriving suburban communities.
          </p>
        </div>

        {/* Vision Quote Box */}
        <div className="bg-[#12281c] border-l-4 border-[#6cb33f] p-6 sm:p-8 rounded-r-2xl mb-16 shadow-lg">
          <p className="text-base sm:text-xl font-serif italic text-stone-200 leading-relaxed">
            “As North India's cities continue to grow and lifestyles become increasingly round-the-clock, Village DELI is creating a retail format that delivers premium convenience, trusted local products, and freshly prepared food — wherever people live, work, travel and refuel.”
          </p>
        </div>

        {/* Expansion Roadmap and Regional Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Roadmap Phases */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#7ad048] mb-2">
              GROWTH ROADMAP
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-6">
              Aggressive Expansion Across North India
            </h3>
            <p className="text-sm text-stone-300 mb-6">
              Opening soon across major highways of Haryana and urban neighborhoods — then scaling across North India's fastest-growing corridors.
            </p>

            <div className="space-y-4">
              {phases.map((ph, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-6 transition-all hover:bg-[#173323] ${ph.color}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`text-xs font-black tracking-wider px-3 py-1 rounded-full uppercase ${ph.badge}`}>
                      {ph.phase}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-400">
                      {ph.status}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold font-serif text-white mb-1">
                    {ph.title}
                  </h4>
                  <div className="text-sm font-semibold text-[#fed100] mb-1">
                    {ph.highlight}
                  </div>
                  <p className="text-xs text-stone-300">
                    {ph.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Map Graphic from Page 15 */}
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
                src="/assets/map_expansion_roadmap.png"
                alt="Map of North India showing Haryana, Punjab, and Phase 2 expansion territories"
                className="max-h-[380px] w-auto object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Why Village Deli: 5 Strategic Foundation Cards (Page 9) */}
        <div>
          <div className="text-center mb-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7ad048]">
              WHY VILLAGE DELI?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pil, idx) => (
              <div
                key={idx}
                className="bg-[#12281c] border border-[#234934] p-5 rounded-2xl flex flex-col justify-between hover:border-[#6cb33f] transition-colors"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

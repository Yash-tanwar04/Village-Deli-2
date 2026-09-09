import React from 'react';
import { Clock, Layers, Sparkles, Cpu, Maximize2, ShieldCheck } from 'lucide-react';

export const CompetitiveAdvantage: React.FC = () => {
  const advantages = [
    {
      title: '24/7 Operations',
      desc: 'Always open. Always reliable.',
      icon: Clock,
      badge: 'ROUND-THE-CLOCK',
    },
    {
      title: 'Integrated Format',
      desc: 'Groceries, produce, bakery, quick meals, beverages, essentials — all in one place.',
      icon: Layers,
      badge: 'ALL-IN-ONE',
    },
    {
      title: 'Onsite Differentiators',
      desc: 'Flour mill and cold-press juice station delivering freshness like never before.',
      icon: Sparkles,
      badge: 'PURE FRESHNESS',
    },
    {
      title: 'Technology Enabled',
      desc: 'Smart inventory, seamless billing and data-driven operations.',
      icon: Cpu,
      badge: 'DATA-DRIVEN',
    },
    {
      title: 'Scalable Model',
      desc: 'Plug-and-play format for highways, fuel stations and urban neighborhoods.',
      icon: Maximize2,
      badge: 'PLUG & PLAY',
    },
    {
      title: 'Trusted Quality',
      desc: 'Hygienic, reliable and consistent products customers depend on.',
      icon: ShieldCheck,
      badge: 'ASSURED TRUST',
    },
  ];

  return (
    <section id="edge" className="py-20 md:py-28 bg-[#0d1f15] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Tag and Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173323] text-[#7ad048] text-xs font-bold tracking-widest uppercase mb-4 border border-[#6cb33f]/30">
            COMPETITIVE ADVANTAGE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white mb-4">
            Our Unique Edge
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Engineered from ground up to outperform traditional fragmented retail through integration, operational efficiency, and customer trust.
          </p>
        </div>

        {/* 6 Cards Grid (2x3 on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#12281c] border border-[#234934] p-7 rounded-2xl flex flex-col justify-between hover:border-[#6cb33f] hover:bg-[#173323] transition-all duration-300 group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#173323] border border-[#234934] text-[#7ad048] group-hover:bg-[#6cb33f] group-hover:text-white flex items-center justify-center transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 bg-[#091710] px-2.5 py-1 rounded border border-white/5 tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-white mb-2 group-hover:text-[#7ad048] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-[#7ad048] font-semibold gap-1 group-hover:translate-x-1 transition-transform">
                <span>Core Pillar 0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
